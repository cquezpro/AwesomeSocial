import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, AsyncStorage } from "react-native";
import { Provider } from "react-redux";
import { Stacks } from "./src/config/router";
import { applyMiddleware, createStore } from "redux";
import navigationDebouncer from 'react-navigation-redux-debouncer';
//import { createLogger } from "redux-logger";
import reducer from "./src/reducers";
//import { YellowBox } from 'react-native';
//YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

//const logger = createLogger();
const store = createStore(reducer, applyMiddleware(navigationDebouncer(500)));
export default class App extends Component {//waimai-app
  render() {
    style = {};
    if (Platform.OS === "android") style = { marginTop: 24 };
    return (
      <Provider store={store}>
        <View style={styles.view}>
          <Stacks />
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1
  }
});
