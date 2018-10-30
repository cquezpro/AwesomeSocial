import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableHighlight, Dimensions, Platform, ScrollView } from "react-native";
import { Icon } from "react-native-elements";
import MapView from 'react-native-maps';
import * as func from "../func/func";

class ShopDetail extends Component {
  constructor(props) {
    super(props);
  }
  // name: "霍巴特第一餐厅",
  // comment: "中国川菜，菜图片仅供参考。",
  // phone: "0416501122",
  // open_time:"16:00",
  // close_time:"01:45",
  //     placeID: "ChIJZa6ezJa8j4AR1p1nTSaRtuQ",
  //     address: "1 Hacker Way, Menlo Park, CA 94025, USA",
  //     latitude: 37.4843428,
  //     longitude: -122.14839939999999
  // 
  render() {
    if(this.props.data){
      const {name,comment,phone,open_time,close_time,open_time2,close_time2,placeID,address,latitude,longitude} = this.props.data;
      return (
        <View style={styles.container}>
          <ScrollView style={styles.scrollContainer}>
          <View style={styles.viewContainer}>
          <View style={styles.divider}/>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.comment}>{comment}</Text>
          </View>
          <View style={styles.divider}/>
          <View style={styles.detailsContainer}>
            {/*<View style={styles.detailContainer}>
              <Icon name="phone-in-talk" style={styles.icon}/>
              <Text style={styles.detail}>{phone}</Text>
      </View>*/}
            <View style={styles.detailContainer}>
              <Icon name="access-alarm" style={styles.icon}/>
              <Text style={styles.detail}>Open hours: {open_time} - {close_time}</Text>
            </View>

            {open_time2?
              <View style={styles.detailContainer}>
                <Icon name="access-alarm" style={styles.icon}/>
                <Text style={styles.detail}>Open hours: {open_time2} - {close_time2}</Text>
              </View>:[]}
            <View style={styles.detailContainer}>
              <Icon name="room" style={styles.icon}/>
              <Text style={styles.detail}>{address}</Text>
            </View>
            <MapView
              provider={MapView.PROVIDER_GOOGLE}
              style={styles.map}
              region={{
                latitude: latitude?latitude:37.4843428,
                longitude: longitude?longitude:-122.14839939999999,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
              }}
            >
              <MapView.Marker
                coordinate={{ latitude: latitude?latitude:37.4843428, longitude: longitude?longitude:-122.14839939999999 }}
                pinColor="#ff9600"
              />
            </MapView>
          </View>
          </View>
          </ScrollView>
        </View>
      );
    }else return <View/>;
  }
}
const width = Dimensions.get("window").width+func.screen_width_offset;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#798",
    height: Dimensions.get("window").height-Dimensions.get("window").width/2-38
  },
  scrollContainer: {
    flex: 1,
  },
  viewContainer: {
    flex: 1,
    paddingBottom:100
  },
  divider: {
    borderWidth: 4,
    borderColor: "#e7e7e7"
  },
  nameContainer: {
    padding: width*0.04,//20
  },
  name: {
    fontSize: width*0.032,//18,
    fontWeight: "600",
    color: "#333"
  },
  comment: {
    marginTop: 7,
    fontSize: width*0.026,//14,
    fontWeight: "400",
    color: "#333"
  },
  detailsContainer: {
    padding: width*0.04,//20
  },
  detailContainer: {
    width:Dimensions.get("window").width/1.2,
    flexDirection: "row",
    paddingTop:5,
    alignItems: "flex-start"
  },
  icon: {},
  detail: {
    paddingTop:2,
    paddingLeft: 10,
    fontSize: width*0.03,//17,
    fontWeight: "500",
    color: "#333"
  },
  map: {
    width: Dimensions.get("window").width-40,
    height:200,
    marginTop:15,
  }
});

export default ShopDetail;
