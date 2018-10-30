import React, { Component } from "react";
import propTypes from 'prop-types';
import { View,Text,TouchableHighlight,Dimensions } from 'react-native';
import { Icon } from "react-native-elements";
import * as func from "../func/func";

class CurrentPosition extends Component {

    render() {
        return ( 
            <TouchableHighlight hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
                activeOpacity={1} underlayColor={null}
                style = {style.container}
                onPress = {func.debounce(() => this.props.onClick())} 
            >
                <View style={style.viewContainer}>
                    <Icon name="room" color="#ff9600" size={20}/>
                    <Text >{this.props.position?this.props.position.address:"Click to set pick-up address"}</Text>
                    <Icon name="arrow-drop-down" color="#ff9600" size={20}/>
                </View>
            </TouchableHighlight>
        )
    }

}

const width = Dimensions.get("window").width+func.screen_width_offset;
const style = {
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  viewContainer: {
    width:Dimensions.get("window").width/1.2,
    paddingVertical: width*0.013,//10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  }
};

CurrentPosition.propTypes = {
  
};

export default CurrentPosition;
