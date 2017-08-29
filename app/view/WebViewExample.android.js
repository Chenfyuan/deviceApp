'use strict';
import React, { Component } from 'react';
import {
  View,
  Dimensions,
} from 'react-native';
import TopBar from '../component/TopBar';
const { width, height } = Dimensions.get('window');
import WebViewAndroid from 'react-native-webview-android';
import styles from '../styleSheet/Styles'
import Loading from '../component/Loading'
export default class WebViewExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: 'https://www.baidu.com',
      funcname: 'webview',
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
    this.setState({loading:false})
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
  render() {
    return (     
      <View style={styles.container} >
        <TopBar name={this.state.funcname} onBackUp={this.onBackUp} />
        <WebViewAndroid
            ref="webViewAndroid "
            style={{ width: width, height:(11*height)/12, backgroundColor: 'white' }}
            source={{ uri: this.state.url, method: 'POST' }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            scalesPageToFit={true}
            onNavigationStateChange={this.onNavigationStateChange.bind(this)}
            automaticallyAdjustContentInsets={true}
          />
      <Loading loading={this.state.loading}  onBack={()=>{this.setState({loading:false})}}/>
      </View>
     
    );
  }
}




