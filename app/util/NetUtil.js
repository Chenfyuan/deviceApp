'use strict';
import {toastLong} from '../util/ToastUtil';
import React, {
    NetInfo,
    Platform
} from 'react-native';
let NetUtil = {
    postJson(url, data, callback){
        var fetchOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body: data
        };
        NetInfo.isConnected.fetch().done(
            (isConnected) => {
                if (isConnected == true) {
                    fetch(url, fetchOptions)
                        .then((response) => response.json())
                        .then((responseText) => {
                            callback(responseText);
                            console.log(responseText);
                        }).catch((error) => {
                        console.log(error);
                        console.log("获取数据失败，请尝试重新登录！");
                        let text = {};
                        text.MSG = "无法连接到服务器";
                        console.log(text);
                        callback(text);
                    }).done();
                }
                else {
                    toastLong("没有网络连接")
                    let text = {};
                    text.MSG = "没有网络连接";
                    callback(text)
                }
            }
        );
    },
    //获取数据
    getDataAsync(url, callback) {
        NetInfo.isConnected.fetch().done(
            (isConnected) => {
                if (isConnected == true) {
                    fetch(url)
                        .then((response) => response.json())
                        .then((responseJson) => {
                            console.log(responseJson);
                            callback(responseJson);
                        })
                        .catch((error) => {
                            console.log(error);
                            toastLong("获取数据失败，请尝试重新登录！");
                        });
                }
                else {
                    toastLong("没有网络连接");
                }
            }
        );
    },

}
//ios平台
if (Platform.OS == 'ios') {
    NetUtil = {
        postJson(url, data, callback){
            var fetchOptions = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                body: data
            };
            fetch(url, fetchOptions)
                .then((response) => response.json())
                .then((responseText) => {
                    callback(responseText);
                }).catch((error) => {
                console.log(error);
                console.log("获取数据失败，请尝试重新登录！");
                let text = {};
                text.MSG = "无法连接到服务器";
                callback(text);
            }).done();
        },
        //获取数据
        async getDataAsync(url, callback) {
            fetch(url)
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson);
                    callback(responseJson);
                })
                .catch((error) => {
                    console.log(error);
                    toastLong("获取数据失败，请尝试重新登录！");
                });
        }
    }
}
export default NetUtil;