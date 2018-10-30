import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  Image,
  Alert,
  TouchableHighlight,
  Dimensions,
  ImageBackground,
  Platform,
  RefreshControl
} from "react-native";
import { List, ListItem } from "react-native-elements";
import axios from "axios";
import Header from "../components/Header";
import * as func from "../func/func";
import { connect } from "react-redux";
import MySpinner from "../components/MySpinner";
import Closer from "../components/Closer";
import { NavigationActions } from 'react-navigation';

const mapStateToProps = state => ({ ...state.auth, });

const mapDispatchToProps = dispatch => ({});

class OrderList extends Component {
  constructor() {
    super();
    this.state = {
      spinner: false,
      refreshing: false,
      items: []
    };
  }
  componentMounted = true;
  // componentDidMount = () => {
  //   this.componentMounted = true;
  // }
  componentWillUnmount(){
    this.componentMounted = false;
  }
  mySetState = (newState) => {
    if(this.componentMounted){
      this.setState(newState);
    }
  }

  static navigationOptions = ({ navigation }) => ({
    header: null
  });

  componentDidMount() {
    this.componentMounted = true;
    this.getOrderList();
  }

  _onRefresh = () => {
    this.mySetState({refreshing: true});
    this.getOrderList(true);
  }

  getOrderList = (refresh=false) => {
    if(!this.props.access_token)
      this.props.navigation.navigate({ key: 'UserCenter', routeName: 'UserCenter'});
      //this.props.navigation.navigate("UserCenter");
    else{
      if(!refresh)
        this.mySetState({ spinner: true});
      setTimeout(async () => {
        try {
          const res = await func.callApi("get", "api/order_list",
          {}, this.props.access_token);
          if (res.err) throw res.err;
          this.mySetState({
            spinner: false,
            items:res.data,
            refreshing: false
          });
        } catch (err) {
          this.mySetState({
            spinner: false,
            refreshing: false
          });
          func.errAlert(err);
        }
      }, 100);
    }
  }

  //_renderItem = ({ item }) => <ProductSimple key={item.title} item={item} />; //FlatList  FlatList  FlatList  FlatList  FlatList  FlatList

  onLearnMore = item => {
    //this.props.navigation.navigate("Order", item);
    this.props.navigation.navigate({ key: 'Order', routeName: 'Order', params: item});
  };

  render() {
    //console.warn(this.props.navigation.state.key);
    let items = this.state.items.map((item,index)=>{
        return <TouchableHighlight hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
        activeOpacity={1} underlayColor={null}
        key={index}
        onPress={func.debounce(() => this.onLearnMore(item))}
      >
      <View style={styles.itemContainer}>
        <View style={styles.rowContainer}>
            <Text style={styles.subText}>Id:{item.transaction_id}</Text>
            <Text style={styles.subText}>{item.created_at}</Text>
        </View>
        <View style={styles.rowContainer}>
            <Text style={styles.Text} numberOfLines={1}>{item.address}</Text>
        </View>
        <View style={styles.rowContainer}>
            <Text style={styles.Text}>${func.price(item.total+item.shipment_fee)}</Text>
            {/*<Text style={styles.Text}>{func.status(item.status)}</Text>*/}
        </View>
      </View>
      </TouchableHighlight>;
    });
    return (
      /*<View style={styles.container}>
        <Closer onPress={func.debounce(()=>this.props.navigation.navigate("ProductList"))}/>
        <div><Text>我的订单</Text></div>
        <ScrollView style={styles.ScrollView}>
          <List>{items}</List>
        </ScrollView>
        <Spinner
          visible={this.state.spinner}
          textContent={'Please wait...'}
          textStyle={{ color: '#fff' }} />
    </View>*/
      <View style={styles.container}>
        <ImageBackground style={styles.imageBackground} source={require("../img/bg2.jpg")}>
          <Closer onPress={func.debounce(()=>{
            if(this.props.navigation.state.params==="finish_order")
              this.props.navigation.navigate({ key: 'ProductList', routeName: 'ProductList'});
              //this.props.navigation.navigate("ProductList");
            else
              this.props.navigation.dispatch(NavigationActions.back());
          })}/>
          <View style={styles.title}><Text style={styles.titleText}>My Orders</Text></View>
          <ScrollView 
            refreshControl={<RefreshControl
              tintColor={main_color}
              refreshing={this.state.refreshing}
              onRefresh={()=>this._onRefresh()}
            />}
            style={styles.ScrollView}
          >
            <List>{items}</List>
          </ScrollView>
          <MySpinner
            visible={this.state.spinner}
            textContent={'Please wait...'}
            textStyle={{ color: '#fff' }} />
        </ImageBackground>

        </View>
    );
  }
}

const main_color = "#ff9600";

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    imageBackground: {
      flex:1,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      paddingTop:Platform.OS === "ios" && Dimensions.get("window").height === 812 ? 24 : 0,
  },
  title: {
    height: 75,
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600"
  },
  ScrollView: {
    flex: 1
  },
  itemContainer: {
    padding:10,
    borderWidth: 1,
    borderColor: "#e7e7e7"
  },
  rowContainer: {
      flex: 1,
      flexDirection: "row",
      width: Dimensions.get('window').width-20,
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical:3
  },
  subText: {
      color:"#888",
      fontSize:13,
  },
  Text: {
    //flexWrap: "wrap",
    //flexDirection: "row",
  }
});

//export default OrderList;
export default connect(mapStateToProps, mapDispatchToProps)(OrderList);
