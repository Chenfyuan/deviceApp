'use strict';
import React, { Component } from 'react';
import {
    Text,
    View,
    ListView,
    ActivityIndicator,
    TouchableHighlight,
    RefreshControl,
    InteractionManager
} from 'react-native';
import styles from '../styleSheet/Styles';
import { JOBORDER_LIST, DO_JOBORDER } from '../constantsUrl/Urls';
import { toastLong } from '../util/ToastUtil';
import TopBar from '../component/TopBar';
import WebViewExample from './WebViewExample';
var Dimensions = require('Dimensions');
const { width } = Dimensions.get('window');
export default class JobOrderList extends Component {
    constructor(props) {
        super(props);
        this.searchName = "";
        this.state = {
            jobOrders: [],
            loaded: false,
            isRefreshing: false,
            count: 10,
            start: 1,
            total: 0,
            name: '',
            userCode: null
        };

        this.dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
    }

    componentDidMount() {
        this.state.userCode = this.props.userCode;
        if (this.state.userCode) {
            InteractionManager.runAfterInteractions(() => {
                this.fetchData();
            });
        }
    }

    requestURL(url = JOBORDER_LIST,
        count = this.state.count,
        start = this.state.start,
        name = this.state.name,
        userCode = this.state.userCode, ) {
        return (
            `${url}?pageSize=${count}&currentpage=${start}&title=${name}&userId=${userCode}`
        );
    }

    fetchData() {
        fetch(this.requestURL())
            .then(response => response.json())
            .then(responseData => {
                this.setState({
                    jobOrders: responseData.list,
                    loaded: true,
                    total: responseData.totalRow,
                });
            }).catch(error => {
                toastLong(error);
                this.setState({ loaded: true })
            })
            .done();
    }

    showMovieDetail(movie) {
        const { navigator } = this.props;

        if (navigator) {
            navigator.push({
                name: 'WebViewExample',
                component: WebViewExample,
                params: {
                    url: DO_JOBORDER + "?taskId=" + movie.id,
                    funcname: '工单详情',
                }
            });
        }
    }

    /**
     * 下拉刷新
     */
    onRefresh() {
        this.setState({
            start: 1,
            isRefreshing: true
        });
        this.fetchData();
        this.setState({
            isRefreshing: false
        });
    }


    renderMovieItem(movie) {
        console.log(movie)
        return (
            <TouchableHighlight
                underlayColor="rgba(34, 26, 38, 0.1)"
                onPress={() => this.showMovieDetail(movie)}>
                <View style={styles.item}>
                    <View style={styles.itemContent}>
                        <View style={styles.itemRow}>
                            <View style={{ flex: 4, flexDirection: 'row' }}><Text style={styles.itemHeader}>{movie.name}</Text></View>
                            <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 2 }}>{movie.status == 'Ready' ?
                                <Text style={{
                                    color: '#23bfff',
                                    width: 60,
                                    height: 20,
                                    textAlign: 'center',
                                    borderWidth: 1,
                                    borderColor: '#23bfff',
                                    marginRight: 2,
                                    borderRadius: 2
                                }}>未执行</Text> :
                                <Text style={{
                                    color: 'green',
                                    width: 60,
                                    height: 20,
                                    textAlign: 'center',
                                    borderWidth: 1,
                                    borderColor: 'green',
                                    marginRight: 2,
                                    borderRadius: 2
                                }}>已认领</Text>
                            }
                            </View>
                        </View>
                        <View style={{ height: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ backgroundColor: '#cccccc', height: 1, width: width - 40 }}></View>
                        </View>
                        <Text style={styles.itemMeta}>
                            单号：{movie.processInstanceId}
                        </Text>
                        <Text style={styles.itemMeta}>
                            任务类型：{movie.processName}
                        </Text>
                        <Text style={styles.itemMeta}>
                            任务名：{movie.description}
                        </Text>
                        <View style={styles.itemRow}>
                            <View style={{ flex: 4 }}><Text style={styles.itemMeta}>
                                开始时间：{movie.createTime}
                            </Text></View>
                            <View style={{ flex: 2 }}>
                                <Text style={styles.itemMeta}>
                                    提单人：{movie.creator}
                                </Text>
                            </View>

                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    loadMore() {
        let newStart = (this.state.start) + 1;
        this.setState({
            start: newStart,
        });
        fetch(this.requestURL())
            .then(response => response.json())
            .then(responseData => {
                this.setState({
                    jobOrders: [...this.state.jobOrders, ...responseData.list],
                });
            })
            .done();
    }

    onEndReached() {

        this.state.total >= ((this.state.start) * (this.state.count)) && this.loadMore();
    }

    renderFooter() {
        if (this.state.total >= ((this.state.start) * (this.state.count))) {
            return (
                <View style={styles.footerLoading}>
                    <ActivityIndicator
                    />
                </View>
            );
        } else {
            return (
                <View style={styles.footerLoading}>
                    <Text style={styles.footerLoadingTxt}>
                        暂无更多数据...
                    </Text>
                </View>
            );
        }
    }

    renderLoading() {
        return (
            <View style={styles.container}>
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="#6435c9" />
                </View>
            </View>
        );
    }

    renderMovieList() {
        return (
            <View style={styles.msgContainer}>
                <TopBar name='待办列表' onBackUp={this.onBackUp} />
                <ListView
                    enableEmptySections={true}
                    renderFooter={this.renderFooter.bind(this)}
                    pageSize={this.state.count}
                    initialListSize={this.state.count}
                    dataSource={this.dataSource.cloneWithRows(this.state.jobOrders)}
                    renderRow={this.renderMovieItem.bind(this)}
                    onEndReached={this.onEndReached.bind(this)}
                    refreshControl={//下拉刷新的配置
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this.onRefresh.bind(this)}//刷新触发的函数
                            colors={['#8BC34A']}
                            progressBackgroundColor="#ffffff"
                        />
                    }
                />
            </View>
        );
    }

    onSearchPress() {
        this.setState({
            name: this.searchName,
        });
        this.fetchData();
    }

    render() {
        return this.state.loaded ? this.renderMovieList() : this.renderLoading();
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

