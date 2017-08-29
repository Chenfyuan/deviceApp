'use strict';
import { StyleSheet, PixelRatio, } from "react-native";
var Dimensions = require('Dimensions');
const screenW = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
let Styles = StyleSheet.create({
  /***************登录样式 **************************/
  loginText: {
    color: '#ffffff',
    fontWeight: 'bold',
    //width:30,
  },
  loginTextView: {
    marginTop: 10,
    height: 50,
    backgroundColor: '#2881B9',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /******************************************************** */
  /***************EditView样式********************************/
  TextInput: {
    backgroundColor: '#ffffff',
    height: 48,
    width: 500,
    fontSize: 16,

  },

  /*********************************************** */

  /*****************************顶部栏**************** */
  // 导航条视图
  navOutViewStyle: {
    height: height / 12,
    backgroundColor: '#2881B9',
    // 主轴方向

    flexDirection: 'row',
    // 侧轴对齐方式 垂直居中
    alignItems: 'center',
    // 主轴方向居中
    justifyContent: 'center',
  },
  // 导航栏右侧
  rightViewStyle: {
    // 绝对定位
    position: 'absolute',
    left: 8,
    bottom: 8,
  },
  leftViewStyle: {
    // 绝对定位
    position: 'absolute',
    right: 8,
    bottom: 8,
  },
  // 导航条上图片
  navImgStyle: {
    width: 30,
    height: 30,
  },
  topBarText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold'
  },
  /***************故障报修页面****************************** */
  containerHome: {
    backgroundColor: '#eeeeee',
    flex: 1,
  },
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  rowItem: {
    height: 36,
    //borderColor:'#eee',
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginLeft: 4,
    marginRight: 4,
    marginTop: 1,
    marginBottom: 1,
  },
  rowItemImage: {
    //行
    flex: 4,
    flexDirection: 'row',
    marginLeft: 4,
    marginRight: 4,
    marginTop: 1,
    marginBottom: 1,
  },
  columnItem: {
    //列
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderColor: '#ccc',
    borderWidth: 1,

  },
  secondColumnItem:
  {
    flex: 6,
    //borderColor:'#cccddd',
    // borderWidth:1,

    justifyContent: 'center'
  },
  imageItem:
  {
    flex: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    borderColor: '#ccc',
    //borderWidth:1

  },
  inputStyle:
  {
    paddingTop: 6,
    paddingLeft: 8,
    // borderWidth: 1,
    //borderColor:'red',
    height: 40,
    // borderColor:'transparent'

  },
  uploadAvatar: {
    height: 40 * PixelRatio.get(),
    width: 40 * PixelRatio.get(),
  },
  container1: {
    flex: 1,
    borderRadius: 360
  },
  controls: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  progressText: {
    paddingTop: 5,
    fontSize: 50,
    color: "#fff"
  },
  button: {
    padding: 5
  },
  disabledButtonText: {
    color: '#eee'
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",

  },
  activeButtonText: {
    fontSize: 20,
    color: "#B81F00",

  },

  /**********************************************列表********** */
  msgContainer: {
    backgroundColor: '#F6F6F6',
    flex: 1,
  },

  searchView: {
    marginTop: 10
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    marginTop: 10,
    flexDirection: 'row',
    borderWidth: 1,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10,
    //orderRadius: 5,
    borderColor: '#ccc',
    paddingBottom: 6,
    paddingTop: 6,

  },
  items: {
    marginTop: 4,
    borderWidth: 1,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    marginLeft: 6,
    marginRight: 6,

    borderColor: '#ccc',



  },
  itemRow:
  {

    flexDirection: 'row',
    flex: 1,
    marginBottom: 2,

  },
  image: {
    width: 99,
    height: 138,
    margin: 6,
  },
  itemText: {
    fontSize: 15,
    fontFamily: 'Helvetica Neue',
    fontWeight: '300',
    color: 'rgba(0,0,0,0.8)',
    lineHeight: 26,
  },
  itemContent: {
    flex: 1,
    marginLeft: 15,
    marginRight: 10,
    marginTop: 5,
  },
  itemHeader: {
    fontSize: 18,
    fontFamily: 'Helvetica Neue',
    fontWeight: '300',
    color: '#19a9ff',

  },
  itemMeta: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.6)',
    marginTop: 6
  },
  redText: {
    color: '#db2828',
    fontSize: 15,
  },
  footerLoading: {
    marginVertical: 20,
    paddingBottom: 50,
    alignSelf: 'center',
  },
  footerLoadingTxt: {
    color: 'rgba(0,0,0,0.3)'
  },
  detailSumTxt: {
    marginBottom: 5,
    color: 'rgba(0,0,0,0.6)',
  },
  detailTit: {
    color: '#888',
    paddingLeft: 5,
    fontSize: 16,
    fontFamily: 'Helvetica Neue',
    fontWeight: '300',
    lineHeight: 32,
  },
  searchIptBox: {
    padding: 7,
    paddingBottom: 0,
    borderColor: 'rgba(100, 53, 201, 0.1)',
    borderBottomWidth: 1,
  },
  searchLoadingIco: {
    position: 'absolute',
    right: 10,
    top: 20,
  },
  searchHeader: {
    color: 'rgba(0,0,0,0.8)',
    fontSize: 18,
    marginTop: 30,
    marginLeft: 10,
  },
  deleteIcon: {
    width: 20,
    height: 20,
    margin: 10,
    opacity: 0.6,
  },
  flexDirection: {
    flexDirection: 'row',
    marginTop: 5
  },
  inputHeight: {
    height: 45,
  },
  flex: {
    flex: 1,
  },
  inputs: {
    height: 45,
    borderWidth: 1,
    marginLeft: 5,
    paddingLeft: 5,
    borderRightWidth: 0,
    borderColor: '#CCCCCC',
    //borderRadius: 4,
    backgroundColor: '#ffffff'
  },
  btn: {
    width: 55,
    marginLeft: -5,
    marginRight: 5,
    // backgroundColor: '#23bfff',
    height: 45,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,

    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: 4,

  },

  search: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  week: {
    width: (screenW / 8) - 2,
    height: 40,
    textAlign: 'center',
    fontSize: 14,
    paddingTop: 10,
    marginLeft: 8,
    marginTop: 8,
    borderColor: '#dddddd',
    borderWidth: 1,
    marginBottom: 4,
  },
  weekClick: {
    backgroundColor: '#3181E1',
    color: '#ffffff',
    width: (screenW / 8) - 2,
    height: 40,
    textAlign: 'center',
    fontSize: 14,
    paddingTop: 10,
    marginLeft: 8,
    marginTop: 8,
    marginBottom: 4,
    borderColor: '#dddddd',
    borderWidth: 1,
  },
  /*****************************************************主界面********************** */
  menuView: {
    marginTop: 6,
    flex: 6,
    // flexDirection: 'row',
    //flexWrap:'wrap',
    backgroundColor: '#ffffff'
  },
  itemView: {
    marginLeft: 35,
  },
  textStyle: {
    marginTop: 5,
    alignSelf: 'center',
    fontSize: 15,
    color: '#555555',
    textAlign: 'center'
  },
  imageStyle: {
    alignSelf: 'center',
    width: 80,
    height: 80
  },

  homebar: {
    flex: 1,
    backgroundColor: '#e8e8e8',
  },
  taskView: {
    flexDirection: 'row',
    height: height / 18,
    marginTop: 8,
    backgroundColor: '#ffffff'
  },
  taskView1: {
    flexDirection: 'row',
    // marginLeft:30,
    // marginRight:20,
    // marginBottom:10,
    // 侧轴对齐方式 垂直居中
    //flex:1,
    height: height / 18,
    backgroundColor: '#ffffff',
  },
  taskText: {
    fontSize: 20,
    color: 'red'
  },
  taskTiText: {
    fontSize: 20,
    color: '#000000',
    fontWeight: '700',
  },
  taskNumText: {
    fontSize: 16,
    color: 'gray',
  },
  taskNumView: {
    //width:95,
    // height:80,
    // 侧轴对齐方式 垂直居中
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // 主轴方向居中
    // backgroundColor:'green',
    justifyContent: 'center',
    // borderWidth: 1,
    borderColor: '#CCCCCC',
    //height:50,
    //borderBottomWidth:1,
    borderLeftWidth: 1
  },
  outTimeText: {
    fontSize: 12,
    color: '#FF0000',
  },
  listViewStyle: {
    // 主轴方向
    flexDirection: 'row',
    // 一行显示不下,换一行
    flexWrap: 'wrap',
    //margin:1,
    // 侧轴方向
    //justifyContent:'center',
    alignItems: 'center', // 必须设置,否则换行不起作用
  },

  innerViewStyle: {
    width: (screenW / 3),
    height: (screenW / 3),
    margin: 8,
    // 文字内容居中对齐
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderLeftWidth: 1,
    borderColor: 'blue',
    borderRadius: 10,
    alignItems: 'center'
  },

  iconStyle: {
    marginTop: screenW / 15,
    width: screenW / 10,
    height: screenW / 10,
    // borderWidth:1,
    // borderRadius:10,
  },
  dropdown_6: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdown_6_image: {
    width: 30,
    height: 30,
  },
  dropdown_2_dropdown: {
    width: 150,
    //height: 150,
    height: 120,
    marginTop: 7,
  },
  dropdown_3_dropdown: {
    width: 150,
    //height: 150,
    height: 160,
    marginTop: 7,
  },
  dropdown_2_text: {
    // marginVertical: 10,
    // marginHorizontal: 6,
    fontSize: 30,
    margin: 12,
    textAlign: 'center',
    // textAlignVertical: 'center',

  },
  dropdown_2_row: {
    flexDirection: 'row',
    height: 40,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  dropdown_2_row_text: {
    marginHorizontal: 4,
    fontSize: 16,
    margin: 12,
    textAlign: 'center'
    //textAlignVertical: 'center',
  },
  /***************************QRCODE********************************* */
  toolbar: {
    height: 48,
    backgroundColor: '#2881B9',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  toolbarTitle: {
    color: '#fff',
    fontSize: 20,
    margin: 18,
  },
  preview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1
  },
  modal: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  shade: {
    flex: 1,
    //backgroundColor: 'rgba(1, 1, 1, 0.65)',
    backgroundColor: 'rgba(2, 2, 2, 0.65)',
  },
  content: {
    alignItems: 'center',
    //padding: 20,
  },
  qrcode: {
    width: 220,
    height: 220,
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'red',

  },
  text: {
    color: '#cccccc',
    fontSize: 15,
  },
  line: {
    width: 200,
    height: 1,
    backgroundColor: 'rgba(30, 255, 145, 1)',
  },
  /********************************************************************/
  container2: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loading1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerContainer: {
    height: height,
    paddingTop: 20,
  },
  // modal的样式  
  modalStyle: {
    // backgroundColor:'#ccc',  
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  // modal上子View的样式  
  subView: {
    marginLeft: 60,
    marginRight: 60,
    backgroundColor: '#fff',
    alignSelf: 'stretch',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#ccc',
  },
  // 标题  
  titleText: {
    marginTop: 10,
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // 内容  
  contentText: {
    margin: 8,
    fontSize: 14,
    height: 400,
    width: 400,
    textAlign: 'center',
  },
  // 水平的分割线  
  horizontalLine: {
    marginTop: 5,
    height: 0.5,
    backgroundColor: '#ccc',
  },
  // 按钮  
  buttonView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonStyle: {
    flex: 1,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 竖直的分割线  
  verticalLine: {
    width: 1,
    height: 44,
    backgroundColor: '#ccc',
  },
  row: {
    // borderRightWidth:1,
    flex: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
module.exports = Styles;