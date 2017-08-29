import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Styles from '../styleSheet/Styles'
import Icon from 'react-native-vector-icons/FontAwesome';//字体图标
export default class TopBar extends Component {
  static defaultProps = {
    showRightMenu: false,
    name: '查看详情',
  };
  static propTypes = {
    showRightMenu: React.PropTypes.bool,
    dropDown: React.PropTypes.func
  };
  constructor(props) {
    super(props);
    this.state = {
      text: '',

    };

  }

  render() {
    return (
      <View style={Styles.navOutViewStyle}>
        <Text style={Styles.topBarText}>{this.props.name}</Text>
        <TouchableOpacity onPress={this.props.onBackUp} style={Styles.rightViewStyle}>
          <Icon name="chevron-left" size={24} color="#ffffff"></Icon>
        </TouchableOpacity>
        {
          this.props.showRightMenu == false ? <Text></Text> :
            <TouchableOpacity onPress={this.props.dropDown} style={Styles.leftViewStyle}>
              <Icon name={this.props.icon} size={30} color="#ffffff"></Icon>
            </TouchableOpacity>
        }
      </View>
    )
  }
}
