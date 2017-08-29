import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Platform,

} from 'react-native';
var Dimensions = require('Dimensions');
const {width,height}=Dimensions.get('window');
import ImagePicker from 'react-native-image-picker';
var options = {
  title: '请选择',
  cancelButtonTitle: '取消',
  takePhotoButtonTitle: '拍照',
  chooseFromLibraryButtonTitle: '相册',
  cameraType: 'back',//启用后面的相机{'front' or 'back'}
  mediaType: 'photo',//媒体类型是照片
  maxWidth: 400,
  maxHeight: 400,
  aspectX: 2,
  aspectY: 1,
  quality: 0.9,
  angle: 0,
  allowsEditing: false,
  noData: false,
  storageOptions: {
      skipBackup: true,
    path: 'images'
  }
}
export default class ImageSelect extends Component {
static defaultProps={
    id:0,
};
 static propTypes={
     OnCallBack:React.PropTypes.func,
     id:React.PropTypes.number
  };
   constructor(props){
        super(props);
        this.state = {
          images:require('../../images/camera.png'),
          isTrue:false
        };
    }
    
//选择照片
chooseImage(id)
{
    let result='ok';
     ImagePicker.showImagePicker(options, (response) => {
        console.log('Response = ', response);
        if (response.didCancel) {
        console.log('用户取消选择');
        }
        else if (response.error) {
          console.log('错误: ', response.error);
        }
        else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        }
        else {
          let source;
          if (Platform.OS === 'android') {
            source = { uri: response.uri, isStatic: true }
          } else {
            source = { uri: response.uri.replace('file://', ''), isStatic: true }
          }
          // You can also display the image using data:
          // let source = { uri: 'data:image/jpeg;base64,' + response.data };
          this.setState({
            images: source,
            isTrue: true
          });
        
        this.props.OnCallBack(source,result,id);
        }
      });
}

  render() {
    return (    
        <TouchableOpacity onPress={this.chooseImage.bind(this,this.props.id)} activeOpacity={0.6}>  
 <View style={{borderStyle:'dotted',borderWidth:1,width:(width/4)-10,height:(width/4)-10,marginLeft:5,marginTop:5,alignItems:'center',justifyContent:'center',backgroundColor:'#ccc'}}>
 <Image source={this.state.images} style={{width:(width/4)-12,height:(width/4)-12}} />
 </View>
</TouchableOpacity>

    );
  }
}


