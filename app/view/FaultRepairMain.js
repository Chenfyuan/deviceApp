'use strict';
import React, {Component} from 'react';
import styles from '../styleSheet/Styles';
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Picker,
    DatePickerAndroid,
    ScrollView,
    Platform,
    Modal,
    Alert,
    InteractionManager
} from 'react-native';
import ImageSelect from '../component/ImageSelect';
var Dimensions = require('Dimensions');
const {width,height}= Dimensions.get('window');
import {HOST} from '../constantsUrl/Urls';
import TopBar from '../component/TopBar';
import {toastLong} from '../util/ToastUtil';
import ImagePicker from 'react-native-image-picker';
import AudioExample from '../util/AudioExample';
import NetUitl from '../util/NetUtil';
import {EQUIPMENT_PART_URL} from '../constantsUrl/Urls';
import WebViewExample from '../view/WebViewExample';
import LoginButton from '../component/LoginButton';
import Loading from '../component/Loading';
import Icon from 'react-native-vector-icons/FontAwesome';//字体图标
var imageMap = new Map;
var options = {
    //底部弹出框选项
    title: '请选择',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '选择相册',
    cameraType: 'back',
    mediaType: 'photo',
    videoQuality: 'high',
    durationLimit: 10,
    maxWidth: 600,
    maxHeight: 600,
    aspectX: 2,
    aspectY: 1,
    quality: 0.8,
    angle: 0,
    allowsEditing: false,
    noData: false,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
}
class FaultRepairMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            faultTime: '',
           // equipCode: '',//设备编号
            choosePart: '',
            faultPart: '',
            faultDesc: '',
            voice: '',//录音
            images: [],//照片
            picker: [],
            emerg_level: '',
            show: false,
            currentTime: 0.0,
            loading: false,
            type: 1,
            equipName: '无',
            deviceIdentityCode:'',//设备身份自编码
        }

    }

    componentDidMount() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
        var url = `${EQUIPMENT_PART_URL}?equipCode=${this.props.deviceIdentityCode}`
        InteractionManager.runAfterInteractions(() => {
            NetUitl.getDataAsync(url, (rs) => {
                var equipmentPart = rs.equipment;//设备部位
                var equip = rs.equipName;//设备名称
                var pickerItem = [];
                if (equipmentPart != null) {
                    for (var i = 0; i < equipmentPart.length; i++) {
                        pickerItem.push(<Picker.Item label={equipmentPart[i].name} value={equipmentPart[i].id}
                                                     key={equipmentPart[i].id}/>);
                    }
                }

                this.setState({
                    deviceIdentityCode:this.props.deviceIdentityCode,
                    equipCode: this.props.equipCode,
                    picker: pickerItem,
                    faultTime: currentdate,
                    type: this.props.type == null ? 1 : this.props.type,
                    choosePart: parseInt(this.props.partId),
                    equipName: equip,
                });
            });

        });
    }

    componentWillUnmount() {

        imageMap.clear();//清除images

    }
    renderImageBox()
    {
        let arr=[];
        for(var i=0;i<4;i++)
        {
            arr.push(<ImageSelect OnCallBack={this.callBack.bind(this,i)}  id={this.props.Id} key={i}/>)
        }
        return arr;

    }
    //图片
    callBack(i,sources,result,id){
        let imageurl = sources.uri;//获取图片路径
        let imageFile = {uri: imageurl, type: 'multipart/form-data', name: `image_${id}_${i}.jpg`};
        let arr = new Array(4);
        if (imageMap.get(id) == null) {  //如果map为空
            arr[i] = imageFile;
            imageMap.set(id, arr);
        } else {
            let picArr = imageMap.get(id);
            picArr[i] = imageFile;
            imageMap.set(id, picArr);
        }
    }

    //时间选择器
    async openDataPick() {
        if (Platform.OS == 'android') {
            try {
                const {action, year, month, day} = await DatePickerAndroid.open({
                    // 要设置默认值为今天的话，使用`new Date()`即可。
                    // 下面显示的会是2020年5月25日。月份是从0开始算的。
                    date: new Date()
                });
                if (action !== DatePickerAndroid.dismissedAction) {
                    // 这里开始可以处理用户选好的年月日三个参数：year, month (0-11), day
                    this.setState(
                        {
                            faultTime: `${year}-${month + 1}-${day}`,
                        }
                    )
                }
            } catch ({code, message}) {
                console.warn('Cannot open date picker', message);
            }
        }
    }

    _setModalVisible() {
        let isShow = this.state.show;
        this.setState({
            show: !isShow,
        });
    }

    //选择照片
    chooseImage() {
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source;
                if (Platform.OS === 'android') {
                    source = {uri: response.uri, isStatic: true}
                } else {
                    source = {uri: response.uri.replace('file://', ''), isStatic: true}
                }

                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                this.setState({
                    images: source,
                    isTrue: true
                });
                console.log(this.state.images);
            }
        });
    }

    //提交
    next() {

        /*if (this.state.equipCode == '') {
            toastLong("请输入单位自编号");
            return;
        }*/
        if (this.state.faultTime == '') {
            toastLong("请选择故障时间");
            return;
        }
        if (this.state.emerg_level == '' || this.state.emerg_level == 0) {
            toastLong("请选择严重程度");
            return;
        }
        if(this.state.faultDesc==''&&this.state.voice==''&&imageMap.size==0)
        {
            toastLong("文字描述||录音||照片必须满足一项！")
            return ;
        }
        this.setState({loading: true})
        //let imageurl = this.state.images.uri;//获取图片路径
        //let imageFile = {uri: imageurl, type: 'multipart/form-data', name: 'image.jpg'};
        let audiourl = `file://${this.state.voice}`;
        let audioFile = {uri: audiourl, type: 'multipart/form-data', name: 'recoder.aac'};
        if (Platform.OS == 'ios') {
            audioFile = {uri: this.state.voice, type: 'multipart/form-data', name: 'recoder.aac'};
        }
        var formData = new FormData();
        formData.append("taskName", "GZBX");
        formData.append("processId", "WXLC");
        formData.append("formId", "WXLC_GZBX");
        formData.append("data[deviceIdentityCode]",this.state.deviceIdentityCode);//设备身份自编号
        formData.append("data[type]", this.state.type);//点检还是例检报修
        //formData.append("data[equipCode]", this.state.equipCode);
        formData.append("data[choosePart]", this.state.choosePart);
        formData.append("data[faultPart]", this.state.faultPart);
        formData.append("data[emerg_level]", this.state.emerg_level);
        formData.append("data[faultTime]", this.state.faultTime);
        formData.append("flowButton", "Submit");
        if (this.state.voice != '') {
            formData.append("files[voice]", audioFile);
        }
        formData.append("data[faultDesc]", this.state.faultDesc);
        //报修上传多张图片
        imageMap.forEach((value, key, mapObj) => {
            let image = [];
            value.forEach((v, index) => {
                let index1=index+1;
                formData.append("images[image"+index1+"]", v);
            });
        })
        console.log(formData);
        fetch(`${HOST}jbpm/form/saveJson.do`, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((responseData) => {
                //导航到下一个页面
                console.log(responseData);
                this.setState({loading: false})
                let msg = responseData.msg;
                let url = responseData.url;
                if (msg == null && url != null) {
                    const {navigator} = this.props;
                    if (navigator) {
                        navigator.replace({
                            name: 'WebView',
                            component: WebViewExample,
                            params: {
                                url: HOST + url,
                                funcname: '故障报修'
                            }
                        });
                    }
                }
                else if (msg != null) {
                    this.setState({loading:false});
                    if(msg=='工单提交完成')
                    {
                        Alert.alert('提示',msg,
                        [
                            { text:'确定' ,onPress:() => this.goBack()},
                        ]
                        )
                    }
                    else {
                        toastLong(msg);
                    }
                }
                else {
                    this.setState({loading:false})
                    toastLong("提交失败，请联系管理员");
                }
            })
            .catch((error) => {
                console.log(error)
                this.setState({loading:false})
                 toastLong("提交失败，请联系管理员");

            });
    }

    render() {
        return (
            <View style={styles.msgContainer}>
                <TopBar name='故障报修' onBackUp={this.onBackUp}/>
                <ScrollView>
                    <View style={styles.rowItem}>
                        <View style={styles.columnItem}><Text>身份自编号</Text></View>
                        <View style={styles.secondColumnItem}>
                            <Text style={{paddingLeft:8}}>{this.state.deviceIdentityCode}</Text>
                        </View>
                    </View>
                   {/* <View style={styles.rowItem}>
                        <View style={styles.columnItem}><Text>单位自编号</Text></View>
                        <View style={styles.secondColumnItem}>
                            <TextInput placeholder="请输入单位自编号"
                                       editable={false}
                                       underlineColorAndroid={'transparent'}
                                       defaultValue={this.state.equipCode}
                                       onChangeText={(text) => {
                                           this.setState({
                                               equipCode: text,
                                           })
                                       }}
                                       onEndEditing={
                                           (text) => {
                                               var url = `${EQUIPMENT_PART_URL}?equipCode=${text.nativeEvent.text}`
                                               NetUitl.getDataAsync(url, (rs) => {
                                                   var equipmentPart = rs.equipment;

                                                   var pickerItem = [];
                                                   if (equipmentPart != null) {
                                                       for (var i = 0; i < equipmentPart.length; i++) {
                                                           pickerItem.push(<Picker.Item label={equipmentPart[i].name}
                                                                                        value={equipmentPart[i].id}
                                                                                        key={equipmentPart[i].id}/>);
                                                       }
                                                   }

                                                   this.setState({
                                                       picker: pickerItem,

                                                   });
                                               });
                                           }
                                       }
                                       style={styles.inputStyle}>
                            </TextInput>
                        </View>
    </View>*/}
                    <View style={styles.rowItem}>
                        <View style={styles.columnItem}><Text>设备部位</Text></View>
                        <View style={styles.secondColumnItem}>
                            <Picker style={styles.secondColumnItem}
                                    selectedValue={this.state.choosePart}
                                    mode={'dropdown'}
                                    onValueChange={(value) => this.setState({choosePart: value})}
                            >
                                {this.state.picker}
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.rowItem}>
                        <View style={styles.columnItem}><Text>设备名称</Text></View>
                        <View style={styles.secondColumnItem}>
                            <Text style={{paddingLeft:8}}>{this.state.equipName}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => this.openDataPick()}>
                        <View style={styles.rowItem}>

                            <View style={styles.columnItem}><Text>故障发现时间</Text></View>

                            <View style={styles.secondColumnItem}>
                                <Text style={{paddingLeft:8}}>{this.state.faultTime}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.rowItem}>
                        <View style={styles.columnItem}><Text>严重程度</Text></View>
                        <View style={styles.secondColumnItem}>
                            <Picker style={styles.secondColumnItem}
                                    mode={'dropdown'}
                                    selectedValue={this.state.emerg_level}
                                    onValueChange={(lang) => this.setState({emerg_level: lang})}
                            >
                                <Picker.Item label="请选择" value="0"/>
                                <Picker.Item label="紧急" value="3"/>
                                <Picker.Item label="一般" value="1"/>
                                <Picker.Item label="严重" value="2"/>
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.rowItem}>
                        <View style={styles.columnItem}><Text>录音</Text></View>
                        <View style={styles.imageItem}>
                            <View style={{
                                flex: 4,
                                alignItems: 'flex-start',
                                justifyContent: 'center'
                            }}><Text style={{paddingLeft:8}}>{this.state.voice}</Text></View>
                            <TouchableOpacity onPress={() => this._setModalVisible()}>
                                <View style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#dddddd',
                                    width: 40
                                }}>
                                    <Icon name="microphone" size={30} ></Icon>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.rowItem}>
                        <View style={styles.columnItem}><Text>文字描述</Text></View>
                        <View style={styles.secondColumnItem}>
                            <TextInput placeholder="请输入文字描述"
                                       onChangeText={(text) => {
                                           this.setState({
                                               faultDesc: text,
                                           })
                                       }}
                                       style={styles.inputStyle}>
                            </TextInput>
                        </View>
                    </View>
                    <View style={styles.rowItemImage}>
                        <View style={styles.columnItem}><Text>照片</Text></View>
                        <View style={styles.imageItem}>
                            <View style={{height:height/7,borderTopColor:'#ccc',borderTopWidth:1,flex:1}}>
                                <View style={{flexDirection:'row',flex:1}}>
                                    <ScrollView horizontal={true}>
                                        {this.renderImageBox()}
                                    </ScrollView>
                                </View>
                            </View>

                        </View>
                    </View>
                    <View style={[styles.rowItem, {height: 60}]}>
                        <View style={{flex: 2}}>
                            <LoginButton name='提交' onPressCallback={() => this.next()}/>
                        </View>
                        <Loading loading={this.state.loading}  onBack={()=>{this.setState({loading:false})}}/>
                    </View>
                </ScrollView>
                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={this.state.show}
                    onShow={() => {
                    }}
                    onRequestClose={() => {
                    }}>
                    <View style={{
                        flex: 1,
                        marginLeft: width/4,
                        marginRight: width/4,
                        marginBottom: (height/3)-30,
                        marginTop: (height/3)-30,
                        backgroundColor: '#2881B9',
                        borderBottomWidth:1,
                        borderRadius:10
                    }}>
                        <AudioExample
                            callBack={(checked, filePath) => (this.setState({show: checked, voice: filePath}))}
                            fileFlag={this.state.deviceIdentityCode}/>
                    </View>
                </Modal>

            </View>
        );
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
module.exports = FaultRepairMain;