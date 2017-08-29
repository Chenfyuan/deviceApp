
'use strict';
import React, { Component } from 'react';
import {
	Text,
	View,
	ListView,
	ActivityIndicator,
    RefreshControl,
	TextInput,
	TouchableOpacity,
	InteractionManager
} from 'react-native';
import styles from '../styleSheet/Styles'
import {MSG_LIST,HOST} from '../constantsUrl/Urls';
import TopBar from '../component/TopBar';
import WebViewExample from './WebViewExample';
var Dimensions = require('Dimensions');
const  {width}= Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';//字体图标
export default class MsgList extends Component {
	constructor(props){
		super(props);
        
		this.state = {
			searchName:"",
			msgs: [],
			loaded: false,
            isRefreshing: false,
			count: 10,
			start: 1,
			total: 0,
			name:'',
		};

		this.dataSource = new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2 
		});
		InteractionManager.runAfterInteractions(()=>{  
      this.fetchData();  
   });
	}

	requestURL(
		url = MSG_LIST,
		count = this.state.count,
		start = this.state.start,
		name=this.state.name,
	){
		return (
			`${url}?pageSize=${count}&currentpage=${start}&name=${name}`
		);
	}

	fetchData(){
		fetch(this.requestURL())
		.then(response => response.json())
		.then(responseData => {
			this.setState({
				msgs: responseData.list,
				loaded: true,
				total: responseData.totalRow,
			});
		})
		.done();
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

gotoMsg(url)
{
let furl=HOST+url;
   const { navigator } = this.props;
       if (navigator) {
       navigator.push({
         name : 'WebViewExample',
         component :WebViewExample,
          params:{  
           url:furl,
		   funcname:'消息查看'
          }
       });
     }

}
	renderMovieItem(movie){	
		
		return (		
				<View style={styles.item}>

					<View style={styles.itemContent}>
					
<View style={styles.itemRow}>
<View style={{flex:4}}><Text style={styles.itemHeader}>{movie.title}</Text></View>
	<View style={{flex:1,alignItems:'flex-end',marginRight:2}}>
		{
			movie.url===null||movie.url===''?
			<Text style={{color:'gray',width:40,height:20,textAlign:'center',borderWidth:1,borderColor:'gray',marginRight:2,borderRadius:2}}>查看</Text>:
		<TouchableOpacity onPress={()=>this.gotoMsg(movie.url)}>
		<Text style={{color:'#23bfff',width:40,height:20,textAlign:'center',borderWidth:1,borderColor:'#23bfff',marginRight:2,borderRadius:2}}>查看</Text>
		</TouchableOpacity>
		
		}
		</View>
</View>
<View style={{height:1,alignItems:'center',justifyContent:'center'}}>
<View style={{backgroundColor:'#cccccc',height:1,width:width-40}}></View>
</View>
							<View>
								<Text style={styles.itemMeta}>
                                {movie.content}
							</Text>
							</View>
<View>
	<Text style={[styles.itemMeta,{fontSize:12,marginBottom:1}]}>发送时间:{movie.sendTimeStr}</Text>
</View>


					</View>
				</View>
			// </TouchableHighlight>
		);
	}

	loadMore(){
        let newStart=(this.state.start)+1;
        this.setState({
			start:newStart,
		});
		console.log(this.requestURL());
		fetch(this.requestURL())
		.then(response => response.json())
		.then(responseData=>{
			this.setState({
				msgs:[...this.state.msgs, ...responseData.list],
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
				   <TopBar name='消息列表' onBackUp={this.onBackUp}/>	
                   <View style={[styles.flexDirection,styles.inputHeight]}>
                    <View style = {styles.flex}>
                        <TextInput style = {styles.inputs} 
                                   returnKeyType = "search"
                                   placeholder= "请输入消息名称查找"
								   onChangeText={
                                      (text) => {
                                    this.setState({
                                       name:text

									});
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
						dataSource = {this.dataSource.cloneWithRows(this.state.msgs)}
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

