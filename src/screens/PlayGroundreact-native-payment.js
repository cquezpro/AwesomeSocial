import React,{Component} from "react";
import { Image,StyleSheet, Text, View, TouchableHighlight } from "react-native";
import PhotoUpload from 'react-native-photo-upload';
import * as func from "../func/func";

class PlayGround extends Component {
  constructor() {
    super();
  }

  onPress = () => {
    let METHOD_DATA = [{
      supportedMethods: ['apple-pay'],
      data: {
        merchantIdentifier: 'merchant.org.reactjs.native.example.CodingBabyApp',
        supportedNetworks: ['visa', 'mastercard', 'amex'],
        countryCode: 'AU',
        currencyCode: 'AUD'
      }
    }];
    let DETAILS = {
      id: 'basic-example',
      displayItems: [
        {
          label: 'Qooka',
          amount: { currency: 'AUD', value: '0.01' }
        }
      ],
      total: {
        label: 'Qooka',
        amount: { currency: 'AUD', value: '0.01' }
      }
    };
    const paymentRequest = new PaymentRequest(METHOD_DATA, DETAILS);
    paymentRequest.show();
  }

  onQuit = () => {
    paymentRequest.abort();
  }

  render() { 
    return (
      <View style={styles.container}>
        <TouchableHighlight hitSlop={{top: 10, left: 10, bottom: 10, right: 10}} onPress={func.debounce(this.onPress)}>
          <Text>点击测试</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default PlayGround;
