import React, { Component } from 'react';
import {
  ToolbarAndroid,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity
} from 'react-native';
import Styles from '../styleSheet/Styles'
export default class LoginButton extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPressCallback} style={Styles.loginTextView}>
        <Text style={Styles.loginText} >
          {this.props.name}
        </Text>
      </TouchableOpacity>
    );
  }
}
