/**例检 */

'use strict';
import React, {Component} from 'react';
import {
    Text,
    View,
    TextInput,
    ScrollView,
    Alert,
    Platform
} from 'react-native';
import {HOST} from '../constantsUrl/Urls';
import TopBar from '../component/TopBar';
var Dimensions = require('Dimensions');
import styles from '../styleSheet/Styles';
import {toastLong} from '../util/ToastUtil';
import LoginButton from '../component/LoginButton';
import NetUitl from '../util/NetUtil';
import Loading from '../component/Loading';
import ListItem from '../component/ListItem'
import BAOXIU from '../view/FaultRepairMain';
var map = new Map, audioMap = new Map, imageMap = new Map;
export default class LiJian extends Component {
    watchID = '';

    constructor(props) {
        super(props);
        this.state = {
            checked: false,
            equipCode: '',
            content: [],
            equipName: '',
            checkedItem: [],
            Lat: 0,
            Lon: 0,
            equipId: 0,
            loading: false,
            partId: 0,
            deviceIdentityCode:'',
        }
    };

    componentDidMount() {
        this.setState({
            equipCode: this.props.equipCode,
            equipName: this.props.equipName == null ? '' : this.props.equipName,
            content: this.props.content,
            equipId: this.props.equipId == null ? 0 : this.props.equipId,
            partId: this.props.partId,//部位
            deviceIdentityCode:this.props.deviceIdentityCode,

        }),

            this.watchID = navigator.geolocation.watchPosition(
                (position) => {
                    let longitude = JSON.stringify(position.coords.longitude);//精度
                    let latitude = JSON.stringify(position.coords.latitude);//纬度
                    this.setState({
                        Lat: latitude,
                        Lon: longitude,
                    })
                },
                (error) => {
                    console.log(error);
                },
                {enableHighAccuracy: false, timeout: 1000, maximumAge: 10}
            );
    }

    getRows() {
        return this.state.content;
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
        map.clear();
        audioMap.clear();
        imageMap.clear();
    }

    checkSelect(id, checked) {
        console.log(checked + ",," + id)
        if (checked == true) {
            map.set(id, 0);
            audioMap.delete(id);
            //imageMap.delete(id);
        }
        else
            map.set(id, 1);
    }

    submit() {
        if(Platform.OS=='android') {
            this.setState({loading: true});
        }
        console.log(map)
        var dutyCheck = {};
        dutyCheck.equipId = this.state.equipId;
        dutyCheck.lon = this.state.Lon;
        dutyCheck.lat = this.state.Lat;
        var formData = new FormData();
        map.forEach(function (value, key, mapObj) {
            formData.append("details[" + key + "]", value)
        });
        audioMap.forEach((value, key, mapObj) => {
            formData.append("audio[" + key + "]", value)//录音文件
        });
        let index = 0;
        imageMap.forEach((value, key, mapObj) => {
            let image = [];
            value.forEach(
                (v, index) => {
                    formData.append("images[" + key + "].image[" + index + "]", v);
                }
            );
        })
        formData.append("equipId", this.state.equipId);
        formData.append("vo.lon", this.state.Lon);
        formData.append("vo.lat", this.state.Lat);
        formData.append("vo.equipId", this.state.equipId);
        NetUitl.postJson(`${HOST}ems/dutyCheck/addJson.do`, formData,
            (callback) => {
                this.setState({loading: false});
                callback.msg == "保存成功." ? Alert.alert(
                    '提示',
                    `${callback.msg}是否报修?`,
                    [
                        {text: '报修', onPress: () => this.navigateToFaultRepair()},
                        {text: '关闭', onPress: () => this.goBack()}
                    ]
                ) : toastLong(callback.msg);
            })
    }

    navigateToFaultRepair() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.replace({
                name: 'baoxiu',
                component: BAOXIU,
                params: {
                    equipCode: this.state.equipCode,
                    partId: this.state.partId,
                    deviceIdentityCode:this.state.deviceIdentityCode,
                }
            });
        }
    }
    take(ischeck, id) {
        //ischeck,是否隐藏，
        if (ischeck) {
            imageMap.delete(id);
        }
    }
//音频回调函数
    _audioBack(audioPath, id) {
        //保存检查内容ID和音频路径
        let audiourl = `file://${audioPath}`;
        if (Platform.OS == 'ios') {
            audiourl = audioPath;
        }
        let audioFile = {uri: audiourl, type: 'multipart/form-data', name: 'recoder_' + id + '.aac'};
        audioMap.set(id, audioFile);//保存录音
    }

//照片回调函数
    _imageBack(sources, result, id, i) {
        //sources:图片路径
        //result：选择的结果
        //id:检查内容id
        //i：第几张图片
        let imageurl = sources.uri;//获取图片路径
        let imageFile = {uri: imageurl, type: 'multipart/form-data', name: `image_${id}_${i}.jpg`};
        let arr = new Array(4);
        if (imageMap.get(id) == null) {  //如果map为空
            arr[i] = imageFile;
            imageMap.set(id, arr);
        } else {
            let picArr = imageMap.get(id);
            picArr[i] = imageFile;
            imageMap.set(id, picArr);
        }

    }

    renderRow(items) {
        if (items.length == 0)
            return (
                <View style={{
                    marginBottom: 4,
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 140,
                    borderColor: '#aaa',
                    borderWidth: 1,
                    borderRadius: 5,
                    backgroundColor: '#ffffff'
                }}>
                    <Text>没有检查内容</Text>
                </View>
            );
        else {
            let arrs = [];
            for (var data of items) {
                //初始化map
                console.log(data)
                map.set(data.id, 0);
                arrs.push(
                    <ListItem Id={data.id}
                              key={data.id}
                              onBackUpFunc={this.checkSelect.bind(this, data.id)}
                              Criteria={data.criteria}
                              onImageFun={this._imageBack.bind(this)}
                              onAudio={this._audioBack.bind(this)}
                              CheckMethod={data.checkMethod}
                              Name={data.name}
                              onTakePhoto={this.take.bind(this)}
                              PartName={data.partName}
                              TypeName={data.typeName}
                              Measure={data.measure}
                    />
                );
            }
            return (
                <View style={{marginLeft: 5, marginRight: 5, marginTop: 5}}>
                    {arrs}
                </View>
            );
        }
    }

    render() {
        return (
            <View style={styles.msgContainer}>
                <TopBar name='例检' onBackUp={this.onBackUp}/>
                <ScrollView>
                    <View style={styles.rowItem}>
                        <View style={styles.columnItem}><Text>身份自编号</Text></View>
                        <View style={styles.secondColumnItem}>
                            <TextInput placeholder="请输入设备身份自编号"
                                       underlineColorAndroid={'transparent'}
                                       editable={false}
                                       defaultValue={this.state.deviceIdentityCode}
                                       onChangeText={(text) => {
                                           this.setState({
                                               equipCode: text,
                                           })
                                       }}
                                       style={styles.inputStyle}/>
                        </View>
                    </View>
                    {/*  <View style={styles.rowItem}>
                     <View style={styles.columnItem}><Text>单位自编号</Text></View>
                     <View style={styles.secondColumnItem}>
                     <TextInput placeholder="请输入设备编号"
                     editable={false}
                     underlineColorAndroid={'transparent'}
                     defaultValue={this.state.equipCode}
                     onChangeText={(text) => {
                     this.setState({
                     equipCode: text,
                     })
                     }}
                     style={styles.inputStyle}/>
                     </View>
                     </View>*/}
                    <View style={styles.rowItem}>
                        <View style={styles.columnItem}><Text>名称</Text></View>
                        <View style={styles.secondColumnItem}>
                            <TextInput placeholder="请输入设备名称"
                                       editable={false}
                                       underlineColorAndroid={'transparent'}
                                       defaultValue={this.state.equipName}
                                       onChangeText={(text) => {
                                           this.setState({
                                               equipName: text,
                                           })

                                       }}
                                       style={styles.inputStyle}/>
                        </View>
                    </View>
                    <View style={styles.rowItem}>
                        <View style={styles.columnItem}><Text>经纬度</Text></View>
                        <View style={styles.secondColumnItem}>
                            <Text style={{paddingLeft:8}}>{this.state.Lon} {this.state.Lat}</Text>
                        </View>

                    </View>
                    <Text style={{
                        height: 40,
                        textAlign: 'center',
                        backgroundColor: '#2881B9',
                        color: '#ffffff',
                        paddingTop: 10,
                        borderColor: '#bbb',
                        borderWidth: 1
                    }}>检查内容</Text>
                    <View style={{marginLeft: 5, marginRight: 5, marginTop: 5}}>
                        {this.renderRow(this.state.content)}
                    </View>
                    <View style={{marginBottom: 2, marginLeft: 5, marginRight: 5}}>
                        <LoginButton name="提交" onPressCallback={() => this.submit()}/>
                    </View>
                    <Loading loading={this.state.loading}  onBack={()=>{this.setState({loading:false})}}/>
                </ScrollView>
            </View>
        );
    }

    onBackUp = () => {
        this.goBack();
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


