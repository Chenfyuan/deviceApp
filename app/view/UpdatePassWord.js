'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert
} from 'react-native';

import PassEditView from '../component/PassEditView';
import TopBar from '../component/TopBar';
import LoginButton from '../component/LoginButton';
import NetUitl from '../util/NetUtil';
import { toastLong } from '../util/ToastUtil';
import {CHECK_PASSWORD,UPDATE_PASSWORD} from '../constantsUrl/Urls';
export default class UpdatePassWord extends Component {
   constructor(props){
        super(props);
        this.passWord = "";
        this.newPassWord = "";
        this.againPassWord="";
        this.state = {
            userCode:'',
        };
    }

    componentDidMount() {  
        //这里获取传递过来的参数
        this.setState({ 
            userCode:this.props.userCode,
        });  

    }

   render(){
     return(
         <View style={styles.container}>
            <TopBar name='修改密码' onBackUp={this.onBackUp}/>
             <View style={{marginLeft:20,marginRight:20,marginTop:20}}>
             <View style={{flexDirection:'row',alignItems:'center'}}>  
             <Text style={styles.text}>
              原始密码：  
             </Text>   
                <PassEditView  name='输入原始密码' onChangeText={(text) => {
                   this.passWord=text;
             }}/>
         </View> 

           <View
             style={{height:1,backgroundColor:'#f4f4f4'}}
          /> 

             <View style={{flexDirection:'row',alignItems:'center',}}>  
             <Text style={styles.text}>
              新  密  码：  
             </Text>   
                <PassEditView  name='输入新密码' onChangeText={(text) => {
                   this.newPassWord=text;
             }}/>
          </View> 

           <View
             style={{height:1,backgroundColor:'#f4f4f4'}}
          /> 

             <View style={{flexDirection:'row',alignItems:'center',}}>  
             <Text style={styles.text}>
              确认密码：  
             </Text>   
                <PassEditView  name='输入确认密码' onChangeText={(text) => {
                   this.againPassWord=text;
             }}/>
          </View> 

           <View
             style={{height:1,backgroundColor:'#f4f4f4'}}
          /> 
           <View style={{marginTop:10}}>
           <LoginButton name='确认' onPressCallback={this.onPressCallback}/>
           </View>
          </View>
        </View>   
     )
}

   onPressCallback = () => {
     if(!this.passWord){
      toastLong('请输入原始密码');
      return;
    }
    if(!this.newPassWord){
      toastLong('请输入新密码');
      return;
    }
    if(!this.againPassWord){
      toastLong('提示','请输入确认密码');
      return;
    }
    if(this.newPassWord!=this.againPassWord){
      Alert.alert('提示','新密码与确认密码不一致，请重新输入');
      return;
    }
    let formData = new FormData();
    formData.append("id",this.state.userCode);
    formData.append("password",this.passWord);
       NetUitl.postJson(CHECK_PASSWORD,formData,(responseText) => {
           var msg=JSON.stringify(responseText);
           if(msg.includes("true")){
               this.updatePassWord();
           }else{
               Alert.alert('提示',"原密码错误，请重新输入");
           }
       })
   }
    updatePassWord(){
    let formData = new FormData();
    formData.append("usercode",this.state.userCode);
    formData.append("password",this.newPassWord);
    NetUitl.postJson(UPDATE_PASSWORD,formData,(responseText) => {
        // alert(JSON.stringify(responseText));
      var msg=responseText.msg;
      if(msg.includes("成功")){
         Alert.alert('提示','密码修改成功,请重新登录!', [{text: '确定', onPress: () => {
         const nav = this.props.navigator;
         nav.popToTop();
         }},]);
       }else{
         Alert.alert('提示','修改失败', [{text: '确定', onPress: () => {
         }},]);
         }
      })
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

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

})