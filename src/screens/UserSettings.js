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
  ActivityIndicator,
} from "react-native";
import { List, ListItem } from "react-native-elements";
import Icon from "../components/Icon";
import { connect } from "react-redux";
import Spinner from 'react-native-loading-spinner-overlay';
import * as func from "../func/func";
import Closer from "../components/Closer";
import PhotoUpload from 'react-native-photo-upload';

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
    phone: t.String,
    password: t.maybe(password),
    passwordAgain: t.maybe(password)
});

class UserSettings extends Component {
  constructor() {
    super();
    this.state = {
        spinner: false,
        username: "",
        email: "",
        phone: "",
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

 
  options = {
    fields: {
      username: {
        onFocus:()=>{this._scrollView.scrollTo({y:100})},
        onEndEditing:()=>{this._scrollView.scrollTo({y:0})},
        label: "Username"/*"用户名"*/,
        placeholder: "Enter Username"/*"输入用户名"*/,
        error:"Username is invalid"/*"用户名不可用"*/,
        maxLength:15,
        autoCapitalize: 'none'
      },
      email: {
        onFocus:()=>{this._scrollView.scrollTo({y:140})},
        onEndEditing:()=>{this._scrollView.scrollTo({y:0})},
        label: "Email"/*"邮箱"*/,
        //editable: false,
        keyboardType: "email-address",
        error: "Email is invalid"/*"电子邮箱不可用"*/,
        placeholder: "Enter Email"/*"输入邮箱"*/,
        autoCapitalize: 'none'
      },
      phone: {
        onFocus:()=>{this._scrollView.scrollTo({y:140})},
        onEndEditing:()=>{this._scrollView.scrollTo({y:0})},
        label: "Phone"/*"电话"*/,
        editable: false,
        error: "Phone is invalid"/*"电话不可用"*/,
        placeholder: "Enter Phone"/*"输入邮箱"*/,
        autoCapitalize: 'none'
      },
      password: {
        onFocus:()=>{this._scrollView.scrollTo({y:180})},
        onEndEditing:()=>{this._scrollView.scrollTo({y:0})},
        label: "Password(Enter to change password)"/*"密码(修改密码时填写)"*/,
        placeholder: "Enter Password"/*"输入密码"*/,
        maxLength: 15,
        minLength: 6,
        secureTextEntry: true,
        error: "Password invalid"/*"密码不正确"*/,
      },
      passwordAgain: {
        onFocus:()=>{this._scrollView.scrollTo({y:220})},
        onEndEditing:()=>{this._scrollView.scrollTo({y:0})},
        label: "Confirm Password"/*"确认密码"*/,
        placeholder: "Confirm Password"/*"再次输入密码"*/,
        maxLength: 15,
        minLength: 6,
        secureTextEntry: true,
        error: "Password invalid"/*"密码不正确"*/,
      }
    }
  };
  componentDidMount() {
    this.componentMounted = true;
    func
    .callApi("get", "api/user", {}, this.props.access_token)
    .then(response => {
        this.mySetState(response.data);
    })
    .catch(error => {
        //console.warn(error.response.data.message);
    });
  }

  static navigationOptions = ({ navigation }) => ({
    header: null,
    gesturesEnabled: false,
  });

  onPress = () => {
    var value = this.refs.form.getValue();
    if (value) {
      if(value.password!==value.passwordAgain)
        Alert.alert("Two passwords not match"/*"两次密码输入不一致。"*/);
      else{
        this.mySetState({ spinner: true});
        let param = value.password?{
            username:value.username,
            email:value.email,
            password:value.password
        }:{
            username:value.username,
            email:value.email,
        };
        
        setTimeout(async () => {
          try {
            const res = await func.callApi("post", "api/user_settings",
            param, this.props.access_token);
            if (res.err) throw res.err;
            this.props.onGetUserDetail({
              ...res.data
            });
            this.mySetState({
              spinner: false,
            });
            setTimeout(() => {
                Alert.alert("Edit succeeded"/*'修改成功。'*/);
            }, 100);
    
          } catch (err) {
            this.mySetState({ spinner: false });
            setTimeout(() => {
              Alert.alert('Edit failed.'+err.message);
            }, 100);
          }
        }, 100);

      }
    }
  };

  onPhotoSelect = (avatar) =>{
    if (avatar) {
        this.mySetState({ spinner: true});
        setTimeout(async () => {
          try {
            const res = await func.callApi("post", "api/upload_image",
            {image:avatar}, this.props.access_token);
            if (res.err) throw res.err;
            this.props.onGetUserDetail({
              ...res.data
            });
            this.mySetState({
              spinner: false,
            });
            setTimeout(() => {
                Alert.alert("Edit succeeded"/*'修改成功。'*/);
            }, 100);
          } catch (err) {
            this.mySetState({ spinner: false });
            setTimeout(() => {
              Alert.alert('Edit failed.'+err.message);
            }, 100);
          }
        }, 100);
    }
  }

  onStart = () => {
    this.mySetState({ spinner: true});
  }
  onStop = () => {
    this.mySetState({ spinner: false});
  }

  renderUserHeader = () => {
    let username = this.props.username?
      this.props.username:
      (this.props.email?this.props.email:this.props.phone);
    return (
        <View style={styles.imageContainer}>
            <Text style={styles.headerText}>User Settings</Text>
              <View style={styles.image}>
              <PhotoUpload
                onPhotoSelect={avatar => this.onPhotoSelect(avatar)}
                onStart={() => this.onStart()}
                onCancel={() => this.onStop()}
                onError={() => this.onStop()}
              >
                <Image
                    style={styles.image}
                    resizeMode='cover'
                    source={{uri:func.image_url + this.props.image}}
                    defaultSource={require("../img/Portrait_Placeholder.png")}
                />
                <View style={styles.Edit}>
                  <Text style={styles.EditText}>Edit</Text>
                </View>
              </PhotoUpload>
              </View>
            <Text style={styles.usernameText}>{username}</Text>
        </View>
    );
  };

  render() {
    return (
      <ImageBackground style={styles.imageBackground} source={require("../img/bg1.jpg")}>

            {this.state.spinner?<ActivityIndicator
              animating={this.state.spinner}
              color="#77f"
              size="large"
              style={{
                zIndex: 10,
                backgroundColor:"rgba(155,155,155,0.5)",
                paddingTop:10,
                position:"absolute",
                height: Dimensions.get('window').height,
                width: Dimensions.get('window').width,
              }}
            />:[]}

        <Closer onPress={func.debounce(()=>this.props.navigation.goBack())}/>
        <ScrollView ref={(c) => { this._scrollView = c; }} style={styles.container}>
            {this.renderUserHeader()}
            <View style={styles.user_body}>
            <Form
                ref="form"
                onChange={this.onChange}
                type={type}
                options={this.options}
                value={{
                    username: this.props.username,
                    email: this.props.email,
                    phone: this.props.phone,
                    password: "",
                    passwordAgain: "",
                }}
            />
            <TouchableHighlight
                activeOpacity={1} underlayColor={null}
                style={styles.button}
                onPress={func.debounce(this.onPress)}
                underlayColor="#99d9f4"
            >
                <Text style={styles.buttonText}>Save</Text>
            </TouchableHighlight>
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
  },
  container: {
    flex: 1,
    width: Dimensions.get('window').width,
    paddingTop:Platform.OS === "ios" && Dimensions.get("window").height === 812 ? 24 : 0,
  },
  user_header: {
    alignItems: "center",
    backgroundColor: "#fff"
  },
  user_body: {
    flex: 1,
    backgroundColor: "#fff",//"rgba(222,222,222,0.5)",
    padding: 20,
    minHeight: Dimensions.get('window').height/1.2,
    paddingBottom:50,
    marginBottom:200,
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
  Edit: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: main_color,
    padding:5,
    borderRadius:5,
  },
  EditText: {
    color: "#fff",
    fontWeight:"600",
    fontSize:13
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    alignSelf: "center"
  },
  button: {
    height: 36,
    backgroundColor: main_color,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: "stretch",
    justifyContent: "center"
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings);
//export default UserSettings;
