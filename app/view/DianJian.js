
'use strict';
import React, { Component } from 'react';
import {
	Text,
	View,
	ListView,
	ActivityIndicator,
	TouchableHighlight,
    RefreshControl,
	TouchableOpacity,
	 InteractionManager,
} from 'react-native';
import styles from '../styleSheet/Styles';
import {DIANJIAN_LIST} from '../constantsUrl/Urls';
import { toastLong } from '../util/ToastUtil';
import TopBar from '../component/TopBar';
import QrcodeDianJian from '../view/QrcodeDianJian';
export default class JobOrderList extends Component {
	constructor(props){
		super(props);
        this.searchName="";
		this.state = {
			jobOrders: [], loaded: false, isRefreshing: false,
			count: 10, start: 1, total: 0, name:'', userCode:null,
			weekParm:'', action:0, endDate:'',
		};

		this.dataSource = new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2 
		});
	}

     componentDidMount() {
       InteractionManager.runAfterInteractions(()=>{  
      this.fetchData(
			  DIANJIAN_LIST,
			  this.state.count,
			  this.state.start,
			  this.state.name,
			  this.state.userCode,
			  this.state.action,
			  this.state.weekParm
			  );
   });

    }  

	fetchData(url,count,start,name,userCode,action,weekParm){		
		fetch(`${url}?pageSize=${count}&currentpage=${start}&title=${name}&userId=${userCode}&action=${action}&weekParm=${weekParm}`)
		.then(response => response.json())
		.then(responseData => {		
			this.setState({			
				jobOrders: responseData.list,
				weekParm:responseData.backWeekParm,
				total: responseData.totalRow,
				endDate:responseData.endDate,
				loaded: true,
			});
		}).catch(error=>{toastLong(error);this.setState({loaded:true})})
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
          this.fetchData(
			  DIANJIAN_LIST,
			  this.state.count,
			  this.state.start,
			  this.state.name,
			  this.state.userCode,
			  0,
			  this.state.weekParm
			  );
        this.setState({
			isRefreshing:false
		});
    }
	//渲染一周组件的函数
renderWeek(movie)
{
	console.log(movie);
var monday=movie.week2;//一
var tuesday=movie.week3;//二
var wednesday=movie.week4;//三
var thursday=movie.week5;//四
var friday=movie.week6;//五
var saturday=movie.week7;//六
var sunday=movie.week1;//日
    var items=[];
    for(var i=0;i<7;i++)
    {
	let d='';
	if(i==0&&sunday==1)d=<TouchableOpacity onPress={this._onPress.bind(this,i,movie.vo)} key={i}><Text style={styles.weekClick}>日</Text></TouchableOpacity>;
	if(i==0&&sunday==0)d=<Text style={styles.week} key={i}>日</Text>;
	if(i==1&&monday==1)d=<TouchableOpacity onPress={this._onPress.bind(this,i,movie.vo)} key={i}><Text style={styles.weekClick}>一</Text></TouchableOpacity>;
	if(i==1&&monday==0)d=<Text style={styles.week} key={i}>一</Text>
	if(i==2&&tuesday==1)d=<TouchableOpacity onPress={this._onPress.bind(this,i,movie.vo)} key={i}><Text style={styles.weekClick}>二</Text></TouchableOpacity>;
	if(i==2&&tuesday==0)d=<Text style={styles.week} key={i}>二</Text>
	if(i==3&&wednesday==1)d=<TouchableOpacity onPress={this._onPress.bind(this,i,movie.vo)} key={i}><Text style={styles.weekClick}>三</Text></TouchableOpacity>;
	if(i==3&&wednesday==0)d=<Text style={styles.week} key={i}>三</Text>
	if(i==4&&thursday==1)d=<TouchableOpacity onPress={this._onPress.bind(this,i,movie.vo)} key={i}><Text style={styles.weekClick}>四</Text></TouchableOpacity>;
	if(i==4&&thursday==0)d=<Text style={styles.week} key={i}>四</Text>
	if(i==5&&friday==1)d=<TouchableOpacity onPress={this._onPress.bind(this,i,movie.vo)} key={i}><Text style={styles.weekClick}>五</Text></TouchableOpacity>;
	if(i==5&&friday==0)d=<Text style={styles.week} key={i}>五</Text>
	if(i==6&&saturday==1)d=<TouchableOpacity onPress={this._onPress.bind(this,i,movie.vo)} key={i}><Text style={styles.weekClick}>六</Text></TouchableOpacity>;
	if(i==6&&saturday==0)d=<Text style={styles.week} key={i}>六</Text>
items.push(d);
    }
    return (
<View style={{justifyContent:'flex-start',flexDirection:'row',flexWrap:'wrap',alignItems:'center'}}> 
{items}
 </View>   
    );
}
	//切换上一周的函数
preWeek()
{	
	this.setState({
		loaded:true
	})
  this.fetchData(
			  DIANJIAN_LIST,
			  this.state.count,
			  this.state.start,
			  this.state.name,
			  this.state.userCode,
			  -1,
			  this.state.weekParm
			  );
}
//切换下一周的函数
nextWeek()
{
		this.setState({
		loaded:true
	})
  this.fetchData(
			  DIANJIAN_LIST,
			  this.state.count,
			  this.state.start,
			  this.state.name,
			  this.state.userCode,
			   1,
			  this.state.weekParm
			  );
}
//切换到本周的函数
nowWeek()
{
		this.setState({
		loaded:true
	})
  this.fetchData(
			  DIANJIAN_LIST,
			  this.state.count,
			  this.state.start,
			  this.state.name,
			  this.state.userCode,
			  0,
			  ''
			  );
}
//点击一周某天的函数
_onPress(i,movie)
{
	let day=i;
	let startTime=this.state.weekParm;
	startTime=startTime.replace(/-/g,'/');//格式化时间
	let timestamp=Date.parse(new Date(startTime))/1000;//当前日期时间戳
	timestamp=timestamp+(i*86400);
	let actualTtime=new Date(timestamp*1000);
	let month=actualTtime.getMonth()+1;
	if(month<10)
	month=`0${month}`;
	let days=actualTtime.getDate();
	if(days<10)
	days=`0${days}`;
	let actualDate=`${actualTtime.getFullYear()}-${month}-${days}`;
    const { navigator } = this.props;
    if (navigator) {
        navigator.push({
            name : 'qrcode',
            component :QrcodeDianJian,
            params:{
                equipId:movie.equipId,
                equipName:movie.equipName,
                partId:movie.partId,
                planId:movie.id,
                planTime:actualDate,
                checkUser:movie.checkUser,
                areaId:movie.areaId,
                actualTime:actualDate,
                partName:movie.partName,
                deviceIdentityCode:movie.deviceIdentityCode,
                funccode:'rcjclc_app',
            }
        });
    }

}
	renderMovieItem(movie){
	return (
			<TouchableHighlight
				underlayColor="rgba(34, 26, 38, 0.1)">
				<View style={[styles.items,{borderRadius:0,marginLeft:0,marginRight:0,borderColor:'#fff',marginTop:6}]}>
				<View style={styles.itemRow}>
                    <View style={styles.row}><Text style={{fontSize:16}}>{movie.vo.areaName}</Text></View>		
                    <View style={styles.row}><Text style={{fontSize:16}}>{movie.vo.equipName}</Text></View>
                    <View style={styles.row}><Text style={{fontSize:16}}>{movie.vo.partName==null?"整机":movie.vo.partName}</Text></View>
                    </View>  
					{this.renderWeek(movie)}  
				</View>					
			</TouchableHighlight>
		
		);
	}
	//加载更多
	loadMore(){
        let newStart=(this.state.start)+1;
        this.setState({
			start:newStart,
		});
		console.log(`${DIANJIAN_LIST}?pageSize=${this.state.count}&currentpage=${this.state.start}&title=${this.state.name}&userId=${this.state.userCode}&action=0&weekParm=${this.state.weekParm}`);
		fetch(`${DIANJIAN_LIST}?pageSize=${this.state.count}&currentpage=${this.state.start}&title=${this.state.name}&userId=${this.state.userCode}&action=0&weekParm=${this.state.weekParm}`)
		.then(response => response.json())
		.then(responseData=>{
			this.setState({
				jobOrders:[...this.state.jobOrders, ...responseData.list],
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
				   <TopBar name='点检' onBackUp={this.onBackUp} />	
                    <View style = {{height:55,flexDirection:'row',justifyContent:'center',alignItems:'center',borderColor:'#ccc',borderWidth:1,backgroundColor:'#ffffff'}}>
      <View style={{flex:1,alignItems:'flex-start'}}>
		  <TouchableOpacity onPress={this.preWeek.bind(this)}>
	   <Text >上一周</Text>
	   </TouchableOpacity>
	   </View>
	   <View style={{flex:2,alignItems:'center'}}>
		   <TouchableOpacity onPress={()=>this.nowWeek()}>
					  <Text style={{textAlign:'center',fontWeight:'bold'}}>本周计划</Text>					  
					   <Text>{this.state.weekParm}至{this.state.endDate}</Text>
					   </TouchableOpacity>						
					  </View>
					  <View style={{flex:1,alignItems:'flex-end'}}>
						   <TouchableOpacity onPress={()=>this.nextWeek()}>
					    <Text >下一周</Text>		  
						</TouchableOpacity>
                         </View>    
                    </View>
					<ListView 
					    enableEmptySections = {true} 
						renderFooter = {this.renderFooter.bind(this)}
						pageSize = {this.state.count}
						initialListSize = {this.state.count}
						dataSource = {this.dataSource.cloneWithRows(this.state.jobOrders)}
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
         this.setState({
			 name:this.searchName,
		 });
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

