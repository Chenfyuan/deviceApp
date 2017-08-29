/**
 * 点检录音模块
 * linweijian
 */
 'use strict';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Sound from 'react-native-sound';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import { toastLong} from '../util/ToastUtil';
import Icon from 'react-native-vector-icons/FontAwesome';//字体图标
var files='';
class AudioExampleCheck extends Component {
  static defaultProps={
    fileFlag:0
  }
  static propTypes={
    fileFlag:React.PropTypes.number,
    callBackFun:React.PropTypes.func
  }
    state = {
      currentTime: 0.0,
      recording: false,
      stoppedRecording: false,
      finished: false,
      filepath:'',
      audioPath:'',
      hasPermission: undefined,
    };
constructor(props){
        super(props);
        let path=Platform.OS=='ios'?AudioUtils. DocumentDirectoryPath:AudioUtils.DownloadsDirectoryPath;
        this.state = {
             audioPath: `${path}/recoder_${this.props.fileFlag}.aac`,
        };
    }
    prepareRecordingPath(audioPath){
      AudioRecorder.prepareRecordingAtPath(audioPath, {
        SampleRate: 22050,
        Channels: 1,
        AudioQuality: "Low",
        AudioEncoding: "aac",
        AudioEncodingBitRate: 32000
      });
    }
    componentDidMount() {
      this._checkPermission().then((hasPermission) => {
        this.setState({ hasPermission });
        if (!hasPermission) return;
        //this.prepareRecordingPath(this.state.audioPath);
     /* AudioRecorder.onProgress = (data) => {
         this.setState({currentTime: Math.floor(data.currentTime)});
       };*/
    
      });
    }

    _checkPermission() {
      if (Platform.OS !== 'android') {
        return Promise.resolve(true);
      }

      const rationale = {
        'title': '麦克风权限',
        'message': '设备管理系统需要麦克风权限.'
      };

      return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
        .then((result) => {
          console.log('Permission result:', result);
          return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
        });
    }

    _renderButton(title, onPress, active) {
      var style = (active) ? styles.activeButtonText : styles.buttonText;

      return (
        <TouchableHighlight style={styles.button} onPress={onPress}>
          <Text style={style}>
            {title}
          </Text>
        </TouchableHighlight>
      );
    }
//暂停
    /*async _pause() {
      if (!this.state.recording) {
  toastLong("还没有录制声音")
        return;
      }
      this.setState({stoppedRecording: true, recording: false});
      try {
        const filePath = await AudioRecorder.pauseRecording();

        if (Platform.OS === 'android') {
          this._finishRecording(true, filePath);
        }
      } catch (error) {
        console.error(error);
      }
    }*/
    async _stop() {
      if (!this.state.recording) {
        toastLong("还没有录制声音")
        return;
      }

      this.setState({stoppedRecording: true, recording: false});

      try {
        const filePath = await AudioRecorder.stopRecording();
      let files=filePath;
       if(Platform.OS==='ios')
       {
           AudioRecorder.onFinished = (data) => {
         //Android callback comes in the form of a promise instead.
           this._finishRecording(data.status === "OK", data.audioFileURL);
           let file_ios=data.audioFileURL;
            files=file_ios.replace("file:///","/");
         
       };
       }
      this.props.callBackFun(files,this.props.fileFlag)
        if (Platform.OS === 'android') {
          this._finishRecording(true, filePath);
        }
        return filePath;
      } catch (error) {
        console.error(error);
      }
    }

    async _play() {
      if (this.state.recording) {
        await this._stop();
      }
      setTimeout(() => {
        var sound = new Sound(this.state.audioPath, '', (error) => {
          if (error) {
            toastLong("无法读取音频文件")
          }
        });
        setTimeout(() => {
          sound.play((success) => {
            if (success) {
              console.log('播放完成');
            } else {
              console.log('playback failed due to audio decoding errors');
            }
          });
        }, 100);
      }, 100);
    }

    async _record() {
      if (this.state.recording) {
        toastLong('已经开始录音了!');
        return;
      }

      if (!this.state.hasPermission) {
        toastLong('没有权限！');
        return;
      }
      if(this.state.stoppedRecording){
        this.prepareRecordingPath(this.state.audioPath);
      }
        this.prepareRecordingPath(this.state.audioPath);
        AudioRecorder.onProgress = (data) => {
            this.setState(
                {
                    currentTime: Math.floor(data.currentTime),
                    recording: true
                });
        };
      try {
        const filePath = await AudioRecorder.startRecording();
      } catch (error) {
        console.error(error);
      }
    }


    _finishRecording(didSucceed, filePath) {
      this.setState({ finished: didSucceed,filepath:filePath });
      if(Platform.OS=='ios')
      {

      }
      console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath}`);
    }

    render() {
      return (
        <View style={styles.container}>
          <View style={{flex:1,alignItems:'center'}}><Icon name={'microphone'} size={20} ></Icon></View>
          <View style={styles.controls}>
            {this._renderButton("开始", () => {this._record()}, this.state.recording )}
               {this._renderButton("完成", () => {this._stop()} )}
            {
              this.state.stoppedRecording==true?
              this._renderButton("播放", () => {this._play()} )
              :<View></View>
              }
          </View>
         <View style={{flex:1,alignItems:'center'}}><Text style={styles.progressText}>{this.state.currentTime}</Text></View>
         <View style={{flex:1,alignItems:'center'}}><Text style={{fontSize:13}}>{this.state.filepath}</Text></View>
        </View>
      );
    }
  }

  var styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#dddddd",
    },
    controls: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      flexDirection:'row'
    },
    progressText: {
      paddingTop:2,
      fontSize: 25,
      //color: "#fff"
    },
    button: {
      padding: 5
    },
    disabledButtonText: {
      color: '#eee'
    },
    buttonText: {
      fontSize: 20,
      //color: "#fff"
    },
    activeButtonText: {
      fontSize: 20,
      color: "#B81F00"
    }

  });

export default AudioExampleCheck;
