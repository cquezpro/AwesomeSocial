import React, { Component,createRef } from "react";
import { StyleSheet, Text, View, TouchableHighlight, Dimensions, Platform, SectionList, Image } from "react-native";
import { TabViewAnimated, TabBar, SceneMap } from "react-native-tab-view";
import { connect } from "react-redux";
import TabHeader from "../components/TabHeader";
import * as func from "../func/func";
import AsyncImage from "./AsyncImage";

const initialLayout = {
  height: 0,
  width: Dimensions.get("window").width
};
const mapStateToProps = state => ({ ...state.ShoppingCart });

const mapDispatchToProps = dispatch => ({
  onAddProduct: (shop_id,shop_name,shop_phone, location, product) => {
    dispatch({
        type: "ADD_PRODUCT",
        payload: {
          shop_id:shop_id, 
          shop_name:shop_name, 
          shop_phone:shop_phone, 
          location: location, 
          product:{...product,amount:1},
        }
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
  },
  onChooseSpec: (data) => {
    dispatch({
        type: "CHOOSE_SPEC",
        payload: data
    })
  }
});
class ShopMenu extends Component {
  constructor(props) {
    super(props);
    this.sectionRef = createRef();
    //this._changeIndex = this._changeIndex.bind(this);
    this.state = {
      index: 0,
      routes: [],
      data: [],
    };
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

  componentWillReceiveProps = (nextProps) => {
    let routes = [];
    for (let i = 0; i < nextProps.data.length; i++) {
      value = nextProps.data[i];
      routes.push({
        index: i,
        key: i,
        title: value.title
      });
    }
    this.mySetState({
      routes: routes,
      data: nextProps.data
    });
  }

  _changeIndex = index => { 
    this.sectionRef.current.scrollToLocation({
      sectionIndex:index,
      itemIndex:0,
      viewOffset: title_height
    });
    //this.scrollView.scrollTo({y:300});
    this.mySetState({ index });
  }

  _handleScroll = event => {
    var y = event.nativeEvent.contentOffset.y;
    for(var i=0; i<this.state.data.length;i++){
      y -= title_height+body_height*this.state.data[i].data.length;
      if(y<0||(i==this.state.data.length-1))
        break;
    }
    this.mySetState({
      index: i
    });
  }

  _renderMenu = () => {
    return <SectionList
      ref = {this.sectionRef}
      onScrollEndDrag={this._handleScroll}
      contentContainerStyle={styles.sectionContainer}
      renderSectionHeader={({section: {title}}) => this._renderSectionHeader(title)}
      renderItem={({item, index, section}) => this._renderSectionBody(item, index, section)}
      sections={this.state.data}
      keyExtractor={(item, index) => item + index}
      onScrollToIndexFailed={()=>{}}
      getItemLayout={this._getItemLayout}
    />
  }
  _getItemLayout = (data, index) => {
    var type = 0; //0header 1row 2footer
    let offset = 0;
    var i = index;
    {
      for(var j=0; j<data.length;j++){
        if(i==0){
          type = 0;
          break;
        }else{
          i--;
          offset+=title_height;
        }
        if(i<data[j]['data'].length){
          type = 1;
          offset+=i*body_height;
          break;
        }else{
          i-=data[j]['data'].length;
          offset+=data[j]['data'].length*body_height;
          if(i==0){
            type=2;
            break;
          }else{
            i--;
          }
        }
      }
    }
    var length = type===0?title_height:type===1?body_height:0;
    return(
      {length: length, offset: offset, index}
    )
  }

  _renderSectionHeader = (title) => {
    return <View style={styles.sectionTitle}>
      <Text style={styles.sectionTitleText}>{title}</Text>
    </View>;
  }

  _renderSectionBody = (item, index, section) => {
    let image = item.image?<AsyncImage
      style={styles.sectionImage}
      source={{uri: func.image_url + item.image}}
      placeholderColor={"#eee"}
    />:<Image 
      style={styles.sectionImage}
      source={require("../img/cuisine.jpg")}/>;
    return <View key={index} style={styles.sectionBody}>
      {image}
      <View style={styles.sectionBodyInfo}>
        <View style={styles.sectionName}>
          <Text style={styles.sectionNameText}>{item.name}</Text>
        </View>
        <View style={styles.sectionName}>
          <Text style={styles.sectionCommentText}>{item.spec_comment}</Text>
        </View>
        <View style={styles.sectionPrice}>
          <Text style={styles.sectionPriceText}>${func.price(item.price)}</Text>
          {(item.specifications.length>0)?
            this._renderSpecButton(item)
            :this._renderAmountButton(item)}
        </View>
      </View>
    </View>;
  }

  chooseSpec = (item) => {
    this.props.onChooseSpec(item);
  }

  _renderSpecButton = (item) => {
      return <TouchableHighlight hitSlop={{top: 15, left: 15, bottom: 15, right: 15}}
        activeOpacity={1} underlayColor={null} onPress={func.debounce(()=>this.chooseSpec(item))}>
          <View style={styles.sectionButton}>
            <Text style={styles.sectionButtonText}>Choose</Text>
          </View>
        </TouchableHighlight>
  }

  getCartItems = (datas) => {
    for(var i=0; i< datas.length; i++)
        if(datas[i].shop_id == this.props.shopId)
            return datas[i].data;
    return [];
  } 
  _renderAmountButton = (item) => {
    let id = item.id;
    let amount = -1;
    var unique_id =0;
    let items_in_cart = this.getCartItems(this.props.carts);

    for(let i=0; i<items_in_cart.length; i++) {
      if(items_in_cart[i].id==id){
        amount = items_in_cart[i].amount;
        unique_id = items_in_cart[i].unique_id;
      }
    }
    if(amount>0)
      return <View style={styles.buttonContainer}> 
          <TouchableHighlight hitSlop={{top: 15, left: 15, bottom: 15, right: 15}}
            activeOpacity={1} underlayColor={null}
              onPress={()=>this.props.onChangeProductAmount(this.props.shopId,unique_id,false)}
          >
              <View style={styles.sectionButton}>
                  <Text style={styles.sectionButtonText}>-</Text>
              </View>
          </TouchableHighlight>
          <Text style={styles.amountText}>{amount}</Text>
          <TouchableHighlight hitSlop={{top: 15, left: 15, bottom: 15, right: 15}}
            activeOpacity={1} underlayColor={null}
              onPress={()=>this.props.onChangeProductAmount(this.props.shopId,unique_id,true)}
          >
              <View style={styles.sectionButton}>
                  <Text style={styles.sectionButtonText}>+</Text>
              </View>
          </TouchableHighlight>
        </View>
      else
        return <View style={styles.buttonContainer}>
          <TouchableHighlight hitSlop={{top: 15, left: 15, bottom: 15, right: 15}}
            activeOpacity={1} underlayColor={null}
              onPress={()=>
                (amount==0)?
                  this.props.onChangeProductAmount(this.props.shopId,unique_id,true)
                  :this.props.onAddProduct(this.props.shopId,this.props.shopName,this.props.shopPhone,this.props.location,item)}
          >
              <View style={styles.sectionButton}>
                  <Text style={styles.sectionButtonText}>+</Text>
              </View>
          </TouchableHighlight>
        </View>
    
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.menuContainer}>
          <TabHeader
            scroll={true}
            navigationState={this.state}
            styles={styles_tabheader}
            _changeIndex={i => this._changeIndex(i)}
          />
          {this._renderMenu()}
        </View>
      </View>
    );
  }
}

const width = Dimensions.get("window").width+func.screen_width_offset;
const title_height = width*0.05;//35;
const body_height = width*0.19;//130;
const main_color = "#ff9600";
const secondary_color = "#fff";
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuContainer: {
    //flex:1,
    justifyContent: "flex-start",
    height: Dimensions.get("window").height-Dimensions.get("window").width/2-38,
    //flexDirection: "row",
  },
  sectionContainer: {
    paddingBottom: 200
  },
  sectionTitle: {
    height: title_height,
    backgroundColor: "#fff",
    //padding: 7,
    justifyContent: "center"
  },
  sectionTitleText: {
    fontSize:width*0.03,//17,
    fontWeight: '800'
  },
  sectionBody: {
    height: body_height,
    //flex: 1,
    flexDirection: "row",
    padding: 10,
  },
  sectionImage: {
    width: width*0.18,//110,
    height: width*0.16,//100
  },
  sectionBodyInfo: {
    //flex: 1,
  },
  sectionName: {
    //flex: 1,
    paddingLeft: 7,
    //paddingTop: 2,
    width:Dimensions.get("window").width - width*0.23,
  },
  sectionNameText: {
    fontSize:width*0.023,//13,
    fontWeight:"800",
  },
  sectionCommentText: {
    fontSize:width*0.022,//12,
    color: "#777"
  },
  sectionPrice: {
    //flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 7,
  },
  sectionPriceText: {
    fontSize:width*0.026,//15,
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
  sectionButtonText: {
    paddingVertical: 4,
    paddingHorizontal:8,
    fontSize:width*0.023,//13,
    color:"#fff"
  },
  amountText: {
    paddingHorizontal:3,
    fontSize: width*0.028,//16
  },
  TouchableHighlightPadding: {
    padding:5,
  }
});
const styles_tabheader = StyleSheet.create({
  scrollContainer: {
    height:Dimensions.get("window").height * 0.07,
  },
  tabHeader: {
    height:Dimensions.get("window").height * 0.07,
    flexDirection: "row",
    //justifyContent: "flex-start",
    backgroundColor: "#f7f7f7"
  },
  tab: {
    //width: Dimensions.get("window").width * 0.23,
    height: Dimensions.get("window").height * 0.07,
    flexDirection: "column",
    justifyContent: "center",
    paddingHorizontal:width*0.026,//15
  },
  tabActive: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    borderTopWidth: 5,
    borderTopColor: main_color
  },
  tabInactive: {
    backgroundColor: "#f7f7f7",
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: "#eee"
  },
  tabText: {
    fontSize: width*0.025,//14,
    textAlign: "center",
    fontWeight: "600"
  },
  tabActiveText: {
    color: main_color
  },
  tabInactiveText: {
    color: "#444"
  },
});

//export default ShopMenu;
export default connect(mapStateToProps, mapDispatchToProps)(ShopMenu);
