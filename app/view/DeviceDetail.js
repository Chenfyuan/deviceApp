/**
 * Created by Linweijian on 2017/7/3.
 */
'use strict';
import React, { Component } from 'react';
import {
    View,
    Dimensions,
    WebView,
    Alert
} from 'react-native';
import TopBar from '../component/TopBar';
const { width, height } = Dimensions.get('window');
import styles from '../styleSheet/Styles';
import Loading from '../component/Loading';
import {HOST} from '../constantsUrl/Urls';
var RNFS = require('react-native-fs');
export default class DeviceDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: '',
            funcname: '',
            show: false,
            loading: false,

        };
    }
    componentDidMount() {
        this.setState({
            url: this.props.url,
            funcname: this.props.funcname
        });
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

    onBackUp = () => {
        this.goBack();
    }
    onNavigationStateChange(event) {
        this.setState({
            loading: event.loading,
        })

    }
    fileDown(event){
        let data=event.nativeEvent.data;//获取下载url
        console.log(`${HOST}${data}`);
        Alert.alert("下载文件","是否下载该文件？",
            [
                {text:'确定',onPress:()=>{
                    const downloadDest = `${RNFS.PicturesDirectoryPath}/equipmentFiles.apk`;
                    var DownloadFileOptions = {
                        fromUrl: HOST+"update/deviceApp.1.0.1.apk",         // URL to download file from
                        toFile: downloadDest,
                        background: true,// Local filesystem path to save the file to
                        begin: (res) => {
                            console.log(res);
                        },
                        progress: (res) => {
                            console.log(res);
                        }
                    };
                    try {
                        const ret = RNFS.downloadFile(DownloadFileOptions);
                        ret.promise.then(res => {
                            //callback(null, Platform.OS === 'android' ? downloadDest : 'file://' + downloadDest)
                            console.log(res);
                            //callback(null, 'file://' + downloadDest)

                        }).catch(err => {
                            //callback(err)
                            console.log(err);
                        });
                    }
                    catch (e) {
                        //callback("error")
                        console.log(e);
                    }

                }},

                {text:'取消',onPress:()=>{}},
            ]

        )
    }
    render() {
        return (
            <View style={styles.container} >
                <TopBar name={this.state.funcname} onBackUp={this.onBackUp} />
                <WebView
                    ref="webViewAndroid "
                    style={{ width: width, height:(11*height)/12, backgroundColor: 'white' }}
                    source={{ uri: this.state.url, method: 'POST' }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    scalesPageToFit={true}
                    onMessage={(event)=>this.fileDown(event)}
                    onNavigationStateChange={this.onNavigationStateChange.bind(this)}
                    automaticallyAdjustContentInsets={true}
                />
                <Loading loading={this.state.loading}  onBack={()=>{this.setState({loading:false})}}/>
            </View>

        );
    }
}




