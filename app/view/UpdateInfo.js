'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert
} from 'react-native';
import {MY_INFO,UPDATE_INFO} from '../constantsUrl/Urls';
import NetUitl from '../util/NetUtil';
import TopBar from '../component/TopBar';
import EditView from '../component/EditView';
import LoginButton from '../component/LoginButton';
import { toastLong} from '../util/ToastUtil';
export default class UpdateInfo extends Component {
   constructor(props){
        super(props);
        this.state = {
          info:null,
          mobile:'',
          email:'',
        };
    }

      componentDidMount() {  
       this.state.userCode=this.props.userCode;
       if(this.state.userCode){
        this.getInfoData();
        }
    }  
    getInfoData(){
    let formData = new FormData();
    formData.append("id",this.state.userCode);
        NetUitl.postJson(MY_INFO,formData,(responseText) => {
            this.setState({
                info:responseText,
                mobile:responseText.mobile,
                email:responseText.email,
            })
        })
    }  
	renderLoading(){
		return (
			<View style={styles.container}>
				<View style={styles.loading}>
					<ActivityIndicator size="large" color="#6435c9" />
				</View>
			</View>
		);
	}
    render(){
		return this.state.info ? this.renderInfo() : this.renderLoading();
	 }
     renderInfo() {
          return (
      <View style={styles.container}>
         <TopBar name='修改信息' onBackUp={this.onBackUp}/>
        <View style={{flexDirection:'row',marginLeft:20,marginTop:15}}>
             <Text style={styles.text}>
               姓        名：  
             </Text>   
              <Text style={{marginLeft:10}}>
               {this.state.info.userName}  
             </Text>  
         </View>   
         <View
             style={{height:1,backgroundColor:'#dfdfdf',marginLeft:15,marginRight:15,marginTop:15}}
          /> 
          <View style={{flexDirection:'row',marginLeft:20,marginTop:15}}>
             <Text style={styles.text}>
               性        别：  
             </Text>   
              <Text style={{marginLeft:10}}>
                {this.state.info.sex==0?'女':'男'}  
             </Text>  
         </View>   
         <View
             style={{height:1,backgroundColor:'#dfdfdf',marginLeft:15,marginRight:15,marginTop:15}}
          /> 
           <View style={styles.textView}>
             <Text style={styles.text}>
               手机号码：  
             </Text>   
               <EditView  
                  name="请输入手机号码"
                  defaultValue={this.state.info.mobile} 
                  onChangeText={(text) => {  
                  this.setState({
                    mobile:text
                  })
               }}/>
         </View>  
         <View
             style={{height:1,backgroundColor:'#dfdfdf',marginLeft:15,marginRight:15,marginTop:15}}
          /> 
          <View style={styles.textView}>
             <Text style={styles.text}>
            电子邮箱：  
             </Text>   
                  <EditView  
                    name="请输入电子邮箱"
                    defaultValue={this.state.info.email} 
                    onChangeText={(text) => {  
                      this.setState({
                      email:text
                  })
               }}/>
         </View>  
          <View
             style={{height:1,backgroundColor:'#dfdfdf',marginLeft:15,marginRight:15,marginTop:15}}
          /> 
          <View style={{marginLeft:20,marginTop:15,flexDirection:'row'}}>
             <Text style={styles.text}>
             所属部门：  
             </Text>   
              <Text style={{marginLeft:10}}>
                {this.state.info.orgName}  
             </Text>  
         </View>       
         <View
             style={{height:1,backgroundColor:'#dfdfdf',marginLeft:15,marginRight:15,marginTop:15}}
          /> 
            <View style={{margin:10}}>
            <LoginButton name='确认' onPressCallback={this.onPressCallback}/>
           </View>
      </View>    
       )
     }
 onPressCallback = () => {
      let CheckEmail  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      let CheckPhone =/^1[34578]\d{9}$/;
       if (this.state.mobile !== '' && !CheckPhone.test(this.state.mobile)) {
           toastLong('您的手机号码不正确!');
          return;
         }
      if (this.state.email !== '' && !CheckEmail.test(this.state.email)) {
           toastLong('您的邮箱不正确!');
         return;
        }

     let formData = new FormData();
     formData.append("id",this.state.userCode);
     formData.append("mobile",this.state.mobile);
     formData.append("email",this.state.email);
          NetUitl.postJson(UPDATE_INFO,formData,(responseText) => {
               var msg=responseText.msg;
               if(msg.includes("成功")){
                 toastLong('修改成功！');
                 this.onBack();
               }else{
               Alert.alert('提示','修改失败', [{text: '确定', onPress: () => {
              }},]);
             }    
          })
       }
     onBack(){
       this.props.callBack(this.state.userCode);
       this.goBack();
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
    backgroundColor: '#F5FCFF',
  },
  text:{
    fontSize:15,
  },
    btnText: {
     color: '#ffffff',
     fontWeight: 'bold',
  },
  btnTextView: {
    margin:20,
    height:40,
    width:150,
    backgroundColor: '#2881B9',
    //borderRadius:5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:'center',
  },
  loading:{
		flex:1,
		justifyContent:'center',
		alignItems:'center',
	},
  textView:{
    flexDirection:'row',
    alignItems:'center',
    marginLeft:20,
    marginRight:20,
  }
});