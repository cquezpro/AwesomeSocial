import React,{Component} from "react";
import { StyleSheet, Text, View, TextInput,Dimensions, ScrollView } from "react-native";
import Header from "../components/Header";
import FooterCart from "../components/FooterCart";
import * as func from "../func/func";

class Order extends Component {
  constructor() {
    super();
    this.state = {
      item: []
    };
  }

  componentWillMount() {
  }
  
  onBack = () => {
    this.props.navigation.goBack();
  };

  static navigationOptions = ({navigation}) => ({
    header: null
  });

  _renderSpecifications = (specs) => {
    let result = [];
    if(specs.length>0){
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
          result.push(<Text style={styles.subText} key={i}>{spec}</Text>);
      }
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

  render() {
    let item = this.props.navigation.state.params;
    let shops = JSON.parse(item.ordered_items).map((val,index)=>{
        let cuisines = [];
        val.data.map((val2,index2)=>{
          cuisines.push(
            <View key={index2} style={[styles.rowContainer,styles.indent]}>
              <View style={styles.itemContainer}>
                <Text style={styles.text}>{val2.name}</Text>
                {this._renderSpecifications(val2.specifications)}
              </View>
              <View style={[styles.priceContainer,styles.right]}>
                <Text style={styles.text}>*{val2.amount}</Text>
              </View>
              <View style={[styles.priceContainer,styles.right]}>
                <Text style={styles.text}>${func.price(this._renderPrice(val2.price,val2.specifications))}</Text>
              </View>
            </View>
          );
        });
        return <View key={index}>
          <View style={styles.rowContainer}>
            <Text style={styles.mainText}>{val.title/*+'('+val.phone+')'*/}</Text>
          </View>
          {cuisines}
        </View>;
    });
    return (
        <View style={styles.container}>
            <Header
                title = "Order Detail"
                onBack={() => this.onBack()}
                icons={[]}
            />
            <ScrollView>
            <View style={styles.subContainer}>
              <View style={styles.rowContainer}>
                <Text style={styles.mainText}>Order Id:{item.transaction_id}</Text>
              </View>
              <View style={styles.rowContainer}>
                <View style={styles.valueContainer}>
                  <Text style={styles.text}>Payment Type:</Text>
                  <Text style={styles.subText}>{func.payment_type(item.payment_type)}</Text>
                </View>
                <View style={styles.valueContainer}>
                  <Text style={styles.text}>Order Time:</Text>
                  <Text style={styles.subText}>{item.created_at}</Text>
                </View>
              </View>
              {/*<View style={styles.rowContainer}>
                <View style={styles.valueContainer}>
                  <Text style={styles.text}>Phone:</Text>
                  <Text style={styles.subText}>{item.phone}</Text>
                </View>
                <View style={styles.valueContainer}>
                  <Text style={styles.text}>Order Status:</Text>
                  <Text style={styles.subText}>{func.status(item.status)}</Text>
                </View>
    </View>*/}
              <View style={styles.rowContainer}>
                <View style={styles.valueContainer}>
                  <Text style={styles.text}>Delivery Time:</Text>
                  <Text style={styles.subText}>{item.delivery_time}</Text>
                </View>
              </View>
              <View style={styles.rowContainer}>
                <View style={styles.valueContainer}>
                  <Text style={styles.text}>Pick up address:</Text>
                  <Text style={styles.subText}>{item.address}</Text>
                </View>
              </View>
              <View style={styles.rowContainer}>
                <View style={styles.valueContainer}>
                  <Text style={styles.text}>Comment:</Text>
                  <Text style={styles.subText}>{item.comment}</Text>
                </View>
              </View>
            </View>
            <View style={styles.subContainer}>
              {shops}
              <View style={styles.divider}/>
              <View style={styles.rowContainer}>
                <View style={styles.valueContainer}>
                  <Text style={styles.text}>Delivery fee:</Text>
                </View>
                <View style={[styles.valueContainer,styles.right]}>
                  <Text style={styles.text}>${func.price(item.shipment_fee)}</Text>
                </View>
              </View>
              <View style={styles.rowContainer}>
                <View style={styles.valueContainer}>
                  <Text style={styles.text}>Total:</Text>
                </View>
                <View style={[styles.valueContainer,styles.right]}>
                  <Text style={styles.text}>${func.price(item.total+item.shipment_fee)}</Text>
                </View>
              </View>
            </View>

            </ScrollView>
        </View>
    );
  }
}

const backgroundColor = "#e7e7e7";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  subContainer: {
    flex: 1,
    margin:15,
    padding:15,
    backgroundColor:backgroundColor,
    borderRadius: 25
  },
  rowContainer: {
    flex: 1,
    flexDirection: "row",
    marginVertical:3
  },
  valueContainer: {
    flex: 1
  },
  mainText: {
    fontSize:15
  },
  text: {
    fontSize:13
  },
  subText: {
    fontSize:13,
    color:"#666"
  },
  right: {
    alignItems:"flex-end",
    justifyContent:"center"
  },
  divider: {
    borderWidth:1,
    marginHorizontal:0,
    marginVertical: 10
  },
  itemContainer: {
    flex:3
  },
  priceContainer: {
    flex:1
  },
  indent: {
    marginLeft: 20
  }
});

export default Order;
//export default connect(mapStateToProps, mapDispatchToProps)(ConfirmOrder);
