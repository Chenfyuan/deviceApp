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
import Styles from '../styleSheet/Styles';
export default class PassEditView extends Component {
  constructor(props) {
   super(props);
   this.state = {text: ''};
 }

  render() {
    return (
      
       <TextInput style={Styles.TextInput}
         numberOfLines={1}
         underlineColorAndroid={'transparent'}
         textAlign='left'
         placeholder={this.props.name}
         secureTextEntry={true}
         defaultValue={this.props.defaultValue}
         onChangeText={
           (text) => {
             this.setState({text});
             this.props.onChangeText(text);
           }
        }
       />
    );
  }
}

