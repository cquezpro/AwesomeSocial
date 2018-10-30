import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  Image,
  TouchableHighlight,
  Dimensions,
  ActivityIndicator,
  Alert,
  InteractionManager,
  PermissionsAndroid,
  Platform,
} from "react-native";
import ItemTable from "../components/ItemTable";
import ImageSlider from "../components/ImageSlider";
import Header from "../components/Header";
import CurrentPosition from "../components/CurrentPosition";
import { connect } from "react-redux";
import RNGooglePlaces from "react-native-google-places";
import Spinner from 'react-native-loading-spinner-overlay';
import FooterCart from "../components/FooterCart";
import * as func from "../func/func";
import * as cache from "../func/cache";
import Permissions from 'react-native-permissions';

const mapStateToProps = state => ({ ...state.GoogleMap, ...state.auth,...state.ShoppingCart });

const mapDispatchToProps = dispatch => ({
  onGetCurrentPosition: () => {
    RNGooglePlaces.getCurrentPlace()
    .then((results) => {
      dispatch({
        type: "SET_PICK_UP_POSITION",
        payload: results[0]
      });
    })
    .catch((error) => {
      //console.warn(error.message);
    });
    // navigator.geolocation.getCurrentPosition(
		// 	(position)=>{
    //     //console.warn("666",position);
		// 	},
		// 	(error)=> console.warn(error.message),
		// 	{enableHighAccuracy: true, timeout: 20000, maximumAge:1000}
    // );
  },
  onGetUserDetail : (payload) => {
    dispatch({
        type: "USER_DETAIL",
        payload: payload
    });
  },
  onClearCart: () => {
    dispatch({
        type: "CLEAR_CART",
        payload: {}
    })
  },
});
class ProductList extends Component {
  constructor() {
    super();
    this.state = {
      renderPlaceholderOnly: true,
      spinner: false,
      items: [],
      adv_images: [],
      refreshing: false,
      search_key: "",
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

  componentDidMount() {
    this.componentMounted = true;
    InteractionManager.runAfterInteractions(async () => {
      cache.getCache('access_token',this.getUserDetail);
      //this.props.onGetCurrentPosition();
      try {
        if(Platform.OS === "android"){ //android permission
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              'title': 'Cool Photo App Camera Permission',
              'message': 'Cool Photo App needs access to your camera ' +
                        'so you can take awesome pictures.'
            }
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //console.warn(666);
            this.props.onGetCurrentPosition();
          } else {
            //console.warn("Access location permission denied")
          }
        }else{ //ios permission
          Permissions.check('location', 'always').then(locationAlwaysCheck => {
            return (locationAlwaysCheck === 'denied' || locationAlwaysCheck === 'restricted');
          }).then(shouldCheckWhenInUse => {
              return (shouldCheckWhenInUse) ? Permissions.check('location', 'whenInUse') : 'requestAlways';
          }).then(locationResponse => {
              switch (locationResponse) {
                  case 'authorized':
                      return 'authorized';
                  case 'requestAlways':
                  case 'undetermined':
                      return Permissions.request('location', 'always');
                  default:
                      return 'denied';
              }
          }).then(locationAuthorization => {
            this.props.onGetCurrentPosition();
          });
        }
      } catch (err) {
        //console.warn(555,err.message);
      }
      // func
      //   .callApi("get", "api/slider_images", {}, this.props.access_token)
      //   .then(response => {
      //     this.mySetState({
      //       adv_images: response.data
      //     });
      //   })
      //   .catch(error => {
      //     //console.warn(error.response.data.message);
      //   });
      this.getProductList();
    });
    
  }

  onAdd = () => {
    //this.props.navigation.navigate("Category");
    this.props.navigation.navigate({ key: 'Category', routeName: 'Category'});
  };

  onCutomize = () => {
    //this.props.navigation.navigate("AddProduct");
    this.props.navigation.navigate({ key: 'AddProduct', routeName: 'AddProduct'});
  }

  static navigationOptions = ({ navigation }) => ({
    header: null,
    gesturesEnabled: false,
  });

  getProductList = (key="",refresh=false) => {
    let param = {};
    if(key!=="")
      param['search_key'] = key;
    let newState = {search_key:key};
    if(!refresh)
      newState['spinner'] = true;
    this.mySetState(newState);
    setTimeout(async () => {
        try {
          const res = await func.callApi("get", "api/shop_list",
          param, this.props.access_token);
          if (res.err) throw res.err;
          // let items = res.data;
          // console.warn(new Date().toLocaleString());
          // if(this.props.current_position)
          //   items = await func.sortShops(items,this.props.current_position);
          // console.warn(new Date().toLocaleString());
          this.mySetState({
            spinner: false,
            refreshing: false,
            items:res.data,
            renderPlaceholderOnly: false
          });
        } catch (err) {
          this.mySetState({ spinner: false,refreshing: false,renderPlaceholderOnly: false });
          func.errAlert(err);
        }
    }, 100);
  }

  onSearch = (key) => {
    this.getProductList(key);
  };


  _onRefresh = () => {
    this.mySetState({refreshing: true});
    this.getProductList(this.state.search_key,true);
  }

  getUserDetail = (access_token) => {
    setTimeout(async () => {
      try {
        const res = await func.callApi("get", "api/user",
        {}, access_token);
        if (res.err) throw res.err;
        this.props.onGetUserDetail({
          ...res.data,
          access_token:access_token
        });
      } catch (err) {
        //warn("555",err.message);
        cache.clearCache();
      }
    }, 100);
  }

  onCheckout = () => {
    if(this.props.all_total_price==0){
      Alert.alert("Your cart is empty."/*"请先添加商品到购物车。"*/);
    }else{
      //this.props.navigation.navigate("ConfirmOrder");
        this.props.navigation.navigate({ key: 'ConfirmOrder', routeName: 'ConfirmOrder'});
    }
  }

  onLearnMore = item => {
    if(func.timeBetween(item.open_time,item.close_time,item.open_time2,item.close_time2)){
      let inCart = false;
      if(this.props.carts.length>0)
        for(let i = 0;i<this.props.carts.length;i++){
          let cart = this.props.carts[i];
          if(item.id==cart.shop_id)
          {
            inCart = true;
            break;
          }
        }
      else
        inCart = true;
      if(inCart){
        //this.props.navigation.navigate("Shop", item);
        //this.props.navigation.navigate({ key: 'Shop',routeName: 'Shop', params: item});
        this.props.navigation.navigate({ key: 'Shop',routeName: 'Shop', params: item});
      }else{
        Alert.alert(
          "Enter a new shop will clear your shopping cart.",
          "",
          [
            {text: 'Cancel', onPress: () => {}},
            {text: 'Enter', onPress: func.debounce(() => {
              this.props.onClearCart();
              //this.props.navigation.navigate("Shop", item);
              this.props.navigation.navigate({ key: 'Shop', routeName: 'Shop', params: item});
            })},
          ]
        );
      }
    }
  };
  
  userCenter = () => {
    //this.props.navigation.navigate("UserCenter");
    this.props.navigation.navigate({ key: 'UserCenter', routeName: 'UserCenter'});
  }



  _renderPlaceholderView() {
    return (
      <View style={styles.container}>
        <Header
          search={value => this.onSearch(value)}
          userCenter = {this.userCenter}
          icons={[]}
        />
        <View style={styles.loadingContainer}>
          <Image style={styles.loadingGif} source={require("../img/loading.gif")} />
        </View>
      </View>
    );
  }

  render() {
    if (this.state.renderPlaceholderOnly) {
      return this._renderPlaceholderView();
    }
    return (
      <View style={styles.container}>
        {/*<Header
          title="产品列表"
          icons={[
            { text: "自定义", onClick: () => this.onCutomize() },
            { icon: "help", onClick: () => this.onHelp() },
            { icon: "add", onClick: () => this.onAdd() }
          ]}
        />*/}
        <Header
          search={value => this.onSearch(value)}
          userCenter = {this.userCenter}
          icons={[]}
        />
        <CurrentPosition
          position={this.props.current_position}
          onClick={()=>this.props.navigation.navigate({ key: 'GoogleMap', routeName: 'GoogleMap'})}
        />
        <ImageSlider images={this.state.adv_images}/>
        {this.state.spinner?<ActivityIndicator
            animating={this.state.spinner}
            color="#77f"
            size="large"
            style={{backgroundColor:'#fff',paddingTop:10}}
          />:<ItemTable
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh}
          styles={styles_itemtable}
          onLearnMore={item => this.onLearnMore(item)}
          items={this.state.items}
          current_position={this.props.current_position}
        />}
        <FooterCart onCheckout={this.onCheckout}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#fff"
  },
  loadingContainer: {
    flex:1,
    justifyContent: "center",
  },
  loadingGif: {
    height: Dimensions.get('window').width,
    width: Dimensions.get('window').width
  }
});
const item_width = Dimensions.get('window').width*0.9;//180
const item_height = Dimensions.get('window').width*0.6;//148
const image_height = Dimensions.get('window').width*0.5;//120
const title_height = Dimensions.get('window').width*0.1;//30
const styles_itemtable = StyleSheet.create({
  container: {
    height:Dimensions.get('window').height-Dimensions.get("window").width/4-35-
      (Platform.OS === "ios" && Dimensions.get("window").height === 812 ? 41 : 17 +46),
    //flex:1,
  },
  scrollview: {
    //flex: 1
    backgroundColor: "#fff",
  },
  product_list: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginBottom:item_height*0.5,
  },
  touchablehighlight: {
    marginTop: 14,
    width: item_width,//180,
    height: item_height,//148
  },
  product: {
    flexDirection: "column",
    width: item_width,//180,
    height: item_height,//148
    backgroundColor: "#fff",
    justifyContent: "space-between",
    alignItems: "center"
  },
  image: { 
   width: item_width,//180,
   height: image_height,
   borderRadius:15 
  },
  titleArea: { 
    width: item_width,//180,
    height: title_height,
    flexDirection: "column",
    justifyContent: "space-around",
    paddingHorizontal: 5
  },
  title: {
    alignItems:"flex-start",
    justifyContent: "space-around",
    overflow: 'hidden',
  },
  subTitle: {justifyContent: "space-between",alignItems:"flex-start",flexDirection: "row"},
  titleText: {
    fontSize: 15,
    color: "#333",
    textAlign: "center",
    fontWeight: "800"
  },
  subTitleText: {
    fontSize: 13,
    color: "#777",
    textAlign: "center",
    fontWeight: "600"
  },
  tagContainer: {
    position: "absolute",
    zIndex: 10,
    right:0,
    flexDirection: "row"
  },
  tag_image:{
    height:40,
    width: 60
  }
});
//export default ProductList;
export default connect(mapStateToProps, mapDispatchToProps)(ProductList);
