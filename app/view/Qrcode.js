import React, {Component} from 'react';
import {
    Text,
    View,
    Animated,
    Easing,
    TouchableOpacity,
    Platform,
} from 'react-native';
import Camera from 'react-native-camera';
import WebViewExample from '../view/WebViewExample';
import {HOST} from '../constantsUrl/Urls';
import FaultRepairMain from '../view/FaultRepairMain';
import styles from '../styleSheet/Styles';
import NetUtil from '../util/NetUtil';
import {toastLong} from '../util/ToastUtil';
import DianJian from '../view/DianJian'
import Loading from '../component/Loading';
import Lijian from '../view/LiJian';
import Icon from 'react-native-vector-icons/FontAwesome';//字体图标
export default class Qrcode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            line_position: new Animated.Value(0),
            isFirst: true,
            url: '',
            funcname: '',
            funccode: '',
            loading: false,
        }
    }
    lineAnimated = () => {
        this.state.line_position.setValue(0);
        Animated.timing(this.state.line_position, {
            toValue: 200,
            duration: 3500,
            easing: Easing.linear // 缓动函数
        }).start(() => {
            this.lineAnimated();
        });
    }

    componentDidMount() {
        this.setState(
            {
                url: this.props.url,
                funcname: this.props.funcname,
                funccode: this.props.funccode,
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
                <Loading loading={this.state.loading}  onBack={()=>{this.setState({loading:false})}}/>
                <Camera
                    ref={(cam) => {
                        this.camera = cam
                    } }
                    style={styles.preview}

                    torchMode={this.state.isFlashLight?Camera.constants.TorchMode.on:Camera.constants.TorchMode.off}
                    captureQuality={'medium'}
                    onBarCodeRead={(data) => {
                        this.turnBack(data);
                    } }
                >
                    <View style={styles.modal}>
                        <View style={styles.shade}></View>
                        <View style={{flexDirection: 'row'}}>
                            <View style={styles.shade}></View>
                            <View style={styles.qrcode}>


                            </View>
                            <View style={styles.shade}></View>
                        </View>
                        <View style={[styles.shade, styles.content]}>
                            <Text style={styles.text}>将二维码放入框内，即可自动扫描</Text>
                            <TouchableOpacity onPress={() =>{this.setState({isFlashLight:!this.state.isFlashLight})}}>
                                <Text style={[styles.text, {marginTop: 20}]}>开启/关闭闪关灯</Text>
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
                console.log(qrcodeInfo);
                var sn = qrcodeInfo.sn;
                var partId = qrcodeInfo.partId;
                var deviceIdentityCode=qrcodeInfo.deviceIdentityCode;//设备身份自编码
                console.log(partId);
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
                var url = this.state.url + "&data[equipCode]=" + equipCode;
                var funcname = this.state.funcname;
                var funccode = this.state.funccode;
                if (funccode == "Warning")//故障报修
                {
                    this.props.navigator.replace({
                        id: 'FaultRepairMain',
                        component: FaultRepairMain,
                        params: {
                            funcname: funcname,//功能名称
                            equipCode: equipCode,//设备编号
                            partId: partId,//部位Id
                            deviceIdentityCode:deviceIdentityCode,
                            Id:parseInt(sn),//设备Id
                        }
                    });
                }
                else if (funccode == "RegularCheck")//例检
                {
                    this.setState({loading: true})
                    try {
                        NetUtil.getDataAsync(`${HOST}ems/dutyCheckContentJson/getDeviceCheck.do?equipCode=${deviceIdentityCode}`, (backtext) => {
                            console.log(backtext)
                            this.props.navigator.replace({
                                name: 'Lijian',
                                component: Lijian,
                                params: {
                                    funcname: funcname,
                                    equipCode: equipCode,
                                    equipName: backtext.equipName,
                                    content: backtext.content,
                                    equipId: backtext.equipId,
                                    partId: partId,
                                    deviceIdentityCode:deviceIdentityCode,
                                }
                            });
                        })
                    }
                    catch (error) {
                        toastLong(error)
                    }
                }
                else if (funccode == "rcjclc_app")//点检
                {
                    this.props.navigator.replace({
                        name: 'DianJian',
                        component: DianJian,
                        params: {
                            funcname: funcname,
                            deviceIdentityCode:deviceIdentityCode,
                        }
                    });
                }
                else {
                    this.props.navigator.replace({
                        id: 'WebViewExample',
                        component: WebViewExample,
                        params: {
                            url: url,
                            funcname: funcname,
                        }
                    });
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
