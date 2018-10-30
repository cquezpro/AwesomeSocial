import React from "react";
import propTypes from "prop-types";
import {
  Platform,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableHighlight
} from "react-native";
import { Icon } from "react-native-elements";
import SearchBar from "./SearchBar";
import * as func from "../func/func";

const Header = props => {
  let viewMid;
  let viewMidStyle = {};
  if (props.title)
    viewMid = <Text numberOfLines={1} style={styles.viewMidText}>{props.title}</Text>;
  else if (props.search) {
    viewMidStyle = { flex: 6,zIndex: 5};
    viewMid = <SearchBar androidShowPredictions={props.androidShowPredictions} isAddress={props.isAddress} search={(value) => props.search(value)} searchedKey={props.searchedKey}/>;
  } else
    viewMid = (
      <Image
        style={styles.viewMidImage}
        source={require("../img/discover.png")}
      />
    );
  let leftIcons = [];
  let rightIcons = [];
  if (props.onBack)
    leftIcons.push(
      <TouchableHighlight hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
        activeOpacity={1} underlayColor={null}
        key={-1}
        style={styles.touchable}
        onPress={func.debounce(() => props.onBack())}
      >
        <View style={styles.subview}>
          <Icon
            name="navigate-before"
            style={styles.icon}
            color="#ff9600"
            size={35}
          />
        </View>
      </TouchableHighlight>
    );
  
    if (props.userCenter)
    leftIcons.push(
      <TouchableHighlight hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
        activeOpacity={1} underlayColor={null}
        key={-1}
        style={styles.touchable}
        onPress={func.debounce(() => props.userCenter())}
      >
        <View style={styles.subview}>
          <Icon
            name="account-circle"
            style={styles.icon}
            color="#ff9600"
            size={Dimensions.get("window").width/12}
          />
        </View>
      </TouchableHighlight>
    );
  if (props.icons.length > 0) {
    for (let i = 0; i < props.icons.length; i++) {
      let value = props.icons[i];
      let tempIcons;
      if (i <= props.icons.length / 2 - 1) tempIcons = leftIcons;
      else tempIcons = rightIcons;
      let content = <View/>;
      if(value.icon)
        content = <View style={styles.subview}>
        <Icon name={value.icon} style={styles.icon} color="#666" />
      </View>;
      else
        content = <View style={styles.button}>
        <Text style={styles.buttonText}>{value.text}</Text>
      </View>
      tempIcons.push(
        <TouchableHighlight hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
          activeOpacity={1} underlayColor={null}
          key={i}
          style={styles.touchable}
          onPress={func.debounce(() => value.onClick())}
        >
        {content}
        </TouchableHighlight>
      );
    }
  }
  return (
    <View style={props.transparent?styles.viewStyleTransparent:styles.viewStyle}>
      <View style={[styles.view,(leftIcons.length>0?{}:{flex:0})]}>{leftIcons}</View>
      <View style={[styles.viewMid, viewMidStyle]}>{viewMid}</View>
      <View style={[styles.view,(rightIcons.length>0||!props.search?{}:{flex:0})]}>{rightIcons}</View>
    </View>
  );
};

padding =
  Platform.OS === "ios" && Dimensions.get("window").height === 812 ? 41 : 17;

const width = Dimensions.get("window").width+func.screen_width_offset;
const styles = StyleSheet.create({
  viewStyle: {
    paddingTop: padding,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    width: Dimensions.get("window").width,
    height: padding + 46,
    zIndex: 3,
  },
  view: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    height: 44
  },
  viewStyleTransparent: {
    position: "absolute",
    paddingTop: padding,
    backgroundColor: "rgba(255,255,255,0.5)",
    flexDirection: "row",
    justifyContent: "space-between",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").width/2,
    zIndex: 3,
  },
  viewMid: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 44
  },
  viewMidImage: { width: 140, height: 44 },
  viewMidText: {
    fontSize: width*0.027,//16,
    fontWeight: "bold"
  },
  touchable: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 7,
    paddingRight: 7
  },
  subview: {
    flexDirection: "row",
    justifyContent: "center"
  },
  icon: {
    color: "#ff7"
  },
  button: {
    height:30,
    paddingVertical: 4,
    paddingHorizontal: 5,
    flexDirection: "row",
    backgroundColor: "#48BBEC",
    borderColor: "#48BBEC",
    borderRadius: 3,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText:{
    color: "white",
    fontSize: 15,
    fontWeight: "400",
    marginRight: 4
  },
});

Header.propTypes = {
  headerText: propTypes.string
};

export default Header;
