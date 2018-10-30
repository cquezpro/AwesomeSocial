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
  StatusBar,
  Alert,
} from "react-native";
import { List, ListItem } from "react-native-elements";
import Icon from "../components/Icon";
import { connect } from "react-redux";
import * as func from "../func/func";

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
  onGetUserDetail : (payload) => {
    dispatch({
        type: "USER_DETAIL",
        payload: payload
    });
  }
});

var t = require("tcomb-form-native");
var password = t.refinement(t.String, function (n) { return n.length >= 6; });
var Form = t.form.Form;
var type = t.struct({
    username: t.String,
    email: t.String,
    password: t.maybe(password),
    passwordAgain: t.maybe(password)
});

class UserPanels extends Component {
  constructor() {
    super();
    this.state = {
        username: "",
        email: "",
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

  componentWillMount() {
    func
    .callApi("get", "api/user", {}, this.props.access_token)
    .then(response => {
        this.mySetState(response.data);
    })
    .catch(error => {
        //console.warn(error.response.data.message);
    });
  }
  componentDidMount() {
    this.componentMounted = true;
    //this.refs.form.getComponent('username').refs.input.focus();
  }

  static navigationOptions = ({ navigation }) => ({
    header: null,
    gesturesEnabled: false,
    mode: Platform.OS === "ios" ? "modal" : "card",
  });
  
  renderUserHeader = () => {
    let username = this.props.username?
      this.props.username:
      (this.props.email?this.props.email:this.props.phone);
    return (
        <View style={styles.imageContainer}>
            <Text style={styles.headerText}>User Center</Text>
            <Image
                style={styles.image}
                source={{uri:func.image_url + this.props.image}}
                defaultSource={require("../img/Portrait_Placeholder.png")}
                />
            <Text style={styles.usernameText}>{username}</Text>
        </View>
    );
  };

  render() {
    return (
        <ImageBackground style={styles.imageBackground} source={require("../img/bg1.jpg")}>
        <ScrollView ref={(c) => { this._scrollView = c; }} style={styles.container}>
          
            {this.renderUserHeader()}
            <View style={styles.user_body}>
              <View style={styles.buttons}>
                <TouchableHighlight
                    activeOpacity={1} underlayColor={null}
                    style={styles.button}
                    onPress={func.debounce(()=>this.props.navigate("OrderStacks"))}
                >
                    <Text style={styles.buttonText}>>    My Orders</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    activeOpacity={1} underlayColor={null}
                    style={styles.button}
                    onPress={func.debounce(()=>this.props.navigate("UserSettings"))}
                >
                    <Text style={styles.buttonText}>>    User Settings</Text>
                </TouchableHighlight>


                <TouchableHighlight
                    activeOpacity={1} underlayColor={null}
                    style={styles.button}
                    onPress={func.debounce(()=>this.props.navigate("ContactUs"))}
                >
                    <Text style={styles.buttonText}>>    Contact Us</Text>
                </TouchableHighlight>


                <TouchableHighlight
                    activeOpacity={1} underlayColor={null}
                    style={styles.button}
                    onPress={func.debounce(()=>this.props.navigate("Logout"))}
                >
                    <Text style={styles.buttonText}>>    Logout</Text>
                </TouchableHighlight>
              </View>
            </View>
          </ScrollView>
        </ImageBackground>

    );
  }
}

const main_color = "#ff9600";
const styles = StyleSheet.create({
  imageBackground: {
      flex:1,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      paddingTop:Platform.OS === "ios" && Dimensions.get("window").height === 812 ? 24 : 0,
  },
  container: {
    flex: 1,
  },
  user_header: {
    alignItems: "center",
    backgroundColor: "#fff"
  },
  user_body: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  buttons: {
    alignItems: "flex-start",
  },
  button: {
    height: 36,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    alignSelf: "center"
  },
  headerText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
    marginBottom:10
  },
  usernameText:{
    fontSize: 20,
    fontWeight: "600",
    color: "#fff"
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    height:Dimensions.get('window').width/1.7,
  },
  image: {
    borderColor: "#fff",
    borderRadius:50,
    height: 100,
    width: 100
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(UserPanels);
//export default UserSettings;
