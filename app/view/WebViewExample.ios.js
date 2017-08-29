'use strict';
import React, { Component } from 'react';
import {
    View,
    Dimensions,
    WebView,
} from 'react-native';
import TopBar from '../component/TopBar';
import Loading from '../component/Loading'
const { width, height } = Dimensions.get('window');
import styles from '../styleSheet/Styles';
export default class WebViewExample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: 'https://www.baidu.com',
            funcname: '',
            show: false,
            loading: true,

        };
    }
    componentDidMount() {
        //这里获取传递过来的参数
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
        this.setState({loading:event.loading})
    }
    render() {
        return (
            <View style={styles.container} >
                <TopBar name={this.state.funcname} onBackUp={this.onBackUp} />
                <WebView
                    style={{ width: width, height:(11*height)/12, backgroundColor: 'white' }}
                    source={{uri:this.state.url}}
                    startInLoadingState={true}
                    onNavigationStateChange={this.onNavigationStateChange.bind(this)}
                    automaticallyAdjustContentInsets={true}/>
<Loading loading={this.state.loading}  onBack={()=>{this.setState({loading:false})}}/>                    
            </View>
        );
    }
}




