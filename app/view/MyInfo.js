'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';

import {MY_INFO} from '../constantsUrl/Urls';
import NetUitl from '../util/NetUtil';
import TopBar from '../component/TopBar';
import UpdatePassWord from './UpdatePassWord';
import UpdateInfo from './UpdateInfo';
var Dimensions = require('Dimensions');
const width= Dimensions.get('window').width;
export default class MyInfo extends Component {

   constructor(props){
        super(props);
        this.state = {
          info:null,
          userCode:''
        };  
    }

     componentDidMount() {  
        //这里获取传递过来的参数
        // this.setState({ 
        //     userCode:this.props.userCode,
        // });  
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
            })
        });
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
        <TopBar name='个人信息' onBackUp={this.onBackUp}/>
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

           <View style={{flexDirection:'row',marginLeft:20,marginTop:15}}>
             <Text style={styles.text}>
               手机号码：  
             </Text>   
              <Text style={{marginLeft:10}}>
                {this.state.info.mobile}  
             </Text>  
         </View>  
         <View
             style={{height:1,backgroundColor:'#dfdfdf',marginLeft:15,marginRight:15,marginTop:15}}
          /> 

          <View style={{flexDirection:'row',marginLeft:20,marginTop:15}}>
             <Text style={styles.text}>
            电子邮箱：  
             </Text>   
              <Text style={{marginLeft:10}}>
                {this.state.info.email}  
             </Text>  
         </View>  
          <View
             style={{height:1,backgroundColor:'#dfdfdf',marginLeft:15,marginRight:15,marginTop:15}}
          /> 

          <View style={{flexDirection:'row',marginLeft:20,marginTop:15}}>
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

           <View style={{flexDirection:'row'}}>
               <View style={{flex:1}}>
         <TouchableOpacity style={styles.btnTextView} onPress={this.onUpdate.bind(this,0)}>
         <Text style={styles.btnText} >
           修改资料
         </Text>
          </TouchableOpacity>
          </View>
               <View style={{flex:1}}>
         <TouchableOpacity style={styles.btnTextView} onPress={this.onUpdate.bind(this,1)}>
         <Text style={styles.btnText} >
           修改密码
         </Text>
          </TouchableOpacity>
          </View>

           </View>    
      </View>    
          )
     }

     onBackUp = () => {
         this.goBack();
     }

     onUpdate(index){
      switch(index){
          case 0:
          this.goToUpdateInfo();
          break;
          case 1:
          this.goToUpdatePassWord();
          break;
          default:
          break;
      }
     }

     goToUpdateInfo(){
       const { navigator } = this.props;
       if (navigator) {
       navigator.push({
         name : 'UpdateInfo',
         component :UpdateInfo,
          params:{  
           userCode:this.state.userCode,
            callBack:(data)=>{
             this.refeshView(data);
          }
          },
       });
     } 
    }
    
    refeshView(data){
      this.setState({
        userCode:data,
      });
      this.getInfoData();
    }


     goToUpdatePassWord(){
       const { navigator } = this.props;
       if (navigator) {
       navigator.push({
         name : 'UpdatePassWord',
         component :UpdatePassWord,
          params:{  
           userCode:this.state.userCode,
          }
       });
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  text:{
    fontSize:15,
  },
  	loading:{
		flex:1,
		justifyContent:'center',
		alignItems:'center',
	},
    btnText: {
     color: '#ffffff',
     fontWeight: 'bold',
  },
  btnTextView: {
    marginRight:5,
      marginLeft:5,
      marginTop:5,
    height:width/10,
    width:(width/2)-10,
    backgroundColor: '#2881B9',
    borderRadius:3,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:'center',
  },
});