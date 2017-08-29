import React, { Component } from 'react';
import {
  TextInput,
} from 'react-native';
import Styles from '../styleSheet/Styles';
export default class EditView extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }
  render() {
    return (
      <TextInput style={Styles.TextInput}
        numberOfLines={1}
        underlineColorAndroid={'transparent'}
        textAlign='left'

        placeholder={this.props.name}
        defaultValue={this.props.defaultValue}
        onChangeText={
          (text) => {
            this.setState({ text });
            this.props.onChangeText(text);
          }
        }
      />
    );
  }
}


