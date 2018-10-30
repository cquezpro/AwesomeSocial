import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableHighlight, Dimensions, Platform } from "react-native";

class Footer extends Component {
  constructor() {
    super();
    this.state = {
      //inputs : ["预设价格","数量"]
      inputs: [],
    };
  }

  render() {
    let inputs = [];
    for(let i=0;i<this.state.inputs.length;i++){
      let v =  this.state.inputs[i];
      inputs.push(<View key={i} style={styles.input}>
        <Text style={styles.inpputText}>
          {v}
          </Text>
        </View>);
    }
    return (
      <View style={styles.container}>
        {inputs}
        <TouchableHighlight hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
          activeOpacity={1} underlayColor={null} style={styles.button} onPress={func.debounce(()=>this.props.onSubmit())}>
          <View style={styles.buttonView}>
            <Text style={styles.buttonText}>{this.props.text}</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    position: "absolute",
    alignItems: "center",
    bottom: 0,
    backgroundColor: "#fff",
    paddingBottom: Platform.OS === "ios" && Dimensions.get("window").height === 812 ? 24 : 0,
  },
  input: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flex: 1,
    height:50,
    justifyContent: "center",
    alignItems: "center"
  },
  inpputText: {
    fontSize: 15,
    fontWeight: "400"
  },
  button: {
    height:50,
    flex: 2,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center"
  },
  buttonView: {},
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "400"
  }
});

export default Footer;
