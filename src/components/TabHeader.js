import React from "react";
import propTypes from "prop-types";
import { View, Text, StyleSheet, Dimensions, Image, TouchableHighlight, ScrollView } from "react-native";
import { Icon } from "react-native-elements";
import * as func from "../func/func";

//组件
const TabHeader = props => {
    const {scrollContainer,tab,tabActive,tabInactive,tabText,tabActiveText,tabInactiveText,tabHeader} = props.styles;
    let headers = [];
    let viewStyle, textStyle;
    for (let i = 0; i < props.navigationState.routes.length; i++) {
      let value = props.navigationState.routes[i];
      if (props.navigationState.index == i) {
        viewStyle = [tab, tabActive];
        textStyle = [tabText, tabActiveText];
      } else {
        viewStyle = [tab, tabInactive];
        textStyle = [tabText, tabInactiveText];
      }
      headers.push(
        <TouchableHighlight hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
          activeOpacity={1} underlayColor={null}
          key={i}
          style={viewStyle}
          onPress={func.debounce(() => props._changeIndex(i))}
        >
          <Text style={textStyle}>{value.title}</Text>
        </TouchableHighlight>
      );
    }
    //console.log(headers);
    return <View style={tabHeader}>
            <ScrollView 
              scrollEnabled={props.scroll?true:false}
              style={scrollContainer}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              >
              {headers}
            </ScrollView>
          </View>;
};

export default TabHeader;
