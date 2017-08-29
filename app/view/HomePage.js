/**
 * 首页
 */
'use strict';
import React, { Component } from 'react';
import {
    Text,
    Image,
    BackAndroid,
    Platform,
    TouchableOpacity,
    View,
    Alert,
    ListView,
    NativeModules,
    TouchableHighlight,
    StatusBar,
    ScrollView,
} from 'react-native';
import { toastLong, toastShort } from '../util/ToastUtil';
import DeviceList from './DeviceList';
import Qrcode from './Qrcode';
import { SHOW_FORM, TONGJI_URL, HOST } from '../constantsUrl/Urls';
import ModalDropdown from 'react-native-modal-dropdown';
import MyInfo from './MyInfo';
import UpdatePassWord from './UpdatePassWord';
import JobOrderList from './JobOrderList';
import YibanList from './YibanList';
import MsgList from './MsgList';
const ANDROID_OPTION = ['我的资料', '修改密码', '检测更新'];
const IOS_OPTION = ['我的资料', '修改密码'];
import styles from '../styleSheet/Styles';
import BaoYang from './BaoYang';
import TongJi from './TongJi';
import NetUtil from '../util/NetUtil';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/FontAwesome';//字体图标
var firstClick = 0;
import DianJian from './DianJian'
var Dimensions = require('Dimensions');
const screenW = Dimensions.get('window').width;
export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.handleBack = this.handleBack.bind(this);//初始化回退按钮
        this.state = {
            funcList: [],
            userCode: null,
            msgNum: 0,
            daibanNum: 0,
            yibanNum: 0,
            orgId: '0',
            progress: 0,
            orgTypeId: 0,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            })
        };
    }

    componentWillUnmount() {
        this.interval && clearInterval(this.interval);
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this.handleBack);
        }
    }

    componentDidMount() {
        //这里获取传递过来的参数
        BackAndroid.addEventListener('hardwareBackPress', this.handleBack);//出册监听事件
        this.setState({
            userCode: this.props.userCode,
            msgNum: this.props.msgNum,
            daibanNum: this.props.daibanNum,
            yibanNum: this.props.yibanNum,
            dataSource: this.state.dataSource.cloneWithRows(this.props.funcList),
            orgId: this.props.orgId,
            orgTypeId: this.props.orgTypeId
        });
        //定时器，定时刷新首页消息数量
        this.interval = setInterval(() => {
            NetUtil.getDataAsync(`${HOST}getMsg.do`, (callback) => this.setState({
                yibanNum: callback.yibanNum,
                daibanNum: callback.daibanNum,
                msgNum: callback.msgNum,
            })
            )

        }, 10000);
    }

    handleBack() {
        const { navigator } = this.props;
        if (navigator && navigator.getCurrentRoutes().length > 2) {
            navigator.pop();
            return true;
        } else {
            var timestamp = (new Date()).valueOf();
            if (timestamp - firstClick > 2000) {
                firstClick = timestamp;
                toastShort('再按一次退出');
                return true;
            } else {
                return false;
            }
        }
    }

    _dropdown_2_renderRow(rowData, rowID, highlighted) {
        return (
            <TouchableHighlight underlayColor='cornflowerblue'>
                <View style={styles.dropdown_2_row}>
                    <Text style={styles.dropdown_2_row_text}>
                        {`${rowData}`}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }

    render() {
        return (
            <View style={styles.containerHome}>
                <StatusBar
                    networkActivityIndicatorVisible={true}
                    backgroundColor="#2881B9"
                    barStyle="light-content"
                    animated={true} />
                <View style={styles.navOutViewStyle}>
                    <Text style={{ color: '#ffffff', fontSize: 22, fontWeight: 'bold', paddingTop: 15 }}>设备管理系统</Text>
                    {
                        Platform.OS == 'android' ?
                            <TouchableOpacity onPress={this.goBack.bind(this)} style={styles.leftViewStyle}>
                                <ModalDropdown style={styles.dropdown_6}
                                    options={ANDROID_OPTION}
                                    dropdownStyle={styles.dropdown_2_dropdown}
                                    renderRow={this._dropdown_2_renderRow.bind(this)}
                                    onSelect={(idx, value) => this._dropdown_6_onSelect(idx, value)}>
                                    <Icon name="bars" size={24} color="#ffffff"></Icon>
                                </ModalDropdown>
                            </TouchableOpacity> :
                            <TouchableOpacity onPress={this.goBack.bind(this)} style={styles.leftViewStyle}>
                                <ModalDropdown style={styles.dropdown_6}
                                    options={IOS_OPTION}
                                    dropdownStyle={[styles.dropdown_2_dropdown, { height: 80 }]}
                                    renderRow={this._dropdown_2_renderRow.bind(this)}
                                    onSelect={(idx, value) => this._dropdown_6_onSelect(idx, value)}>
                                    <Icon name="bars" size={24} color="#ffffff"></Icon>
                                </ModalDropdown>
                            </TouchableOpacity>
                    }
                </View>
                <View style={{ flex: 1 }}>

                    <View style={styles.taskView}>
                        <View style={styles.taskNumView}>
                            <Text style={styles.taskText}>
                                {this.state.daibanNum}
                            </Text>
                        </View>
                        <View style={styles.taskNumView}>
                            <Text style={styles.taskText}>
                                {this.state.yibanNum}
                            </Text>
                        </View>
                        <View style={styles.taskNumView}>
                            <Text style={styles.taskText}>
                                {this.state.msgNum}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.taskView1}>
                        <TouchableOpacity onPress={this._onchangeTab.bind(this, JobOrderList, '待办列表', null, '')}
                            style={styles.taskNumView}>
                            <View >
                                <Text style={styles.taskNumText}>
                                    待办/项
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this._onchangeTab.bind(this, YibanList, '已办列表', null, '')}
                            style={styles.taskNumView}>
                            <View>
                                <Text style={styles.taskNumText}>
                                    已办/项
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this._onchangeTab.bind(this, MsgList, '消息列表', null, '')}
                            style={styles.taskNumView}>
                            <View >
                                <Text style={styles.taskNumText}>
                                    新消息/条
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                { /*<View style={styles.menuView}>
                 <ListView
                 dataSource={this.state.dataSource}
                 renderRow={this.renderRow.bind(this)}
                 enableEmptySections={true}
                 contentContainerStyle={styles.listViewStyle}
                 />
                 </View>*/}


                <View style={styles.menuView}>
                    <ScrollView>
                        <View>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity style={{
                                    width: (screenW / 2) - 10,
                                    height: (screenW / 3),
                                    margin: 4,
                                    backgroundColor: '#faedee',
                                    alignItems: 'center'
                                }}
                                    onPress={() => this._onchangeTab(Qrcode, '报修', `${SHOW_FORM}?formId=WXLC_GZBX&data[type]=1`, 'Warning')}>
                                    <Image source={require('../../images/BAOXIU.png')} style={styles.iconStyle} />
                                    <Text style={{
                                        color: '#ed6c6c',
                                        fontSize: 22,
                                        paddingTop: 8
                                    }}>报修</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{
                                    width: (screenW / 2) - 10,
                                    height: (screenW / 3),
                                    margin: 4,
                                    backgroundColor: '#f9f2eb',
                                    alignItems: 'center'
                                }}
                                    onPress={() => this._onchangeTab(Qrcode, '例检', `${SHOW_FORM}?formId=ems_SJJCLC_SJJC01`, 'RegularCheck')}>
                                    <Image source={require('../../images/LIJIAN.png')} style={styles.iconStyle} />
                                    <Text style={{
                                        color: '#de8827',
                                        fontSize: 22,
                                        paddingTop: 8
                                    }}>例检</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity style={{
                                    width: (screenW / 2) - 10,
                                    height: (screenW / 3),
                                    margin: 4,
                                    backgroundColor: '#e9f0f5',
                                    alignItems: 'center'
                                }} onPress={() => this._onchangeTab(DianJian, '设备点检', null, 'rcjclc_app')}>
                                    <Image source={require('../../images/DIANJIAN.png')} style={styles.iconStyle} />
                                    <Text style={{
                                        color: '#2889d2',
                                        fontSize: 22,
                                        paddingTop: 8
                                    }}>点检</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={{
                                    width: (screenW / 2) - 10,
                                    height: (screenW / 3),
                                    margin: 4,
                                    backgroundColor: '#e8f3f0',
                                    alignItems: 'center'
                                }} onPress={() => this._onchangeTab(BaoYang, '设备保养', null, 'keep_app')}>
                                    <Image source={require('../../images/BAOYANG.png')} style={styles.iconStyle} />
                                    <Text style={{
                                        color: '#3aa788',
                                        fontSize: 22,
                                        paddingTop: 8
                                    }}>保养</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity style={{
                                    width: (screenW / 2) - 10,
                                    height: (screenW / 3),
                                    margin: 4,
                                    backgroundColor: '#eef9f9',
                                    alignItems: 'center'
                                }}
                                    onPress={() => this._onchangeTab(TongJi, '统计', `${TONGJI_URL}?companyId=${this.state.orgId}`, 'StatisAnalysis')}>
                                    <Image source={require('../../images/TONGJI.png')} style={styles.iconStyle} />
                                    <Text style={{
                                        color: '#229fa5',
                                        fontSize: 22,
                                        paddingTop: 8
                                    }}>统计</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{
                                    width: (screenW / 2) - 10,
                                    height: (screenW / 3),
                                    margin: 4,
                                    backgroundColor: '#f1ecf4',
                                    alignItems: 'center'
                                }} onPress={() => this._onchangeTab(DeviceList, '设备台账', null, 'DeviceLedger')}>
                                    <Image source={require('../../images/TAIZHANG.png')} style={styles.iconStyle} />
                                    <Text style={{
                                        color: '#7b5d9d',
                                        fontSize: 22,
                                        paddingTop: 8
                                    }}>台账</Text>
                                </TouchableOpacity>
                            </View>
                        </View>



                    </ScrollView>

                </View>

            </View>

        );
    }

    _dropdown_6_onSelect(idx, value) {
        if (idx == 0) {
            this._onchangeTab(MyInfo, value, null, '');
        } else if (idx == 1) {
            this._onchangeTab(UpdatePassWord, value, null, '');
        }
        else {
            //APP更新
            toastLong("正在检查更新……")
            NetUtil.getDataAsync(`${HOST}core/app/appGetServerVer.do`, (reponseData) => {
                if (DeviceInfo.getVersion() == reponseData.versionCode || reponseData.versionCode == "") {
                    toastLong(`当前版本[Ver${DeviceInfo.getVersion()}]已经是最新了！`);
                }
                else {
                    Alert.alert(`发现新版本[${reponseData.versionCode}]`, reponseData.des,
                        [
                            {
                                text: '更新', onPress: () => {
                                    var nav = NativeModules.UpdateApp;
                                    let path = HOST + "update/" + reponseData.name + "." + reponseData.versionCode + ".apk";
                                    toastLong("正在下载……")
                                    nav.downloading(path, "deviceApp.apk")
                                }
                            },
                            {
                                text: '忽略', onPress: () => {
                                }
                            },
                        ]
                    )
                }
            }
            )
        }
    }

    /* 从数据源(Data source)中接受一条数据，以及它和它所在section的ID。
     返回一个可渲染的组件来为这行数据进行渲染。
     默认情况下参数中的数据就是放进数据源中的数据本身，
     不过也可以提供一些转换器。如果某一行正在被高亮（通过调用highlightRow函数），
     ListView会得到相应的通知。当一行被高亮时，其两侧的分割线会被隐藏。
     行的高亮状态可以通过调用highlightRow(null)来重置。*/
    /* renderRow(rowData, sectionID, rowID, highlightRow) {
     var colors = ['#faedee', '#f9f2eb', '#e9f0f5', '#e8f3f0', '#eef9f9', '#f1ecf4', 'green', 'orange', 'cyan'];
     var bstyle = {
     width: (screenW / 2) - 10,
     height: (screenW / 3),
     margin: 4,
     backgroundColor: colors[rowID],
     alignItems: 'center'
     }
     var textColor = ['#ed6c6c', '#de8827', '#2889d2', '#3aa788', '#229fa5', '#7b5d9d']
     var bcolor = {color: textColor[rowID], fontSize: 22, paddingTop: 8}
     return (
     <TouchableOpacity activeOpacity={0.8} onPress={() => {
     this.onTabPress(rowData)
     }}>
     <View style={bstyle}>
     <Image source={{uri: HOME_ICON + '' + rowData.icon + '.png'}} style={styles.iconStyle}/>
     <Text style={bcolor}>{rowData.funcname}</Text>
     </View>
     </TouchableOpacity>
     );
     }*/


    /*onTabPress(options) {
     switch (options.funccode) {
     case 'RegularCheck': //例检
     case 'Warning': //报修
     this._onchangeTab(Qrcode, options.funccode, `${SHOW_FORM}?${options.linkpage}`, options.funccode)
     break;
     //统计分析
     case 'StatisAnalysis':
     this._onchangeTab(TongJi, options.funcname, `${TONGJI_URL}?companyId=${this.state.orgId}`, options.funccode)
     break;
     //保养管理
     case 'keep_app':
     this._onchangeTab(BaoYang, '设备保养', null, options.funccode)
     break;
     //设备台账
     case 'DeviceLedger':
     this._onchangeTab(DeviceList, '设备台账', null, options.funccode);
     break;
     case 'rcjclc_app':
     this._onchangeTab(Qrcode, '设备点检', null, options.funccode)
     break;
     default:
     break;
     }
     }*/

    //页面导航事件
    _onchangeTab(component, funcName, navUrl, funccode) {
        const { navigator } = this.props;
        if (navigator) {
            if (navigator) {
                navigator.push({
                    name: `${funcName}`,
                    component: component,
                    params: {
                        url: navUrl,
                        funcname: funcName,
                        orgTypeId: this.state.orgTypeId,
                        userCode: this.state.userCode,
                        funccode: funccode,
                    }
                });
            }
        }

    }

    //回退
    goBack() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }
}



