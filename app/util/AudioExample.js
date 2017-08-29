import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Platform,
  PermissionsAndroid,
  TouchableOpacity
} from 'react-native';

import Sound from 'react-native-sound';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import { toastLong} from '../util/ToastUtil';
var files='';
class AudioExample extends Component {
  static defaultProps={
    fileFlag:'01'
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

        this.prepareRecordingPath(this.state.audioPath);

        AudioRecorder.onProgress = (data) => {
          this.setState({currentTime: Math.floor(data.currentTime)});
        };

        ////AudioRecorder.onFinished = (data) => {
          // Android callback comes in the form of a promise instead.
         // if (Platform.OS === 'ios') {
          //  this._finishRecording(data.status === "OK", data.audioFileURL);
         // }
        //};
      });
    }

    _checkPermission() {
      if (Platform.OS !== 'android') {
        return Promise.resolve(true);
      }

      const rationale = {
        'title': 'Microphone Permission',
        'message': 'AudioExample needs access to your microphone so you can record audio.'
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

    async _pause() {
      if (!this.state.recording) {
  toastLong("还没有录制声音")
        return;
      }

      this.setState({stoppedRecording: true, recording: false});

      try {
        const filePath = await AudioRecorder.pauseRecording();

        // Pause is currently equivalent to stop on Android.
        if (Platform.OS === 'android') {
          this._finishRecording(true, filePath);
        }
      } catch (error) {
        console.error(error);
      }
    }
    async _stop() {
      if (!this.state.recording) {
        toastLong("还没有录制声音")
        return;
      }

      this.setState({stoppedRecording: true, recording: false});

      try {
        const filePath = await AudioRecorder.stopRecording();
        files=filePath;
              if(Platform.OS==='ios')
       {
           AudioRecorder.onFinished = (data) => {
         //Android callback comes in the form of a promise instead.
           this._finishRecording(data.status === "OK", data.audioFileURL);
           let file_ios=data.audioFileURL;
            files=file_ios.replace("file:///","/");
       };
       }
        if (Platform.OS === 'android') {
          this._finishRecording(true, filePath);
        }
       // console.warn(filePath);
    // Alert.alert('提示','文件保存在Download目录中');
        return filePath;
      } catch (error) {
        console.error(error);
      }
    }

    async _play() {
      if (this.state.recording) {
        await this._stop();
      }

      // These timeouts are a hacky workaround for some issues with react-native-sound.
      // See https://github.com/zmxv/react-native-sound/issues/89.
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

      this.setState({recording: true});

      try {
        const filePath = await AudioRecorder.startRecording();
      } catch (error) {
        console.error(error);
      }
    }

_close()
{
 if(this.state.recording==true){toastLong("请完成录音再关闭！");return }
this.props.callBack(false,files);
}
    _finishRecording(didSucceed, filePath) {
      this.setState({ finished: didSucceed,filepath:filePath });
      console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath}`);
    }

    render() {
      return (
        <View style={styles.container}>
          <View style={styles.controls}>
            {this._renderButton("开始", () => {this._record()}, this.state.recording )}
               {this._renderButton("完成", () => {this._stop()} )}
            {
              this.state.stoppedRecording==true?
              this._renderButton("播放", () => {this._play()} )
              :<View></View>
              }
            {/*this._renderButton("暂停", () => {this._pause()} )*/}
            <Text style={styles.progressText}>{this.state.currentTime}s</Text>
           
          </View>
             <View style={{ height:60, alignItems: 'center', justifyContent: 'center', borderTopWidth: 2, borderColor: '#ccc',backgroundColor:'red',borderBottomLeftRadius:10,borderBottomRightRadius:10}}>
                <TouchableOpacity onPress={()=>this._close()}>
                <Text style={{ color: 'white', fontSize: 20 }}>保存并关闭</Text>
              </TouchableOpacity>
            </View>
        </View>
      );
    }
  }

  var styles = StyleSheet.create({
    container: {
      flex: 1,
      //backgroundColor: "#2b608a",
     borderRadius:20
    },
    controls: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    progressText: {
      paddingTop:5,
      fontSize: 30,
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
      color: "#fff"
    },
    activeButtonText: {
      fontSize: 20,
      color: "#B81F00"
    }

  });

export default AudioExample;
