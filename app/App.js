
import React, { Component } from 'react';
import {
  Navigator,
} from 'react-native';
import Login from './view/Login';
export default class App extends Component {
   constructor(props) {
     super(props);
   }
  render() {
    let name = 'Login';
    let home = Login;
    return (
<Navigator
     initialRoute={{ name: name, component: home }}
     configureScene={(route, routeStack) => {//定义跳转的方式,禁用手势拖动跳转
                    return {...Navigator.SceneConfigs.FloatFromRight, gestures:{}};
                }}
     renderScene={(route, navigator) => {
       let Component = route.component;
       return <Component {...route.params} navigator={navigator} />
     }
     } />
    );
  }

}