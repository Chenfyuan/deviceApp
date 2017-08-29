/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
'use strict';
import React, { Component } from 'react';
import {
  Text,
WebView,
  TouchableOpacity,
  View,
  TouchableHighlight,
    Dimensions,
    InteractionManager,
    Platform,
} from 'react-native';
import {HOST} from '../constantsUrl/Urls';
import ModalDropdown from 'react-native-modal-dropdown';
import Loading from '../component/Loading'
import styles from '../styleSheet/Styles';
import NetUtil from '../util/NetUtil';
import Icon from 'react-native-vector-icons/FontAwesome';//字体图标
const {height,width}= Dimensions.get('window');
var map=new Map();
export default class HomePage extends Component {
   constructor(props){
        super(props);
      this.state = {
      url: 'https://www.baidu.com',
      funcname: '查看',
      show: false,
      loading: false,
   list:[],
   DEMO_OPTIONS_1:[],
   isFit:true,
    };
     
    }
 
  componentDidMount() { 
    let toFit=Platform.OS=='ios'?false:true;
     this.setState({
      url: this.props.url,
      funcname: this.props.funcname,
      isFit:toFit,
    });
   InteractionManager.runAfterInteractions(()=>{  
       NetUtil.getDataAsync(`${HOST}core/orgJson/getCompanies.do`,(reponseData)=>
     {
 var textArr=[];
    for(var i=0;i<reponseData.length;i++)
    {
     var text= reponseData[i].split(":");
     var key=text[0];
     var value=text[1];
      map.set(key,value);
      textArr.push(text[1])
    }
    
       this.setState({
        DEMO_OPTIONS_1:textArr

       })
     })
   });
            
    }  
  onNavigationStateChange(event) {
    console.log(JSON.stringify(event));
    this.setState({

      loading: event.loading,
  
    })

  }
_dropdown_2_renderRow(rowData, rowID, highlighted) {
    let evenRow = rowID % 2;
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
      <View style={styles.container}>
        <View style={styles.navOutViewStyle}>
  <View style={{flex:1,paddingLeft:8}}>
    <TouchableOpacity  onPress={()=>this.goBack()}>
                       <Icon name="chevron-left" size={24} color="#ffffff"></Icon>
                    </TouchableOpacity>   
                    </View>  
               <View style={{flex:4,alignItems:'center'}}>
                 <Text style={styles.topBarText}>统计</Text>
               </View>
                     <View style={{flex:1,alignItems:'flex-end',paddingRight:8}}>
            {this.props.orgTypeId==1?    <ModalDropdown style={styles.dropdown_6}
                           options={this.state.DEMO_OPTIONS_1}
                           textStyle={styles.dropdown_2_text}
                           dropdownStyle={styles.dropdown_3_dropdown}
                           renderRow={this._dropdown_2_renderRow.bind(this)}
                           onSelect={(idx, value) => this._dropdown_6_onSelect(idx, value)}>
                            <Icon name="bars" size={24} color="#ffffff"></Icon>
                       </ModalDropdown>:<Text></Text>
                       }
        </View>   
                   </View>
        <WebView
            ref="webViewAndroid "
            style={{ width: width, height:height, backgroundColor: 'white' }}
            source={{ uri: this.state.url, method: 'POST' }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            scalesPageToFit={this.state.isFit}
            onNavigationStateChange={this.onNavigationStateChange.bind(this)}
            automaticallyAdjustContentInsets={true}
          />
          <Loading loading={this.state.loading}  onBack={()=>{this.setState({loading:false})}}/>
      </View>   
    );
  } 
  _dropdown_6_onSelect(idx, value) { 
  map.forEach((text,key)=>{
if(value==text)
{
  this.setState(
    {
     url:`${HOST}analysis/appAnalysisIndex.do.do?companyId=${key}`,
    }
  )
}
});
  }
  goBack(){
    const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
  }
}



