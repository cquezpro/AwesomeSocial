import React, { Component } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableHighlight, Dimensions, Platform, Image, FlatList, SectionList, TouchableWithoutFeedback } from "react-native";
import { Icon } from "react-native-elements";
import { connect } from "react-redux";
import MapView from 'react-native-maps';
import * as func from "../func/func";
//import TouchableDebounce from "./TouchableDebounce";

const mapStateToProps = state => ({ ...state.ShoppingCart });

const mapDispatchToProps = dispatch => ({
    onRemove0Amount: () => {
        dispatch({
            type: "REMOVE_0_AMOUNT",
            payload: {}
        })
    },
  onChangeProductAmount: (shop_id, product_id, isPlus) => {
      dispatch({
          type: "CHANGE_PRODUCT_AMOUNT",
          payload: {
            shop_id:shop_id, 
            product_id:product_id, 
            isPlus:isPlus
          }
      })
  }
});

class FooterCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
        //shopId: 0,
        isShowing : false,
    }
  }
  componentMounted = true;
  componentDidMount = () => {
    this.componentMounted = true;
  }
  componentWillUnmount(){
    this.componentMounted = false;
  }
  mySetState = (newState) => {
    if(this.componentMounted){
      this.setState(newState);
    }
  }
//   componentWillReceiveProps = (nextProps) => {
//     this.mySetState({
//       shopId: nextProps.shopId
//     });
//   }
  
  toggleShowCart = () => {
    if(this.state.isShowing)
        this.closeCart();
    else
        this.mySetState({ isShowing: true})
  }
    closeCart = () => {
        this.props.onRemove0Amount();
        this.mySetState({ isShowing: false})
    }
  
    // getCartItems = (datas) => {
    //     for(var i=0; i< datas.length; i++)
    //         if(datas[i].shop_id == this.state.shopId)
    //             return datas[i].data;
    //     return [];
    // }
    // getCartTotalPrice = (datas) => {
    //     for(var i=0; i< datas.length; i++)
    //         if(datas[i].shop_id == this.state.shopId)
    //             return datas[i].total_price;
    //     return 0;
    // } 

    _renderSpecifications = (specs) => {
        let result = [];
        for(let i=0; i<specs.length; i++){
            let spec = specs[i].title+":";
            let hasPrev = false;
            for(let j=0; j<specs[i].data.length; j++){
                let tmp = specs[i].data[j];
                if(tmp.amount>0){
                    spec+=(hasPrev?"、":"")+tmp.name+((tmp.amount>1)?("*"+tmp.amount):"");
                    hasPrev = true;
                }
            }
            result.push(<Text style={styles.specText} key={i}>{spec}</Text>);
        }
        return result;
    }

    _renderPrice = (price,specs) => {
        let result = price;
        if(specs.length>0) {
            for(let i=0; i<specs.length; i++){
                for(let j=0; j<specs[i].data.length; j++){
                    let tmp = specs[i].data[j];
                    result+=tmp.price*tmp.amount;
                }
            }
        }
        return result;
    }

    _renderAmountButton = (id,shop_id,amount) => {
        return <View style={styles.buttonContainer}> 
            <TouchableHighlight style={styles.TouchableHighlightPadding} hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
                activeOpacity={1} underlayColor={null}
                onPress={()=>this.props.onChangeProductAmount(shop_id,id,false)}
            >
                <View style={styles.sectionButton}>
                    <Text style={styles.sectionButtonText}>-</Text>
                </View>
            </TouchableHighlight>
            <Text style={styles.amountText}>{amount}</Text>
            <TouchableHighlight style={styles.TouchableHighlightPadding} hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
                activeOpacity={1} underlayColor={null}
                onPress={()=>this.props.onChangeProductAmount(shop_id,id,true)}
            >
                <View style={styles.sectionButton}>
                    <Text style={styles.sectionButtonText}>+</Text>
                </View>
            </TouchableHighlight>
        </View>
      }
      _renderSectionHeader = (title) => {
        return <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>{title}</Text>
        </View>;
      }

  render() {
    let cart = [];
    if(this.state.isShowing)
        cart = 
        <View style={styles.cartContainer}>
            <TouchableHighlight hitSlop={{top: 10, left: 10, bottom: 10, right: 10}} 
                activeOpacity={1} underlayColor={null} onPress={func.debounce(()=>this.closeCart())}>
                <View  style={styles.shadowContainer}/>
            </TouchableHighlight>
            <View style={styles.itemsContainer}>
                <View style={styles.cartHeader}>
                    <Text style={styles.cartHeaderText}>Shopping Cart</Text>
                </View>
                <TouchableHighlight style={styles.cartHeaderButton} hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
                    activeOpacity={1} underlayColor={null} onPress={func.debounce(()=>this.closeCart())}>
                        <Icon name="clear"/>
                </TouchableHighlight>
                <View style={styles.cartItems}>
                    <SectionList
                        contentContainerStyle={[]}
                        renderSectionHeader={({section: {title}}) => this._renderSectionHeader(title)}
                        renderItem={({item, index, section}) => {
                            return(
                            <View style={styles.sectionBodyInfo}>
                                <View style={styles.sectionName}>
                                    <Text style={styles.sectionNameText}>{item.name}</Text>
                                    {item.specifications.length>0&&this._renderSpecifications(item.specifications)}
                                </View>
                                <View style={styles.sectionPrice}>
                                    <Text style={styles.sectionPriceText}>${func.price(this._renderPrice(item.price,item.specifications))}</Text>
                                    {this._renderAmountButton(item.unique_id,section.shop_id,item.amount)}
                                </View>
                            </View>
                        )}}
                        sections={this.props.carts}
                        keyExtractor={(item, index) => item + index}
                    />
                </View>
            </View>
        </View>;
    return (
      <View style={styles.container}>
        {cart}
        <View style={styles.buttons}>
            <View style={styles.profileImageTouchable} >
                <TouchableWithoutFeedback hitSlop={{top: 20, left: 20, bottom: 20, right: 20}} 
                    onPress={func.debounce(()=>this.toggleShowCart())}>
                    <View style={styles.profileImageContainer}>
                        <Image
                            source={require("../img/shopping_cart.png")}
                            style={styles.profileImage}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </View>
                <TouchableWithoutFeedback hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
                    onPress={func.debounce(()=>this.toggleShowCart())}
                    style={{backgroundColor:"#ff7"}}
                >
                <View style={[styles.button,styles.button1]}>
                    <Text style={styles.buttonText}>Total:${func.price(this.props.all_total_price)}</Text>
                </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback hitSlop={{top: 20, left: 20, bottom: 20, right: 20}} 
                    onPress={func.debounce(func.debounce(()=>this.props.onCheckout(),500))}
                    style={{backgroundColor:"#ff7"}}
                >
                <View style={[styles.button,styles.button2,this.state.isShowing?{display:'none'}:{}]}>
                    <Text style={styles.buttonText}>Pay</Text>
                </View>
                </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}
const width = Dimensions.get("window").width+func.screen_width_offset;
const footer_height = 35;
const cart_image_height = (Platform.OS === "ios")?52:35;
const cart_image_border = (Platform.OS === "ios")?4:0;
const main_color = "#ff9600";
const secondary_color = "#fff";
const styles = StyleSheet.create({
  container: {
    zIndex: 5,
    position: "absolute",
    bottom:0,
    width: Dimensions.get("window").width,
    //height: footer_height,
    //backgroundColor: main_color,
    //flexDirection: "row",
  },
  buttons: {
    zIndex:4,
    flex:1,
    flexDirection: "row",
    height: footer_height,
  },
  cartContainer: {
    zIndex:3,
    //position: "absolute",
    height:Dimensions.get("window").height,
    width: Dimensions.get("window").width,
  },
  shadowContainer:{
    backgroundColor: "rgba(0,0,0,0.5)",
    height: Dimensions.get("window").height*0.25,
  },
  itemsContainer:{
    height: Dimensions.get("window").height*0.75,
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  cartHeader:{
    height: footer_height,
    backgroundColor:secondary_color,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  cartHeaderText:{
      color: main_color,
      fontSize: width*0.04,//20,
      fontWeight:"500",
  },
  cartHeaderButton:{
      height: footer_height,
      width: footer_height+20,
      alignItems: "center",
      justifyContent: "center",
       position: "absolute",
       right: width*0.03,//15,
       //top: -footer_height
  },
  sectionBodyInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  sectionName: {
    width: Dimensions.get('window').width/1.5,
    justifyContent: "center",
    paddingLeft: width*0.026,//15,
  },
  sectionNameText: {
    color: main_color,
    fontSize:width*0.026,//15,
    fontWeight: "600"
  },
  specText: {
      fontSize:width*0.023,//13,
      color: "#555"
  },
  sectionPrice: {
    alignItems: "center",
    justifyContent: "center",
    paddingRight: width*0.026,//15
  },
  sectionPriceText: {
    fontSize:width*0.027,//16,
  },
  buttonContainer: {
    alignItems: "center",
    flexDirection: "row"
  },
  sectionButton: {
    //right: 15,
    backgroundColor: main_color,
    borderRadius: 15
  },
  amountText: {
      paddingHorizontal: 6,
  },
  sectionButtonText: {
    paddingVertical: 4,
    paddingHorizontal:8,
    fontSize:11,
    color:"#fff"
  },
  cartItemsContainer: {
    backgroundColor: "rgba(255,255,255,0.95)"
  },
  cartItems: {
    width: Dimensions.get("window").width,
    //height: Dimensions.get("window").height / 1.5,
  },
  profileImageTouchable: {
    zIndex: 6,
    bottom: 0,
    left: 20,
    position: "absolute",
  },
  profileImageContainer: {
    borderColor: main_color,
    borderRadius: cart_image_height/2,
    height: cart_image_height,
    width: cart_image_height,
    borderWidth: cart_image_border,
    backgroundColor: secondary_color,
    justifyContent:"center",
    alignItems: "center",
  },
  profileImage: {
    borderRadius: 7,
    height: cart_image_height/1.6,
    width: cart_image_height/1.6
  },
  button: {
    height: footer_height,
  },
  button1: {
    flex: 2,
    backgroundColor: main_color,
    paddingLeft:80,
    justifyContent: "center",
  },
  button2: {
    flex: 1,
    backgroundColor: "#ffd304",//"#76BDE9",
    justifyContent: "center",
    alignItems: "center"
  },
  buttonView: {
    backgroundColor:"#f7f"
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "900"
  },
  sectionTitle: {
    height: 35,
    backgroundColor: "#fff",
    padding: 7,
    justifyContent: "center"
  },
  sectionTitleText: {
    fontSize:16,
    fontWeight: 'bold'
  },
  TouchableHighlightPadding: {
    padding:5
  }
});

//export default FooterCart;
export default connect(mapStateToProps, mapDispatchToProps)(FooterCart);
