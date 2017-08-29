/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
'use strict';
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    Platform,
    PermissionsAndroid,
} from 'react-native';
import EditView from '../component/EditView';
import LoginButton from '../component/LoginButton';
import PassEditView from '../component/PassEditView';
import HomePage from './HomePage';
import NetUitl from '../util/NetUtil';
import {toastLong} from '../util/ToastUtil';
import {LOGIN_URL} from '../constantsUrl/Urls';
import DeviceStorage from '../util/DeviceStorage';
var Dimensions = require('Dimensions');
const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
import Loading from '../component/Loading';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            password: "",
            Loading: false,
        }
        this.getSaveData();
    }

    render() {
        return (
            <View style={LoginStyles.loginview}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                }}>
                    <Image source={require('../../images/login_top.png')}
                           style={{height: screenH / 3, width: screenW}}/>
                </View>
                <View style={{
                    height: screenH / 12,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginLeft: 20,
                    marginRight: 20
                }}>
                    <View style={{flex: 2, justifyContent: 'center', alignItems: 'flex-end'}}>
                        <Text style={{fontSize: 16}}>账号:</Text>
                    </View>
                    <View style={{flex: 8, justifyContent: 'center'}}>
                        <EditView name='请输入账号'
                                  defaultValue={this.state.userName}
                                  onChangeText={(text) => {
                                      this.setState({
                                          userName: text,
                                      })
                                  }}/>
                    </View>
                </View>
                <View style={{height: 1, backgroundColor: '#cccccc'}}></View>
                <View style={{
                    height: screenH / 12,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginLeft: 20,
                    marginRight: 20
                }}>
                    <View style={{flex: 2, justifyContent: 'center', alignItems: 'flex-end'}}>
                        <Text style={{fontSize: 16}}>密码:</Text>
                    </View>
                    <View style={{flex: 8, justifyContent: 'center'}}>
                        <PassEditView name='请输入密码'
                                      defaultValue={this.state.password}
                                      onChangeText={(text) => {
                                          this.setState({
                                              password: text,
                                          })
                                      }}/>
                    </View>
                </View>
                <View style={{height: 1, backgroundColor: '#cccccc'}}></View>
                <View style={{marginLeft: 20, marginRight: 20}}>
                    <LoginButton name='登录' onPressCallback={this.onPressCallback}/>
                </View>
                <View style={{flex:1,alignItems:'center',justifyContent:'flex-end',paddingBottom:10}}>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{fontSize:12,color:'#dddddd'}}>版权归属:</Text>
                        <Text style={{fontSize:12,color:'#dddddd'}}>北部湾港</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{fontSize:12,color:'#dddddd'}}>技术支持:</Text>
                        <Text style={{fontSize:12,color:'#dddddd'}}>广州讯一佳信息科技有限公司</Text>
                    </View>
                </View>
                <Loading loading={this.state.Loading}  onBack={()=>{this.setState({Loading:false})}}/>
            </View>

        )
    }

    onPressCallback = () => {
        if (!this.state.userName) {
            toastLong('请输入账号');
            return;
        }
        if (!this.state.password) {
            toastLong('请输入密码');
            return;
        }

        let formData = new FormData();
        formData.append("usercode", this.state.userName);
        formData.append("password", this.state.password);
        formData.append("vType", 1);
        this.setState({Loading: true})
        NetUitl.postJson(LOGIN_URL, formData, (responseText) => {
            var msg = responseText.MSG;
            this.setState({Loading: false})
            if (msg == "登录成功") {
                this.onLoginSuccess(responseText);
            } else if (msg == "没有网络连接") {
                this.setState({Loading: false})
            }
            else {
        toastLong(msg);
                this.setState({Loading:false})
                
               /* Alert.alert('提示', msg, [{
                    text: '确定', onPress: () => {
                        this.setState({Loading:false})
                    }
        },]);*/
            }
        })

    };

    //跳转到第二个页面去
    onLoginSuccess(data) {
        DeviceStorage.save("userName", this.state.userName);//保存账号
        DeviceStorage.save("password", this.state.password);//保存密码
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'HomePage',
                component: HomePage,
                params: {
                    funcList: data.funcList,
                    userCode: data.userCode,
                    daibanNum: data.daibanNum,
                    yibanNum: data.yibanNum,
                    msgNum: data.msgNum,
                    orgId: data.orgId,
                    orgTypeId: data.orgTypeId

                }
            });
        }
    }

    getSaveData() {
        //appHotSearchTagList就是当时保存的时候所保存的key，而tags就是保存的值
        DeviceStorage.get('userName').then((tags) => {
            this.setState({
                userName: tags
            })
        });
        DeviceStorage.get('password').then((tags) => {
            this.setState({
                password: tags
            })
        });
    }

//权限请求
    async requestPermission() {
        let permission =
            [
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.CAMERA,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            ];

        try {
            const granted = await PermissionsAndroid.requestMultiple(permission);
            console.log(granted)
        } catch (err) {
            console.warn(err)
        }
    }


    componentDidMount() {
        if (Platform.OS == 'android')
            this.requestPermission();
    }
}
const LoginStyles = StyleSheet.create({
    loginview: {
        flex: 1,
        backgroundColor: '#ffffff',

    },
});