import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ImageBackground,
  Dimensions,
  TouchableHighlight,
  Alert,
  ActivityIndicator,
} from "react-native";
import Closer from "../components/Closer";
import * as func from "../func/func";

class ContactUs extends Component {
  constructor() {
    super();
    this.state = {
    };
  }

  static navigationOptions = ({ navigation }) => ({
    header: null,
    gesturesEnabled: false,
  });

  render() {
    return (
      <ImageBackground style={styles.imageBackground} source={require("../img/bg3.jpeg")}>
        <Closer color={"#222"} onPress={func.debounce(()=>this.props.navigation.goBack())}/>
        <View style={styles.section}>
          <Image
            style={styles.image}
            source={require("../img/app_icon_nbg.png")}
          />
        </View>
        <View style={styles.sectionMid}>
          <View style={styles.title}>
            <Text style={styles.titleText}>Contact Us</Text>
          </View>
          <View style={styles.user_body}>
            <View style={styles.buttons}>
              <View style={styles.button}>
                <Image
                  style={styles.contactImage}
                  source={require("../img/emailContact.png")}
                />
                <Text style={styles.buttonText}>  Email:  qooka.main@gmail.com</Text>
              </View>
              <View style={styles.button}>
                <Image
                  style={styles.contactImage}
                  source={require("../img/phoneContact.png")}
                />
                <Text style={styles.buttonText}>  Phone:  0403 140 455</Text>
              </View>
              <View style={styles.button}>
                <Image
                  style={styles.contactImage}
                  source={require("../img/wechatContact.png")}
                />
                <Text style={styles.buttonText}>  Wechat:  qookaau</Text>
              </View>
               
            </View>
          </View>
        </View>
        <View style={styles.section}>
        </View>
      </ImageBackground>

    );
  }
}

const main_color = "#ff9600";
const styles = StyleSheet.create({
  imageBackground: {
      flex:1,
  },
  section: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop:Platform.OS === "ios" && Dimensions.get("window").height === 812 ? 24 : 0+20,
  },
  sectionMid: {
    flex:2
  },
  image: {
    height:75,
    width:75
  },
  title: {
    height: 50,
    paddingLeft: Dimensions.get('window').width/8
  },
  titleText: {
    color: main_color,
    fontSize: 18,
    fontWeight: "600"
  },
  user_body: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttons: {
    flex:1,
    alignItems: "flex-start",
  },
  button: {
    flex:1,
    maxWidth: Dimensions.get('window').width/1.2,
    //height: 36,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row"
  },
  contactImage: {
    height:25,
    width:25,
    alignSelf: "center"
  },
  buttonText: {
    fontSize: 15,
    color: "#222",
    alignSelf: "center"
  },
  commentText:{
    fontSize:10,
    color:"#222",
    alignSelf:"flex-start"
  },
  deliveryfeeText:{
    fontSize:13,
    color:"#222",
    alignSelf:"flex-start"
  },
});

//export default connect(mapStateToProps, mapDispatchToProps)(UserSettings);
export default ContactUs;
