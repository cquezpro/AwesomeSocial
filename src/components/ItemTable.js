import React from "react";
import propTypes from "prop-types";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableHighlight,
  RefreshControl
} from "react-native";
import { Icon } from "react-native-elements";
import * as func from "../func/func";
import AsyncImage from "./AsyncImage";

//组件
const ItemTable = props => {
  //console.log('----------------------',props,'--------------');
  const {
    container,
    touchablehighlight,
    product,
    image,
    titleArea,
    title,
    titleText,
    subTitle,
    subTitleText,
    scrollview,
    product_list,
    messageText,
    selected,
    tagContainer,
    tag_image
  } = props.styles;
  let items = [];
  if (!props.items || props.items.length === 0) {
    items = <Text style={messageText}>{props.no_item_message}</Text>;
  } else {
    let items_size = 0;
    let ordered_items = props.items.map((v,i)=>{
      return Object.assign({},v,{
        distance:func.straightDistance({latitude:v.latitude,longitude:v.longitude},props.current_position),
        invalidTime:func.timeBetween(v.open_time,v.close_time,v.open_time2,v.close_time2)?0:1
      });
    }).sort((a, b) => {
      if(a.invalidTime != b.invalidTime)
        return (a.invalidTime > b.invalidTime)?1:-1;
      else if(a.popularity != b.popularity)
        return (a.popularity < b.popularity)?1:-1;
      else
        return (a.distance > b.distance)?1:-1;
    });
    for (var key in ordered_items) {
      let item = ordered_items[key];
      if (item.image)
        var image_source = { uri: func.image_url + item.image };
      else var image_source = require("../img/milk-powder.png");
      let tags = [];
      if(item.popularity>1){
        tags.push(<Image key={0} style={tag_image} source={require("../img/hot_deal.png")}/>);
      }
      if(item.invalidTime==1){
        tags.push(<Image key={1} style={tag_image} source={require("../img/closed.png")}/>);
      }
      items.push(
        <TouchableHighlight hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
          activeOpacity={1} underlayColor={null}
          style={touchablehighlight}
          onPress={func.debounce(() => props.onLearnMore(item))}
          key={items_size++}
        >
          <View
            style={[
              product,
              props.AddCategory &&
              func.myIncludes(props.selectedCategory, {
                name: item.name,
                id: item.id
              })
                ? selected
                : {}
            ]}
          >
            <View style={tagContainer}>{tags}</View>
            <AsyncImage dark={item.invalidTime==1} style={image} source={image_source} placeholderColor={"#eee"}/>
            <View style={titleArea}>
              <View style={title}>
                <Text numberOfLines={1} style={titleText}>{item.name}</Text>
              </View>
              <View style={subTitle}>
                <Text style={subTitleText}>{item.category}</Text>
                <Text style={subTitleText}>
                  {func.showDistance(item.distance)}km
                </Text>
              </View>
            </View>
            <View
              style={
                props.AddCategory &&
                func.myIncludes(props.selectedCategory, {
                  name: item.name,
                  id: item.id
                })
                  ? { position: "absolute", right: 0, bottom: 0 }
                  : { display: "none" }
              }
            >
              <Icon name="check" color="red" />
            </View>
          </View>
        </TouchableHighlight>
      );
    }
  }
  return (
      <View style={container}>
        <ScrollView 
          refreshControl={props.onRefresh?<RefreshControl
              refreshing={props.refreshing}
              onRefresh={props.onRefresh}
            />:null}
          overScrollMode={"always"} 
          horizontal={props.horizontal?true:false} style={scrollview}
        >
          <View style={product_list}>{items}</View>
        </ScrollView>
      </View>
  );
};

export default ItemTable;
