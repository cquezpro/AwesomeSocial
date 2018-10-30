import React,{Component} from "react";
import { StyleSheet, Text, View,InteractionManager, Image,Platform, TouchableOpacity, TextInput,Dimensions,Alert,ActivityIndicator,ScrollView,TouchableHighlight,ImageBackground } from "react-native";
import Header from "../components/Header";
import CurrentPosition from "../components/CurrentPosition";
import { connect } from "react-redux";
import FooterCart from "../components/FooterCart";
import * as func from "../func/func";
import ItemTable from "../components/ItemTable";
import Spinner from 'react-native-loading-spinner-overlay';
import Form from 'react-native-form';
import stripe from 'tipsi-stripe';


import { List, ListItem } from "react-native-elements";
import Icon from "../components/Icon";


stripe.setOptions({
  publishableKey: func.publishableKey,
  //androidPayMode: 'test',
})

const mapStateToProps = state => ({ ...state.auth,...state.GoogleMap,...state.ShoppingCart });
const mapDispatchToProps = dispatch => ({
  onRemove0Amount: () => {
      dispatch({
          type: "REMOVE_0_AMOUNT",
          payload: {}
      })
  },
  onClearCart: () => {
    dispatch({
        type: "CLEAR_CART",
        payload: {}
    })
  },
});

class ConfirmOrder extends Component {
  constructor() {
    super();
    this.state = {
      renderPlaceholderOnly: true,
      spinner: false,
      shoplist_spinner: false,
      item: [],
      near_shops: [],
      payment_types: ["card"],
      payment_type: "card", //alipay
      shipment_fee: -2,
      driver_fee: -2,
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

  componentDidMount = () => {
    this.componentMounted = true;
    InteractionManager.runAfterInteractions(async () => {
      this.mySetState({
        renderPlaceholderOnly: false
      });
      this.updateShipmentFee(this.props);
      this.updateNearShops(this.props);
    });
  }

  componentWillReceiveProps = (nextProps) => {
    //console.warn("componentWillReceiveProps");
    this.updateShipmentFee(nextProps);
    if(nextProps.carts.length!=this.props.carts.length)
      this.updateNearShops(nextProps);
  }

  updateNearShops = (nextProps) => {
    if(nextProps.carts.length<2){
      this.mySetState({ shoplist_spinner: true});
      setTimeout(async () => {
          try {
            const res = await func.callApi("get", "api/shop_list",
            {}, nextProps.access_token);
            if (res.err) throw res.err;
            let near_shops = res.data.filter((v1,i1)=>{
              let addable = true;
              for(let i = 0;i<nextProps.carts.length;i++){
                let v2 = nextProps.carts[i];
                if((v1.id==v2.shop_id)
                  ||(func.straightDistance({latitude:v1.latitude,longitude:v1.longitude},v2.location)>0.75))
                {
                  addable = false;
                  break;
                }
              }
              return addable;
            });
            this.mySetState({
              shoplist_spinner: false,
              near_shops: near_shops
            });
          } catch (err) {
            this.mySetState({ shoplist_spinner: false });
            func.errAlert(err);
          }
      }, 100);
    }else{
      this.mySetState({
        near_shops: []
      });
    }
  }

  updateShipmentFee = async (nextProps) => {
    if(!nextProps.current_position){
      this.mySetState({
        shipment_fee: -2,
        driver_fee: -2
      });
      return ;
    }
    let distance = 0;
    for(let i = 0;i<nextProps.carts.length;i++){
      let v = nextProps.carts[i];
      if(v.total_price==0)
        continue;
      let new_distance = await func.driveDistance(v.location,{
        latitude:nextProps.current_position.latitude,
        longitude:nextProps.current_position.longitude
      });
      if(new_distance>15||new_distance==-1){
        this.mySetState({
          shipment_fee: -1,
          driver_fee: -1
        });
        return;
      }
      distance = (new_distance>distance)?new_distance:distance;
    }
    let shipment_fee = 5.5; 
    if(distance>4)
      shipment_fee += (distance-4)*1;
    if(func.cartLength(nextProps.carts)>1)
      shipment_fee += 1.95;
    let driver_fee = 6; 
    if(distance>3)
      driver_fee += (distance-3)*0.8;
    if(func.cartLength(nextProps.carts)>1)
      driver_fee += 1.6;
    this.mySetState({
      shipment_fee: shipment_fee,
      driver_fee: driver_fee
    });
  }
  
  onBack = () => {
    this.props.navigation.goBack();
  };

  static navigationOptions = ({navigation}) => ({
    header: null
  });

  onCheckout =  () => {
    if(this.state.spinner == true)
      return;
    if(Platform.OS === "ios")
      this.mySetState({ spinner: true});
    setTimeout(async() => {
      if(!this.props.access_token){
        this.mySetState({ spinner: false });
        setTimeout(() => {this.props.navigation.navigate("UserCenter",'back');},100);
      }else if(!this.props.current_position){
        this.mySetState({ spinner: false });
        setTimeout(() => {Alert.alert("Please set the address."/*'请选择取餐地址'*/);},100);
      }else if(this.state.shipment_fee==-2||this.state.driver_fee==-2){
        this.mySetState({ spinner: false });
        setTimeout(() => {Alert.alert("Delivery fee error, please try again.")},100);
      }else if(this.refs.form.getValues().phone&&(this.refs.form.getValues().phone.match(/\d/g).length<10||this.refs.form.getValues().phone.match(/\d/g).length>11)){
        this.mySetState({ spinner: false });
        setTimeout(() => {Alert.alert("Invalid phone number."/*'请选择取餐地址'*/)},100);
      }else if(this.props.all_total_price==0){
        this.mySetState({ spinner: false });
        setTimeout(() => {Alert.alert("Your cart is empty."/*"请先添加商品到购物车。"*/);},100);
      }else if(this.props.all_total_price<10){
        this.mySetState({ spinner: false });
        setTimeout(() => {Alert.alert("Minimum subtotal is $10."/*"请先添加商品到购物车。"*/);},100);
      }else if(func.cartLength(this.props.carts)>2){
        this.mySetState({ spinner: false });
        setTimeout(() => {Alert.alert("Maximum two shops."/*'最多只能同事在两个店家下单。'*/);},100);
      }else{
          let params = {};
          params['ordered_items'] = JSON.stringify(this.props.carts);
          params['phone'] = this.refs.form.getValues().phone?this.refs.form.getValues().phone:this.props.phone;
          params['delivery_time'] = this.refs.form.getValues().delivery_time?this.refs.form.getValues().delivery_time:'ASAP';
          params['comment'] = this.refs.form.getValues().comment;
          params['total'] = this.props.all_total_price;
          params['shipment_fee'] = this.state.shipment_fee;
          params['driver_fee'] = this.state.driver_fee;
          if(params['shipment_fee']===-1){
            this.mySetState({ spinner: false });
            setTimeout(() => {Alert.alert('The maximum delivery distance is 15km.');},100);
            return;
          }
          params['address'] = this.props.current_position.address;
          params['placeID'] = this.props.current_position.placeID;
          params['latitude'] = this.props.current_position.latitude;
          params['longitude'] = this.props.current_position.longitude;
          params['payment_type'] = this.state.payment_type;
          try {
            if(this.state.payment_type === "card"){
              const token = await stripe.paymentRequestWithCardForm({
                smsAutofillDisabled: true,
              });
              params['token'] = token.tokenId;
            }else if(this.state.payment_type === "alipay"){
              const source = await stripe.createSourceWithParams({
                type: 'alipay',
                amount: (this.props.all_total_price+this.state.shipment_fee)*100,
                currency: 'AUD',
                returnURL: 'CodingBabyApp://a',
              });
              //console.warn("Source:",JSON.stringify(source));
            }
          } catch (error) {
            this.mySetState({ spinner: false });
            setTimeout(() => {func.errAlert(error);},100);
            return;
          }
          if(Platform.OS === "android")
            this.mySetState({ spinner: true});
          setTimeout(async () => {
            try {
              const res = await func.callApi("post", "api/order",
              params, this.props.access_token);
              if (res.err) throw res.err;
              this.mySetState({
                spinner: false,
              });
              setTimeout(() => {
                  this.props.onClearCart();
                  Alert.alert("Order Succeeded."/*'下单成功。'*/);
                  //this.props.navigation.navigate("OrderList","finish_order");
                  this.props.navigation.navigate({ key: 'OrderList', routeName: 'OrderList', params: "finish_order"});
              }, 100);
      
            } catch (err) {
              this.mySetState({ spinner: false });
              func.errAlert(err,"Order Failed."/*'下单失败。'*/);
            }
          }, 100);
      }
    },100);
  }

  // getCartTotalPrice = (datas) => {
  //     for(var i=0; i< datas.length; i++)
  //         if(datas[i].shop_id == this.props.navigation.state.params)
  //             return datas[i].total_price;
  //     return 0;
  // } 
  onLearnMore = item => {
    if(func.timeBetween(item.open_time,item.close_time,item.open_time2,item.close_time2))
      this.props.navigation.navigate({ key: 'ShopSecond', routeName: 'Shop', params: item});
      //this.props.navigation.navigate("Shop", item);
  };

  _renderPaymentTypes = () => {
    let types = [];
    let viewStyle, textStyle, image, text;
    for (let i = 0; i < this.state.payment_types.length; i++) {
      let value = this.state.payment_types[i];
      if(value=='card'){
        image = <Image
          style={{ width: 25, height: 25 }}
          source={require("../img/card.png")}
        />;
        text = 'Card';
      }else if(value=='alipay'){
        image = <Image
          style={{ width: 25, height: 25 }}
          source={require("../img/alipay.png")}
        />;
        text = 'Alipay';
      }else if(value=='wechat'){
        image = <Image
          style={{ width: 25, height: 25 }}
          source={require("../img/wechat.png")}
        />;
        text = 'Wechat';
      }
      if (this.state.payment_type === value) {
        viewStyle = [styles.tab, styles.tabActive];
        textStyle = [styles.tabText, styles.tabActiveText];
      } else {
        viewStyle = [styles.tab, styles.tabInactive];
        textStyle = [styles.tabText, styles.tabInactiveText];
      }
      types.push(
        <TouchableOpacity hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
          key={i}
          style={viewStyle}
          onPress={func.debounce(() => {
            this.mySetState({payment_type:value});
          })}
        >
          {image}
          <Text style={textStyle}>{text}</Text>
        </TouchableOpacity>
      );
    }
    //console.log(headers);
    return <View style={styles.tabHeader}>{types}</View>;
  }

  _renderPlaceholderView() {
    return (
      <View style={styles.container}>
        <Header
            title = "Order Confirmation"/*"确认订单"*/
            onBack={() => this.onBack()}
            icons={[]}
        />
      </View>
    );
  }

  render() {
    if (this.state.renderPlaceholderOnly) {
      return this._renderPlaceholderView();
    }
    let shipment_fee = this.state.shipment_fee;
    return (
        <View style={styles.container}>
            <Header
                title = "Order Confirmation"/*"确认订单"*/
                onBack={() => this.onBack()}
                icons={[]}
            />
            {/*scrollEnabled={false}*/}
            <View style={styles.bodyScrollContainer}>
            <ScrollView style={styles.bodyScrollContainer}>
            <Form ref='form' style={styles.bodyScrollContainer}>
              <View style={styles.bodyContainer}>
                <View style={styles.divider}/>
                <View style={styles.sectionContainer}>
                    <Text style={styles.headerText}>Delivery Address</Text>
                    <CurrentPosition
                        position={this.props.current_position}
                        onClick={()=>{
                          this.props.navigation.navigate({ key: 'GoogleMap', routeName: 'GoogleMap'});
                          //this.props.navigation.navigate("GoogleMap")
                        }}
                    />
                </View>
                <View style={styles.divider}/>
                <View style={styles.sectionContainer}>
                    <View style={styles.rowContainer}>
                        <Text style={styles.headerText}>Contact Phone Number</Text>
                        <View style={styles.textInputContainer}>
                          <TextInput
                              ref='phone'
                              name={'phone'}
                              type={'TextInput'}
                              textAlignVertical={'center'}
                              underlineColorAndroid={'rgba(0,0,0,0)'}
                              style={styles.inputText}
                              placeholder={"Phone No."}
                              defaultValue={this.props.phone}
                          />
                        </View>
                    </View>
                </View>
                <View style={styles.divider}/>
                <View style={styles.sectionContainer}>
                    <View style={styles.rowContainer}>
                        <Text style={styles.headerText}>Delivery Time</Text>
                        <View style={styles.textInputContainer}>
                          <TextInput
                              ref='delivery_time'
                              name={'delivery_time'}
                              type={'TextInput'}
                              textAlignVertical={'center'}
                              underlineColorAndroid={'rgba(0,0,0,0)'}
                              style={styles.inputText}
                              placeholder={"18:30"}
                              defaultValue={"ASAP"}
                          />
                        </View>
                    </View>
                </View>
                <View style={styles.divider}/>
                <View style={styles.sectionContainer}>
                    <View style={styles.rowContainer}>
                        <Text style={styles.headerText}>Payment Type</Text>
                        {/*{this._renderPaymentTypes()}*/}
                        <Text style={styles.headerText}>Card Only</Text>
                    </View>
                </View>
                <View style={styles.divider}/>
                <View style={styles.sectionContainer}>
                    <View style={styles.rowContainer}>
                        <Text style={styles.headerText}>Subtotal</Text>
                        <Text style={styles.headerText}>${func.price(this.props.all_total_price)}</Text>
                    </View>
                </View>
               


                <View style={styles.sectionContainer}>
                    <View style={styles.rowContainer}>
                        <Text style={styles.headerText }>Delivery Fee(Special)</Text>
                        <Text style={styles.headerText}>
                          {shipment_fee>=0?('$'+func.price(shipment_fee)):'Over 15KM.'}
                        </Text>
                      </View>`
                  </View>  




                <View style={styles.sectionContainer}>
                    <View style={styles.rowContainer}>
                        <Text style={styles.headerText}>Total</Text>
                        <Text style={styles.headerText}>${func.price(this.props.all_total_price+shipment_fee)}</Text>
                    </View>
                </View>
                <View style={styles.divider}/>
                <View style={styles.sectionContainer}>
                    <View style={styles.rowContainer}>
                        <Text style={styles.headerText}>Add a Note</Text>
                        <TextInput
                            ref='comment'
                            name={'comment'}
                            type={'TextInput'}
                            textAlignVertical={'top'}
                            underlineColorAndroid={'rgba(0,0,0,0)'}
                            style={styles.comment}
                            multiline={true}
                            numberOfLines={2}
                            placeholder={
                                "Extra spice, napkins etc. Inform us if you are alergic to some food."
                            }
                        />
                    </View>
                </View>
                <View style={styles.divider}/>
                <View style={styles.sectionContainer}>
                    <Text style={styles.headerText}>Add another restaurant nearby with $1.95</Text>
                </View>
              {this.state.shoplist_spinner?<ActivityIndicator
                animating={this.state.shoplist_spinner}
                color="#77f"
                size="large"
                style={{backgroundColor:'#fff',paddingTop:10}}
              />:(this.state.near_shops.length>0?
              <ItemTable
                  styles={styles_itemtable}
                  onLearnMore={item => this.onLearnMore(item)}
                  items={this.state.near_shops}
                  current_position={this.props.current_position}
                  horizontal={true}
              />
              :<View style={styles.no_near_shops}><Text>{(this.props.carts.length>=2)?"Maximum two shops to order.":"No near shops."}</Text></View>)}
              </View>
            </Form>
            </ScrollView>
            </View>
            
            <Spinner
              visible={this.state.spinner}
              textContent={'Please wait...'}
              textStyle={{ color: '#fff' }} />
            <FooterCart onCheckout={this.onCheckout}/>
      </View>
    );
  }
}

const width = Dimensions.get("window").width+func.screen_width_offset;
const main_color = "#ff9600";
const secondary_color = "#fff";
const backgroundColor = "#e7e7e7";
const itemTableMarginBottom = 120;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bodyScrollContainer: {
    flex: 1,
    
  },
  bodyContainer: {
    flex:1,
    //height: Dimensions.get("window").height,
  },
  sectionContainer: {
    padding:width*0.015,//10
  },
  headerText: {
      color: "#222",
      marginHorizontal: 7,
      fontSize:width*0.026,//16,
      fontWeight: "500"
  },
  inputText: {
    color: "#222",
    paddingVertical:0,
    paddingHorizontal: 5,
    fontSize:width*0.026,//16,
    fontWeight: "500",
    alignSelf: 'stretch',
  },
  divider: {
    borderTopWidth: 6,
    borderColor: backgroundColor
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  comment: {
    width: Dimensions.get("window").width*0.6,
    marginRight: width*0.015,//10
  },
  no_near_shops: {
    backgroundColor: "#fff",
    alignItems:"center",
    paddingBottom:width*0.015,//10,
    height:Dimensions.get("window").width/2
  },
  textInputContainer: {
    minWidth: Dimensions.get("window").width*0.3,
    maxWidth: Dimensions.get("window").width*0.5,
    justifyContent:"flex-end",
    //flex:1,
    backgroundColor:"#f5f5f5",
    borderRadius:5,
    padding:5,
    height: width*0.06,//35
  },

  tabHeader: {
    //borderWidth: 2,
    borderColor: main_color,
    //borderRadius:10,
    flexDirection: "row",
    justifyContent: "center",
    height: 30,
    width: Dimensions.get("window").width * 0.25,
    //marginHorizontal: Dimensions.get("window").width * 0.02,
    overflow: "hidden"
  },
  tab: {
    height: 30,
    flexDirection: "row",
    width: Dimensions.get("window").width * 0.25,
    justifyContent: "center",
    alignItems: "center",
    //borderLeftWidth: 1,
    //borderRightWidth: 1,
    borderColor: main_color,
  },
  tabActive: {
    backgroundColor:main_color
  },
  tabInactive: {},
  tabText: {
    fontSize: width*0.023,//14,
    textAlign: "center",
    fontWeight: "800"
  },
  tabActiveText: {
    color: secondary_color
  },
  tabInactiveText: {
    color: main_color
  },
  deliveryFeeColor: {
    backgroundColor:"#ff7"
  },
});

const item_width = Dimensions.get('window').width*0.7;//180
const image_height = Dimensions.get('window').width*0.45;//120
const title_height = Dimensions.get('window').width*0.1;//30
const item_height = Dimensions.get('window').width*0.55;//148
const styles_itemtable = StyleSheet.create({
    container: {
      flex:1,
      //height: 148,//Dimensions.get("window").height * 0.5,
      backgroundColor: "#fff",
    },
    scrollview: {
      //flex: 1
    },
    product_list: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-around",
      marginBottom:itemTableMarginBottom,
    },
    touchablehighlight: {
      marginHorizontal: 7,
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
//export default ConfirmOrder;
export default connect(mapStateToProps, mapDispatchToProps)(ConfirmOrder);
