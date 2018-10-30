import React,{Component} from "react";
import { StyleSheet, Text, View, Image, Dimensions, ScrollView,Alert,InteractionManager } from "react-native";
import { TabViewAnimated, TabBar, SceneMap } from "react-native-tab-view";
import Header from "../components/Header";
import TabHeader from "../components/TabHeader";
import ShopDetail from "../components/ShopDetail";
import ShopMenu from "../components/ShopMenu";
import FooterCart from "../components/FooterCart";
import FooterSpec from "../components/FooterSpec";
import * as func from "../func/func";
import { connect } from "react-redux";
import MySpinner from "../components/MySpinner";
//import Spinner from 'react-native-loading-spinner-overlay';
//import { NavigationActions } from 'react-navigation';

const initialLayout = {
    height: 0,
    width: Dimensions.get("window").width
  };


  const mapStateToProps = state => ({ ...state.auth,...state.ShoppingCart });

  const mapDispatchToProps = dispatch => ({});

class Shop extends Component {
  constructor() {
    super();
    this.state = {
      renderPlaceholderOnly: true,
        spinner: false,
        index: 0,
        routes: [
            { key: "menu", title: "Menu"/*"点餐"*/ },
            { key: "shopDetail", title: "About"/*"商家信息"*/ },
        ],
        id: 1,
        name: " ",
        image: "",
        shop_detail: {
            name: "",
            comment: "",
            phone: "",
            open_time:"",
            close_time:"",
            placeID: "",
            address: "",
            latitude: null,
            longitude: null
        },
        shop_menu: [
            // {
            //     title:"小龙虾",
            //     data: [
            //         {
            //             id: 5,
            //             name: "普通小龙虾",
            //             price: 45,
            //             image: "xiaolongxie.png",
            //         },
            //         {
            //             id: 6,
            //             name: "麻辣香锅",
            //             price: 5,
            //             image: "xiaolongxia.png",
            //             spec_comment: "请选择口味。并选择至少2样自选菜品。",
            //             specifications:[
            //                 {
            //                     id: 61,
            //                     type: "single-choice",
            //                     title: "口味",
            //                     data: [{
            //                         id: 611,
            //                         name:"麻辣",
            //                         price:5
            //                     },{
            //                         id: 612,
            //                         name:"十三香",
            //                         price:5
            //                     },{
            //                         id: 613,
            //                         name:"蒜泥",
            //                         price:5
            //                     },]
            //                 },
            //                 {   id: 62,
            //                     type: "multi-choice",
            //                     min_amount: 2,
            //                     title: "配菜",
            //                     data: [{
            //                         id: 621,
            //                         name:"牛肉",
            //                         price:6
            //                     },{
            //                         id: 622,
            //                         name:"鸡腿",
            //                         price:7
            //                     },{
            //                         id: 623,
            //                         name:"白菜",
            //                         price:8
            //                     },]
            //                 }
            //             ]
            //         }
            //     ]
            // },
            // {
            //     title:"饮料",
            //     data: [
            //         {
            //             id: 10,
            //             name: "可乐300ml",
            //             price: 3,
            //             image: "xiaolongxie.png",
            //         },
            //         {
            //             id: 11,
            //             name: "雪碧300ml",
            //             price: 3,
            //             image: "xiaolongxia.png",
            //         }
            //     ]
            // }
        ]
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
    this.mySetState({ spinner: true});
    InteractionManager.runAfterInteractions(() => {
      setTimeout(async () => {
        try {
          const res = await func.callApi("get", "api/shop_detail",
          {id:this.props.navigation.state.params.id}, this.props.access_token);
          if (res.err) throw res.err;
          this.mySetState({
            ...res.data,
            spinner: false,
            renderPlaceholderOnly: false
          });
        } catch (err) {
          this.mySetState({ spinner: false,renderPlaceholderOnly: false });
          func.errAlert(err);
        }
      }, 100);
    });
      
  }
  
  static navigationOptions = ({ navigation }) => ({
    header: null
  });

  onCheckout = () => {
    if(this.props.all_total_price==0){
      Alert.alert("Your cart is empty."/*"请先添加商品到购物车。"*/);
    }else{
      //this.props.navigation.navigate("ConfirmOrder",this.state.id);
      //this.props.navigation.dispatch(NavigationActions.navigate({ key: 'ConfirmOrder',routeName: 'ConfirmOrder' }));
      this.props.navigation.navigate({ key: 'ConfirmOrder', routeName: 'ConfirmOrder'});
    }
  }

  onBack = () => {
    this.props.navigation.goBack();
  };

  _renderScene = (route, navigator) => {
    if (route.route.key === "menu") 
      return <ShopMenu  
        shopId={this.state.id} 
        shopName={this.state.name}
        shopPhone={this.state.shop_detail.phone}
        location={{
          latitude:this.state.shop_detail.latitude,
          longitude:this.state.shop_detail.longitude
        }} 
        data={this.state.shop_menu}/>;
    else if (route.route.key === "shopDetail") return <ShopDetail  shopId={this.state.id} data={this.state.shop_detail}/>;
  };

  _handleIndexChange = index => this.mySetState({ index });

  _renderHeader = props => (
    <TabHeader
      {...props}
      styles={styles_tabheader}
      _changeIndex={i => this._handleIndexChange(i)}
    />
  );

  _renderPlaceholderView() {
    return (
      <View style={styles.container}>
        <Header
            title={this.state.name}
            onBack={() => this.onBack()}
            icons={[]}
            transparent={true}
        />
        <MySpinner
          visible={true}
          textContent={'Please wait...'}
          textStyle={{ color: '#fff' }} />
      </View>
    );
  }

  render() {
    if (this.state.renderPlaceholderOnly) {
      return this._renderPlaceholderView();
    }
    return (
      <View style={styles.container}>
        <Header
            title={this.state.name}
            onBack={() => this.onBack()}
            icons={[]}
            transparent={true}
        />
        <ScrollView scrollEnabled={false} style={styles.body}>
            <Image
                style={styles.shopImage}
                source={{ uri: func.image_url + this.state.image }}
                resizeMode="cover"
            />
            <TabViewAnimated
                swipeEnabled={false}
                style={styles.shopInfo}
                navigationState={this.state}
                renderScene={this._renderScene}
                renderHeader={this._renderHeader}
                onIndexChange={this._handleIndexChange}
                initialLayout={initialLayout}
            />
        </ScrollView>
        <FooterSpec 
          shopId={this.state.id} 
          shopName={this.state.name}
          shopPhone={this.state.shop_detail.phone}
          location={{
            latitude:this.state.shop_detail.latitude,
            longitude:this.state.shop_detail.longitude
          }} />
        <FooterCart onCheckout={this.onCheckout}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
      backgroundColor: "#fff",
      height: Dimensions.get("window").height,
  },
  shopImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").width/2
  },
  shopInfo: {
    flex: 1,
    height: Dimensions.get("window").height-Dimensions.get("window").width/2
  }
});

const main_color = "#ff9600";
const secondary_color = "#fff";
const styles_tabheader = StyleSheet.create({
  tabHeader: {
    flexDirection: "row",
    justifyContent: "center",
    height: 38,
    padding: 5
  },
  tab: {
    width: Dimensions.get("window").width * 0.48,
    borderWidth: 1.5,
    borderColor: main_color,
    borderRadius:5,
    justifyContent: "center",
    alignItems: "center"
  },
  tabActive: {
      backgroundColor:main_color
  },
  tabInactive: {},
  tabText: {
    fontSize: 17,
    textAlign: "center",
    fontWeight: "500"
  },
  tabActiveText: {
    color: secondary_color
  },
  tabInactiveText: {
    color: main_color
  },
});

//export default Shop;
export default connect(mapStateToProps, mapDispatchToProps)(Shop);
