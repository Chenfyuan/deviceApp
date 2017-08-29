'use strict';
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from "react-native"

import Icon from 'react-native-vector-icons/FontAwesome';
export default class CheckBox extends Component {
  static defaultProps = {
    label: 'Label',
    labelBefore: false,
    checked: true
  };
  static propTypes = {
    label: React.PropTypes.string,
    labelStyle: React.PropTypes.object,
    checked: React.PropTypes.bool,
    onChange: React.PropTypes.func
  };
  constructor(props) {
    super(props);
    this.state = {
      checked: props.checked,
    };
  }
  componentWillMount() {
    // console.log("checkbox初始化啦");
  }
  componentWillReceiveProps(nextProps) {
    // console.log("checkbox接收到新参数啦"+nextProps);
    this.setState({
      checked: nextProps.checked
    });
  }
  componentWillUnmount() {
    //console.log("checkbox组件被销毁了");
  }

  onChange() {
    this.setState({ checked: !this.state.checked });
  }
  toggle() {
    // console.log("checkbox被点击了");
    this.setState({ checked: !this.state.checked });
    this.props.onChange(!this.state.checked);
  }
  render() {

    var source = "square-o";

    if (this.state.checked) {
      source = "check-square-o";
    }

    var container = (
      <View style={styles.container}>
        <Icon name={source} size={16} style={styles.checkbox}  ></Icon>
        <View style={styles.labelContainer}>
          <Text style={[styles.label, this.props.labelStyle]}>{this.props.label}</Text>
        </View>
      </View>
    );

    if (this.props.labelBefore) {
      container = (
        <View style={styles.container}>
          <View style={styles.labelContainer}>
            <Text style={[styles.label, this.props.labelStyle]}>{this.props.label}</Text>
          </View>
          <Icon name={source} size={29} style={styles.checkbox} ></Icon>
        </View>
      );
    }

    return (
      <TouchableOpacity ref="checkbox" onPress={this.toggle.bind(this)} >
        {container}
      </TouchableOpacity>
    )
  }
};

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  checkbox: {
    paddingTop: 3,
    width: 29,
    height: 29,
    fontSize: 29
  },
  labelContainer: {
    marginLeft: 2,
    marginRight: 2
  },
  label: {
    fontSize: 14,
    lineHeight: 14,

  }
});
