import React, { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import CheckBox from '../component/checkbox';
import Styles from '../styleSheet/Styles'
var Dimensions = require('Dimensions');
import AudioExampleCheck from '../util/AudioExampleCheck'
const { height, width } = Dimensions.get('window');
import ImageSelect from './ImageSelect';
export default class ListItem extends Component {
    static defaultProps = {
        Name: '无',
        Criteria: '无',
        CheckMethod: '无',
        TypeName: '无',
        PartName: '无',
        checked: true,
        Measure: '无',
    };
    static propTypes = {
        Name: React.PropTypes.string,
        CheckMethod: React.PropTypes.string,
        Criteria: React.PropTypes.string,
        Measure: React.PropTypes.string,
        PartName: React.PropTypes.string,
        TypeName: React.PropTypes.string,
        onBackUpFunc: React.PropTypes.func,
        onTakePhoto: React.PropTypes.func,
        onImageFun: React.PropTypes.func,
        onAudio: React.PropTypes.func,
        checked: React.PropTypes.bool
    };
    constructor(props) {
        super(props);
        this.state = {
            checked: props.checked,
            isTake: false,
            isTrue: false
        };
    }

    renderImageBox() {
        let arr = [];
        for (var i = 0; i < 4; i++) {
            arr.push(<ImageSelect OnCallBack={this.callBack.bind(this, i)} id={this.props.Id} key={i} />)
        }
        return arr;

    }
    onCheck(id, checked) {
        this.setState({
            checked,
        })
        this.props.onBackUpFunc(checked, id);
    }
    //图片
    callBack(i, sources, result, id) {
        this.props.onImageFun(sources, result, id, i);
    }

    //音频
    onAudioPathFunc(res, id) {
        this.props.onAudio(res, id);

    }
    takePhoto(id) {
        this.setState({ isTake: !this.state.isTake })
        this.props.onTakePhoto(this.state.isTake, id);
    }
    render() {

        return (
            <View style={{ marginBottom: 4, borderColor: '#aaa', borderWidth: 1, backgroundColor: '#ffffff' }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <ScrollView horizontal={true} style={{ width: width - 80 }}>
                        <View style={{ alignItems: 'flex-start', marginLeft: 2, borderRightWidth: 1, borderRightColor: '#ccc' }}>
                            <View style={{ margin: 1, flexDirection: 'row' }}><Text>检查内容：</Text><Text style={{ paddingLeft: 10 }}>{this.props.Name}</Text></View>
                            <View style={{ margin: 1, flexDirection: 'row' }}><Text>评判标准：</Text><Text style={{ paddingLeft: 10 }}>{this.props.Criteria}</Text></View>
                            <View style={{ margin: 1, flexDirection: 'row' }}><Text>处理措施：</Text><Text style={{ paddingLeft: 10 }}>{this.props.Measure}</Text></View>
                            <View style={{ margin: 1, flexDirection: 'row' }}><Text>检查方法：</Text><Text style={{ paddingLeft: 10 }}>{this.props.CheckMethod}</Text></View>
                            {/*<View style={{margin:3,flexDirection:'row'}}><Text>部位名称：</Text><Text style={{paddingLeft:10}}>{this.props.PartName==null?'无':this.props.PartName}</Text></View>
        <View style={{margin:3,flexDirection:'row'}}><Text>类型名称：</Text><Text style={{paddingLeft:10}}>{this.props.TypeName==null?'无':this.props.TypeName}</Text></View>    */}
                        </View>
                    </ScrollView>
                    <View style={{ alignItems: 'center', width: 80, justifyContent: 'center', backgroundColor: '#dddddd', }}>
                        <CheckBox style={{ marginLeft: 10 }}
                            label="完好"
                            checked={this.state.checked}
                            value={this.props.Id}
                            onChange={this.onCheck.bind(this, this.props.Id)} />
                        <View style={{ width: 80 }}>
                            <TouchableOpacity onPress={this.takePhoto.bind(this, this.props.Id)} style={{
                                marginTop: 10,
                                height: 44,
                                backgroundColor: '#2881B9',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <Text style={Styles.loginText} >
                                    拍照
           </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {
                    this.state.isTake == true ?
                        <View style={{ height: height / 7, borderTopColor: '#ccc', borderTopWidth: 1, flex: 1 }}>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <ScrollView horizontal={true}>
                                    {this.renderImageBox()}
                                </ScrollView>
                            </View>
                        </View> : <View></View>
                }
                {
                    this.state.checked == false ?
                        <View style={{ height: height / 7, borderTopColor: '#ccc', borderTopWidth: 1, flex: 1 }}>
                            <View style={{ flex: 1, borderTopWidth: 1, flexDirection: 'row', borderTopColor: '#ccc' }}>
                                <View style={{ flex: 1 }}><AudioExampleCheck fileFlag={this.props.Id} callBackFun={this.onAudioPathFunc.bind(this)} /></View>
                            </View>
                        </View> : <View></View>
                }
            </View>

        );
    }
}


