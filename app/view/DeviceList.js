
'use strict';
import React, { Component } from 'react';
import {
	Text,
	View,
	ListView,
	ActivityIndicator,
	TouchableHighlight,
    RefreshControl,
	TextInput,
	TouchableOpacity,
	InteractionManager
} from 'react-native';
import {EQUIP_LIST,HOST} from '../constantsUrl/Urls';
import TopBar from '../component/TopBar';
import styles from '../styleSheet/Styles';
import { toastLong } from '../util/ToastUtil';
import WebView from '../view/WebViewExample';
var Dimensions = require('Dimensions');
const  {width}= Dimensions.get('window');
import DeviceDetail from './DeviceDetail';
import Icon from 'react-native-vector-icons/FontAwesome';//字体图标
export default class DeviceList extends Component {
	constructor(props){
		super(props);
		this.state = {
			devices: [],
			loaded: false,
            isRefreshing: false,
			count: 10,
			start: 1,
			total: 0,
			name:'',
			searchName:''
		};

		this.dataSource = new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2 
		});
				InteractionManager.runAfterInteractions(()=>{  
      this.fetchData();  
   });
	}

	requestURL(
		url = EQUIP_LIST,
		count = this.state.count,
		start = this.state.start,
		name=this.state.name,){
		return (
			`${url}?pageSize=${count}&currentpage=${start}&name=${name}`
		);
	}

	fetchData(){
		fetch(this.requestURL())
		.then(response => response.json())
		.then(responseData => {
			this.setState({
				devices: responseData.list,
				loaded: true,
				total: responseData.totalRow,
			});
		}).catch(error=>{toastLong(error);this.setState({loaded:true})})
		.done();
	}

	showMovieDetail(movie){
	 const { navigator } = this.props;
     if (navigator) {
       navigator.push({
         name : 'DeviceDetail',
         component :WebView,
		 params:{
			 url:`${HOST}equipment/detailView.do?id=${movie.id}`,
			 funcname:'设备详情'
		 }
       });
     }
	}

     /**
     * 下拉刷新
     */
    onRefresh() {
         this.setState({
			start:1,
			isRefreshing:true
		});
        this.fetchData();
        this.setState({
			isRefreshing:false
		});
    }


	renderMovieItem(movie){
		//console.log(movie);
		return (
			<TouchableHighlight
				underlayColor="rgba(34, 26, 38, 0.1)"
				onPress={() => this.showMovieDetail(movie)}>
				<View style={styles.item}>
					<View style={styles.itemContent}>
						<View style={styles.itemRow}>
							<View style={{flex:4}}>
								<View style={styles.itemRow}>
									<Text style={styles.itemHeader}>{movie.name}</Text>
									<Text style={{fontSize:18,fontFamily: 'Helvetica Neue',fontWeight: '300',color: 'red',}}>{movie.isParticular?'[特种设备]':''}</Text>
								</View>								
							</View>
						
							<View style={{flex:1,alignItems:'flex-end',marginRight:2}}>
								<Text style={{color:'#ffffff',width:40,height:20,textAlign:'center',marginRight:2,borderRadius:2,backgroundColor:'#169BD5'}}>{movie.equipStateName}</Text>							
								</View>
						</View>	
										<View style={{height:1,alignItems:'center',justifyContent:'center'}}>
<View style={{backgroundColor:'#cccccc',height:1,width:width-40}}></View>
</View>
						 <Text style={styles.itemMeta}>
							使用部门：{movie.useOrgName}
						</Text>
						 <Text style={styles.itemMeta}>
							类        别：{movie.typeName}
						</Text>
						 <Text style={styles.itemMeta}>
							技术类别：{movie.techStateName}
						</Text>
						 <Text style={styles.itemMeta}>
						使用区域：{movie.useAreaName}
						</Text>
						 <Text style={styles.itemMeta}>
							购买日期：{movie.buyDate}
						</Text>
                       
						
					
					</View>
				</View>
			</TouchableHighlight>
		);
	}

	loadMore(){
        let newStart=(this.state.start)+1;
        this.setState({
			start:newStart,
		});
		fetch(this.requestURL())
		.then(response => response.json())
		.then(responseData=>{
			this.setState({
				devices:[...this.state.devices, ...responseData.list],
			});
		})
		.done();
	}

	onEndReached(){
		this.state.total >= ((this.state.start)*(this.state.count)) && this.loadMore();
	}

	renderFooter(){
		if(this.state.total >= ((this.state.start)*(this.state.count))){
			return (
				<View style={ styles.footerLoading }>
					<ActivityIndicator
                     />
				</View>
			);
		}else{
			return (
				<View style={ styles.footerLoading }>
					<Text style={ styles.footerLoadingTxt }>
						暂无更多数据...
					</Text>
				</View>
			);
		}
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

	renderMovieList (){
			return (
				<View style={styles.msgContainer}>
				   <TopBar name='台账列表' onBackUp={this.onBackUp}/>	
                   <View style={[styles.flexDirection,styles.inputHeight]}>
                    <View style = {styles.flex}>
                        <TextInput style = {styles.inputs} 
                                   returnKeyType = "search"
                                   placeholder= "请输入设备名称查找"
								   	onSubmitEditing={this.onSearchPress.bind(this)}
								   onChangeText={
                                      (text) => {
                                      this.setState({name:text})
                                    }
								
                               }/>
                    </View>
                    <View style = {styles.btn}>
						<TouchableOpacity onPress={this.onSearchPress.bind(this)}>
                        <Icon name={'search'} size={30} color={'black'}/>
						</TouchableOpacity>
                    </View>
                </View>

					<ListView 
					    enableEmptySections = {true} 
						renderFooter = {this.renderFooter.bind(this)}
						pageSize = {this.state.count}
						initialListSize = {this.state.count}
						dataSource = {this.dataSource.cloneWithRows(this.state.devices)}
						renderRow = {this.renderMovieItem.bind(this)}
						onEndReached = {this.onEndReached.bind(this)}
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

	onSearchPress(){
         this.fetchData();
	}
	
	render(){
		return this.state.loaded ? this.renderMovieList() : this.renderLoading();
	}

	    onBackUp = () => {
         this.goBack();
     }

    /*componentWillMount() {
        BackAndroid.addEventListener('hardwareBackPress', ()=>this.goBack());//监听安卓回退按钮
    }*/

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


