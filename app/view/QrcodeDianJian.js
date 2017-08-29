/**
 * Created by Linweijian on 2017/7/3.
 */
import React, { Component } from 'react';
import {
    Text,
    View,
    Animated,
    TouchableOpacity,
    Platform,
    Alert
} from 'react-native';
import Camera from 'react-native-camera';
import { HOST } from '../constantsUrl/Urls';
import styles from '../styleSheet/Styles';
import NetUtil from '../util/NetUtil';
import { toastLong } from '../util/ToastUtil';
import DianJianMain from '../view/DianJianMain';
import Loading from '../component/Loading';
import Icon from 'react-native-vector-icons/FontAwesome';//字体图标
export default class QrcodeDianJian extends Component {
    constructor(props) {
        super(props);
        this.state = {
            line_position: new Animated.Value(0),
            cameraType: Camera.constants.Type.back,
            isFlashLight: false,
            isFirst: true,
            funcname: '',
            funccode: '',
            loading: false,
            equipId: 0,
            equipName: '',
            partId: 0,
            planId: 0,
            planTime: null,
            checkUser: '',
            areaId: 0,
            actualTime: null,
            partName: '',
            deviceIdentityCode: '',
        }
    }
    componentDidMount() {
        this.setState(
            {
                funccode: this.props.funccode,
                equipId: this.props.equipId,
                equipName: this.props.equipName,
                partId: this.props.partId,
                planId: this.props.planId,
                planTime: this.props.planTime,
                checkUser: this.props.checkUser,
                areaId: this.props.areaId,
                actualTime: this.props.actualTime,
                partName: this.props.partName,
                deviceIdentityCode: this.props.deviceIdentityCode,
            }
        );
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.toolbar}>
                    <TouchableOpacity onPress={this.goBack.bind(this)} style={styles.rightViewStyle}>
                        <Icon name="chevron-left" size={30} color="#ffffff"></Icon>
                    </TouchableOpacity>
                    <Text style={styles.toolbarTitle}>
                        二维码
                    </Text>
                </View>
                <Loading loading={this.state.loading} onBack={() => { this.setState({ loading: false }) }} />
                <Camera
                    ref={(cam) => {
                        this.camera = cam
                    }}
                    style={styles.preview}
                    aspect={Camera.constants.Aspect.fill}
                    torchMode={this.state.isFlashLight ? Camera.constants.TorchMode.on : Camera.constants.TorchMode.off}
                    type={this.state.cameraType}
                    captureQuality={'medium'}
                    onBarCodeRead={(data) => {
                        {/*this.props.navigator.replace({
                         id: 2,
                         data: data,
                         });*/
                        }

                        this.turnBack(data);
                    }}
                >
                    <View style={styles.modal}>
                        <View style={styles.shade}></View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.shade}></View>
                            <View style={styles.qrcode}>
                            </View>
                            <View style={styles.shade}></View>
                        </View>
                        <View style={[styles.shade, styles.content]}>
                            <Text style={styles.text}>将二维码放入框内，即可自动扫描</Text>
                            <TouchableOpacity onPress={() => { this.setState({ isFlashLight: !this.state.isFlashLight }) }}>
                                <Text style={[styles.text, { marginTop: 20 }]}>开启/关闭闪关灯</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Camera>
            </View>
        );
    }
    turnBack(data) {
        let qrType = Platform.OS == 'ios' ? 'org.iso.QRCode' : 'QR_CODE';
        if (data.type == qrType) {
            try {
                var pp = data.data;
                var equipCode = '';
                var msg = pp.replace(/\'/g, "\"");
                var qrcodeInfo = JSON.parse(msg);
                var sn = qrcodeInfo.sn;
                var partId = qrcodeInfo.partId;
                var deviceIdentityCode1 = qrcodeInfo.deviceIdentityCode;//获取设备身份自编码
                if (deviceIdentityCode1 != this.state.deviceIdentityCode || partId != this.state.partId) {
                    toastLong("二维码不匹配，请重试!");
                }
                else {
                    if (/^\+?[1-9][0-9]*$/.test(sn)) {
                        equipCode = qrcodeInfo.content;
                    }
                    else {
                        NetUtil.getDataAsync(`${HOST}ems/getEequipCode/getEequipCode?id=${sn}`, (backtext) => {
                            equipCode = backtext.equipCode;
                        }).catch(error => {
                            toastLong(error)
                        })
                    }
                    var funccode = this.state.funccode;
                    if (funccode == "rcjclc_app")//故障报修
                    {
                        this.props.navigator.replace({
                            id: 'DianJianMain',
                            component: DianJianMain,
                            params: {
                                equipId: this.state.equipId,
                                equipName: this.state.equipName,
                                partId: this.state.partId,
                                planId: this.state.planId,
                                planTime: this.state.planTime,
                                checkUser: this.state.checkUser,
                                areaId: this.state.areaId,
                                actualTime: this.state.actualTime,
                                partName: this.state.partName,
                                deviceIdentityCode: this.state.deviceIdentityCode,
                                funccode: this.state.funccode,
                            }
                        });
                    }
                }
            }
            catch (error) {
                toastLong(error);
            }
        }
        else {
            toastLong("不是二维码");
        }
    }

    /**
     * 回退
     */
    goBack() {
        const nav = this.props.navigator;
        const routers = nav.getCurrentRoutes();
        if (routers.length > 1) {
            nav.pop();
            return true;
        }
        return false;
    }
}
