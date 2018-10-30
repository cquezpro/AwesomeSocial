import React, { Component } from "react";
import { TouchableWithoutFeedback,TouchableHighlight } from "react-native";
import * as func from "../func/func";

class TouchableDebounce extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableHighlight
      style={this.props.style} hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
      activeOpacity={1} underlayColor={null}
        onPress= {
          func.debounce(() => {
          this.props.onPress();
        }, 500)
        }
      >
        {this.props.children}
      </TouchableHighlight>
    );
  }
}

export default TouchableDebounce;