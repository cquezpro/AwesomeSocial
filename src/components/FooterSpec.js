import React, { Component } from "react";
import { StyleSheet, Text, View, ScrollView, Alert,SectionList, TouchableHighlight, Dimensions, Platform, Image, FlatList } from "react-native";
import { Icon } from "react-native-elements";
import { connect } from "react-redux";
import MapView from 'react-native-maps';
import * as func from "../func/func";

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
    onExitChooseSpec: () => {
        dispatch({
            type: "EXIT_CHOOSE_SPEC",
            payload: {}
        })
    },
});

class FooterSpec extends Component {
  constructor(props) {
    super(props);
    this.state = {
        shopId: props.shopId,
        specAmount: {},
        singleSelect: {}
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

  // componentDidMount = () => {
  //   if(this.props.chooseSpec)
  //     console.warn(this.props.chooseSpec.specifications);
  // }

  _renderSectionHeader = (section) => {
    return <View style={styles.sectionTitle}>
      <Text style={styles.sectionTitleText}>{section.title}</Text>
    </View>;
  }

  _renderSectionBody = (item, index, section) => {
    return <View key={index} style={styles.sectionBody}>
        <View style={styles.sectionName}>
          <Text style={styles.sectionNameText}>{item.name}</Text>
        </View>
        <View style={styles.sectionPrice}>
          <Text style={styles.sectionNameText}>${func.price(item.price)}</Text>
            {this._renderAmountButton(item,section.id)}
      </View>
    </View>;
  }

  getSpecAmount = (id) => {
      if(this.state.specAmount[id])
        return this.state.specAmount[id];
    return 0;
  }

  onChangeProductAmount = (id,isPlus,section_id) => {
    let specAmount = Object.assign({},this.state.specAmount);
    if(this.props.specSingleSelect[section_id]){
      this.props.specSingleSelect[section_id].map((v)=>{
        if(v===id)
          specAmount[v] = isPlus?1:0;
        else
          specAmount[v] = 0;
      });
    }else{
      if(this.state.specAmount[id])
        isPlus?specAmount[id]++:specAmount[id]--;
      else if(isPlus)
          specAmount[id] = 1;
      }
    this.mySetState({
        specAmount: specAmount
    });
  }

  checkSpec = () => {
    for(let i = 0;i<this.props.chooseSpec.specifications.length;i++){
      let v = this.props.chooseSpec.specifications[i];
      let amount = 0;
      v.data.map((v2,index)=>{
        amount += this.getSpecAmount(v2.id);
      });
      if(amount<v.min_select){
        Alert.alert("Please choose at least "+v.min_select+" "+v.title);
        return false;
      }
      if(v.max_select>0&&amount>v.max_select){
        Alert.alert("Please choose no more than "+v.max_select+" "+v.title);
        return false;
      }
    }
    return true;
  }

  onAddToCart = () => {
    if(!this.checkSpec())
      return;
    let product = Object.assign({},this.props.chooseSpec,{
      specifications:this.props.chooseSpec.specifications.map((val1, index) =>{
        return Object.assign({},val1,{  
          data: val1.data.map ((val2, index) => {
            return Object.assign({},val2, {
              amount: this.state.specAmount[val2.id]?this.state.specAmount[val2.id]:0
            });
          })
        });
      })
    });
    this.props.onAddProduct(this.props.shopId,this.props.shopName,this.props.shopPhone,this.props.location,product);
    this.mySetState({
      specAmount: {}
    });
  }
  
  _renderAmountButton = (item,section_id) => {
    return <View style={styles.buttonContainer}> 
        <TouchableHighlight style={styles.TouchableHighlightPadding} hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
          activeOpacity={1} underlayColor={null}
          onPress={()=>this.onChangeProductAmount(item.id,false,section_id)}
        >
            <View style={styles.sectionButton}>
                <Text style={styles.sectionButtonText}>-</Text>
            </View>
        </TouchableHighlight>
        <Text style={styles.amountText}>{this.getSpecAmount(item.id)}</Text>
        <TouchableHighlight style={styles.TouchableHighlightPadding} hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
          activeOpacity={1} underlayColor={null}
          onPress={()=>this.onChangeProductAmount(item.id,true,section_id)}
        >
            <View style={styles.sectionButton}>
                <Text style={styles.sectionButtonText}>+</Text>
            </View>
        </TouchableHighlight>
    </View>
  }

  render() {
    if(!this.props.chooseSpec)
    return [];
    else
    return (
        <View style={styles.container}>
          <TouchableHighlight hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
            activeOpacity={1} underlayColor={null} onPress={func.debounce(()=>this.props.onExitChooseSpec())}>
              <View  style={styles.shadowContainer}/>
          </TouchableHighlight>
            <View style={styles.cartContainer}>
                <View style={styles.cartHeader}>
                    <Text style={styles.cartHeaderText}>Choose</Text>
                </View>
                <TouchableHighlight style={styles.cartHeaderButton} hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
                  activeOpacity={1} underlayColor={null} onPress={func.debounce(()=>this.props.onExitChooseSpec())}>
                    
                        <Icon name="clear"/>
                    
                </TouchableHighlight>
                <View style={styles.sectionBody2}>
                    <Image
                        style={styles.sectionImage2}
                        source={{uri: func.image_url + this.props.chooseSpec.image}}
                        resizeMode="cover"
                    />
                    <View style={styles.sectionBodyInfo2}>
                        <View style={styles.sectionName2}>
                            <Text style={styles.sectionNameTitle2}>{this.props.chooseSpec.name}</Text>
                        </View>
                        <View style={styles.sectionPrice2}>
                            <Text style={styles.sectionNameText2}>{this.props.chooseSpec.spec_comment}</Text>
                        </View>
                    </View>
                </View>
                <ScrollView style={styles.cartItemsContainer}> 
                    <View style={styles.cartItems}>
                        <SectionList
                            contentContainerStyle={styles.sectionContainer}
                            renderSectionHeader={({section}) => this._renderSectionHeader(section)}
                            renderItem={({item, index, section}) => this._renderSectionBody(item, index, section)}
                            sections={this.props.chooseSpec.specifications}
                            keyExtractor={(item, index) => item + index}
                        />
                    </View>
                </ScrollView>
            </View>
            <TouchableHighlight hitSlop={{top: 10, left: 10, bottom: 10, right: 10}} 
              activeOpacity={1} underlayColor={null}
              style={[styles.button,styles.button2]}
              onPress={func.debounce(()=>this.onAddToCart())}
            >
            <View style={styles.buttonView}>
                <Text style={styles.buttonText}>Add to Cart</Text>
            </View>
            </TouchableHighlight>
        </View>
    );
  }
}
const width = Dimensions.get("window").width+func.screen_width_offset;
const title_height = width*0.05;//35;
const body_height = width*0.12;//75;
const footer_height = 35;
const main_color = "#ff9600";
const secondary_color = "#fff";
const styles = StyleSheet.create({
  container: {
    zIndex: 10,
    position: "absolute",
    bottom:0,
    width: Dimensions.get("window").width,
    //height: footer_height,
    //backgroundColor: main_color,
    //flexDirection: "row",
  },
  cartContainer: {
    height: Dimensions.get("window").height*0.75,
    //position: "absolute",
    width: Dimensions.get("window").width,
    //bottom: footer_height,
  },
  shadowContainer:{
    backgroundColor: "rgba(0,0,0,0.5)",
    height: Dimensions.get("window").height*0.25,
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
    zIndex:6,
    height: footer_height,
    width: footer_height+20,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: width*0.03,//15,
    //top: -footer_height
  },
  cartItemsContainer: {
    backgroundColor: "rgba(255,255,255,0.95)"
  },
  cartItems: {
    flex:1,
    width: Dimensions.get("window").width,
  },
  button: {
    height: footer_height,
  },
  button2: {
    flex: 1,
    backgroundColor: "#ffd304",
    justifyContent: "center",
    alignItems: "center"
  },
  buttonView: {
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "900"
  },
  sectionBody2: {
    backgroundColor: "rgba(255,255,255,0.95)",
    // height: body_height+50,
    width: Dimensions.get("window").width,
    flexDirection: "row",
    padding: 10,
  },
  sectionImage2: {
    width: 70,
    height: 50
  },
  sectionBodyInfo2: {
    //flex: 1,
    paddingLeft: 7,
  },
  sectionName2: {
    //flex: 1,
    width: Dimensions.get("window").width - width*0.2,
  },
  sectionNameTitle2: {
    //flex:1,
    fontSize:width*0.03,//17,
    fontWeight: "500",
  },
  sectionPrice2: {
    width: Dimensions.get("window").width - width*0.2,//image width
    marginTop: 7,
  },
  sectionNameText2: {
    //flex:1,
    fontSize:width*0.023,//14,
  },
  sectionContainer: {
    paddingBottom: 200
  },

  sectionTitle: {
    height: title_height,
    backgroundColor: "#fff",
    padding: 5,
  },
  sectionTitleText: {
    fontSize:width*0.027,//16,
    fontWeight: 'bold'
  },
  sectionBody: {
    width: Dimensions.get("window").width,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    alignItems: "center",
  },
  sectionName: {
    width: Dimensions.get("window").width/2,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: width*0.01,
  },
  sectionNameText: {
    fontSize:width*0.025,//14,
  },
  sectionPrice: {
    alignItems: "center",
    flexDirection: "row",
    paddingRight: width*0.023,//14,
  },
  buttonContainer: {
    alignItems: "center",
    flexDirection: "row"
  },
  sectionButton: {
    marginLeft: 5,
    backgroundColor: main_color,
    borderRadius: 15
  },
  sectionButtonText: {
    paddingVertical: 4,
    paddingHorizontal:8,
    fontSize:11,
    color:"#fff"
  },
  amountText: {
    paddingHorizontal:3,
    fontSize: width*0.027,//16,
  },
  TouchableHighlightPadding: {
    padding:5
  }
});

//export default FooterSpec;
export default connect(mapStateToProps, mapDispatchToProps)(FooterSpec);
