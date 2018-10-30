import React from 'react';
import propTypes from 'prop-types';
import { View,TouchableHighlight,Platform,Dimensions,StyleSheet } from 'react-native';
import { Icon } from "react-native-elements";
import * as func from "../func/func";

const Closer = props => {
  return (
    <TouchableHighlight hitSlop={{top: 10, left: 10, bottom: 10, right: 10}} activeOpacity={1} underlayColor={null}
        style={styles.clearButton} onPress={func.debounce(()=>props.onPress())}>
        <Icon name="clear" color={props.color?props.color:"#fff"} size={35}/>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
    clearButton: {
        zIndex:10,
        position: "absolute",
        height: 50,
        width:50,
        left: 10,
        top:20+(Platform.OS === "ios" && Dimensions.get("window").height === 812 ? 24 : 0),
    }
});

export default Closer;
