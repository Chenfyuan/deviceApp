'use strict';
import React, { Component } from 'react';
import styles from '../styleSheet/Styles';
import {
    View,
    ActivityIndicator,
    Modal,
} from 'react-native';
class Loading extends Component {
    /**
     * 正在加载组件
     * linweijian
     */
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            loading: false,
        };
    }

    componentDidMount() {

        this.setState({
            //loading:this.props.loading
        })
    }
    componentWillReceiveProps(nextProps) {
        // console.log("checkbox接收到新参数啦"+nextProps);

        //this.setState({loading:this.props.loading})
    }
    render() {

        return (
            <Modal transparent={true}
                onRequestClose={this.props.onBack}
                visible={this.props.loading} >
                <View style={styles.container2}>
                    <View style={styles.loading1}>
                        <ActivityIndicator size="large" color="#6435c9" />
                    </View>
                </View>
            </Modal>

        );
    }

}
module.exports = Loading;