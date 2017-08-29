/**例检 */

'use strict';
import React, {Component} from 'react';
import {
    Text,
    View,
    ListView,
    TextInput,
    ScrollView,
    Alert,
    InteractionManager,
    Platform
} from 'react-native';
import {HOST} from '../constantsUrl/Urls';
import TopBar from '../component/TopBar';
import styles from '../styleSheet/Styles';
import {toastLong} from '../util/ToastUtil';
import LoginButton from '../component/LoginButton';
import NetUitl from '../util/NetUtil';
import Loading from '../component/Loading';
import BAOXIU from '../view/FaultRepairMain';
import ListItem from  '../component/ListItem';
var map = new Map, audioMap = new Map, imageMap = new Map;
export default class DianJianMain extends Component {
    watchID = ''

    constructor(props) {
        super(props);

        this.dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        this.state = {
            checked: false,
            equipCode: '',
            content: [],
            equipName: '',
            checkedItem: [],
            checkUser: '',
            planId: 0,
            areaId: 0,
            planTime: '',
            equipId: 0,
            loading: false,
            actualTime: '',
            Lon: 0,
            Lat: 0,
            partName: '无',
            partId: 0,
            deviceIdentityCode:'',
        }
    };

    componentDidMount() {
        this.setState({
            equipName: this.props.equipName,
            equipId: this.props.equipId,
            planId: this.props.planId,
            planTime: this.props.planTime,
            checkUser: this.props.checkUser,
            areaId: this.props.areaId,
            actualTime: this.props.actualTime,
            partName: this.props.partName,
            partId: this.props.partId,
            deviceIdentityCode:this.props.deviceIdentityCode,
        })
        //经纬度
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

        InteractionManager.runAfterInteractions(() => {
            NetUitl.getDataAsync(`${HOST}ems/equipCheckActualJson/getDeviceDianJianCheck.do?equipId=${this.props.equipId}&planId=${this.props.planId}`, (callback) => {
                this.setState({
                    equipCode: callback.equipCode,
                    content: callback.content,
                })
            })

        });

    }

    componentWillUnmount() {
        map.clear();
        audioMap.clear();
        imageMap.clear();
        navigator.geolocation.clearWatch(this.watchID);
    }


    checkSelect(id, checked) {
        console.log(`${id},,${checked}`);
        if (checked == true) {
            map.set(id, 0);//完好
            audioMap.delete(id);
            //imageMap.delete(id);
        }
        else
            map.set(id, 1); //不完好
    }

//照片回调函数
    //sources:图片路径
    //result：选择的结果
    //id:检查内容id
    //i：第几张图片
    _imageBack(sources, result, id, i) {
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

    take(ischeck, id) {
        //ischeck,是否隐藏，
        if (ischeck) {
            imageMap.delete(id);
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
                map.set(data.id, 0);
                arrs.push(
                    <ListItem Id={data.id}
                              key={data.id}
                              onBackUpFunc={this.checkSelect.bind(this, data.id)}
                              onImageFun={this._imageBack.bind(this)}
                              onAudio={this._audioBack.bind(this)}
                              Criteria={data.criteria}
                              CheckMethod={data.checkMethod}
                              onTakePhoto={this.take.bind(this)}
                              Name={data.name}
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

//提交数据
    submit() {
        if (this.state.equipCode == '') {
            toastLong("请输入设备编号");
            return
        }
        if (this.state.equipName == '') {
            toastLong("请输入设备名称");
            return
        }
        var formData = new FormData();
        map.forEach(function (value, key, mapObj) {
            formData.append("details[" + key + "]", value)//是否完好
        });
        audioMap.forEach((value, key, mapObj) => {
            formData.append("audio[" + key + "]", value)//录音文件
        });
        imageMap.forEach((value, key, mapObj) => {
            let image = [];
            value.forEach((v, index) => {
                formData.append("images[" + key + "].image[" + index + "]", v);
            });
        })
        if(Platform.OS=='android') {
            this.setState({loading: true});
        }
        formData.append("equipId", this.state.equipId);
        formData.append("vo.planId", this.state.planId);
        formData.append("vo.checkUser", this.state.checkUser);
        formData.append("areaId", this.state.areaId);
        formData.append("vo.lon", this.state.Lon);
        formData.append("vo.lat", this.state.Lat);
        formData.append("vo.planTime", this.state.planTime),
            formData.append("partId", this.state.partId);//部位Id
        formData.append("vo.actualTime", this.state.actualTime);
        NetUitl.postJson(`${HOST}ems/equipCheckActualJson/addJson.do`, formData,
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
                    type: 0,//点检
                    partId:this.state.partId,//部位Id
                    deviceIdentityCode:this.state.deviceIdentityCode,
                }
            });
        }
    }

    render() {
        return (
            <View style={styles.msgContainer}>
                <TopBar name='点检' onBackUp={this.onBackUp}/>
                <ScrollView>
                    <View style={styles.rowItem}>
                        <View style={styles.columnItem}><Text>编号</Text></View>
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
                    </View>

                    <View style={styles.rowItem}>
                        <View style={styles.columnItem}><Text>设备名称</Text></View>
                        <View style={styles.secondColumnItem}>
                            <TextInput placeholder="请输入设备名称"
                                       underlineColorAndroid={'transparent'}
                                       editable={false}
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
                        <View style={styles.columnItem}><Text>检查人</Text></View>
                        <View style={styles.secondColumnItem}>
                            <TextInput placeholder="请输入检查人"
                                       underlineColorAndroid={'transparent'}
                                       defaultValue={this.state.checkUser}
                                       onChangeText={(text) => {
                                           this.setState({
                                               checkUser: text,
                                           })
                                       }}
                                       style={styles.inputStyle}/>
                        </View>
                    </View>
                    <View style={styles.rowItem}>
                        <View style={styles.columnItem}><Text>计划时间</Text></View>
                        <View style={styles.secondColumnItem}>
                            <TextInput placeholder="请输入计划时间"
                                       underlineColorAndroid={'transparent'}
                                       defaultValue={this.state.planTime}
                                       onChangeText={(text) => {
                                           this.setState({
                                               planTime: text,
                                           })
                                       }}
                                       style={styles.inputStyle}/>
                        </View>

                    </View>

                    <View style={styles.rowItem}>
                        <View style={styles.columnItem}><Text>部位</Text></View>
                        <View style={styles.secondColumnItem}>
                            <Text style={{paddingLeft:8}}>{this.state.partName}</Text>
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
                    {
                        this.renderRow(this.state.content)
                    }
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


