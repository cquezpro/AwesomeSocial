import React, { Component,createRef } from 'react';

import {
  Image,
  ImageBackground,
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Alert,
  Dimensions,
  TouchableHighlight,
  ScrollView
} from 'react-native';
import { connect } from "react-redux";
import { CheckBox } from 'react-native-elements';

import Spinner from 'react-native-loading-spinner-overlay';
import Form from 'react-native-form';
import CountryPicker from 'react-native-country-picker-modal';
import * as func from "../func/func";
import * as cache from "../func/cache";

const MAX_LENGTH_CODE = 6;
const MAX_LENGTH_NUMBER = 20;

// if you want to customize the country picker
const countryPickerCustomStyles = {};


const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
  onLogin: (payload) => {
    dispatch({
        type: "LOGIN_DONE",
        payload: payload
    });
  },
  onGetUserDetail : (payload) => {
    dispatch({
        type: "USER_DETAIL",
        payload: payload
    });
  }
});

class PhoneLogin extends Component {

  constructor(props) {
    super(props);
    //this.scrollView = createRef();
    this.state = {
      modes:["Login","Register","Forgot"],
      mode:"Login", // Login Register Forgot
      enterCode: false,
      spinner: false,
      text: "",
      phone:"",
      password: "",
      passwordConfirm: "",
      country: {
        cca2: 'AU',
        callingCode: '61'
      },
      agreed: true
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

  static navigationOptions = ({ navigation }) => ({
    header: null
  });

  getUserDetail = (access_token) => {
    setTimeout(async () => {
      try {
        const res = await func.callApi("get", "api/user",
        {}, access_token);
        if (res.err) throw res.err;
        this.props.onGetUserDetail({
          ...res.data,
          access_token:access_token
        });
      } catch (err) {
        cache.clearCache();
      }
    }, 100);
  }

  _login = () => {

    this.mySetState({ spinner: true});

    setTimeout(async () => {
      try {
        let phone=this.state.country.callingCode+this.refs.form.getValues().phone;
        const res = await func.callApi("post", "oauth/token", {
            grant_type: "password",
            client_id: func.client_id,
            client_secret: func.client_secret,
            username: phone,
            password: this.refs.form.getValues().password,
          });
        if (res.err) throw res.err;
        let payload = res.data;

        this.mySetState({
          spinner: false,
          enterCode: false,
        });
        //this.clearText();

        cache.setCache("access_token",res.data.access_token);
        this.props.onLogin(payload);
        this.getUserDetail(res.data.access_token);
        setTimeout(()=>this.props.navigate());

      } catch (err) {
        this.mySetState({ spinner: false });
        setTimeout(() => {
          //func.errAlert(err);
          Alert.alert("Login failed, please check you phone and password"/*'登录失败，请确认手机号和密码正确。'*/);
          //console.warn(err.response.data.message);
        }, 100);
      }

    }, 100);

  }

  _getCode = () => {
    let phone = this.state.country.callingCode+this.refs.form.getValues().phone;
    if(phone.length!=11){
      Alert.alert("Please enter a valid phone number");
      return;
    }
    this.mySetState({ spinner: true});

    setTimeout(async () => {

      try {
        const res = await func.callApi("post", "api/phone_verify", {
            register: (this.state.mode==='Register'),
            phone: phone
          });
        if (res.err) throw res.err;
        this.clearText();
        this.mySetState({
          spinner: false,
          enterCode: true,
          phone: phone,
        });

        setTimeout(() => {
          Alert.alert("Sent"/*'已发送!'*/, 
          "We have sent a verification code to your phone."/*"我们已将验证码发到手机。"*/, 
          [{
            text: 'OK',
            onPress: func.debounce(() => this.refs.form.refs.textInput.focus())
          }]);
        }, 100);

      } catch (err) {
        // <https://github.com/niftylettuce/react-native-loading-spinner-overlay/issues/30#issuecomment-276845098>
        this.mySetState({ spinner: false });
        func.errAlert(err);
        // setTimeout(() => {
        //   Alert.alert(err.message);
        //   console.warn(err.message);
        //   console.warn(err.response.data.message);
        // }, 100);
      }

    }, 100);

  }

  _register = () => {
    if(!this.state.agreed){
      Alert.alert("Terms and Conditions is not accepted."/*'密码长度至少6位。'*/);
      return;
    }
    if(this.refs.form.getValues().password !== this.refs.form.getValues().passwordConfirm){
        Alert.alert("Two passwords not match."/*'请确认两次输入密码相同。'*/);
        return;
    }
    if(this.refs.form.getValues().password.length<=6){
      Alert.alert("Password minimum length is 6."/*'密码长度至少6位。'*/);
      return;
    }

    this.mySetState({ spinner: true});

    setTimeout(async () => {

      try {
            
        let phone = this.state.country.callingCode+this.refs.form.getValues().phone;
        const res = await func.callApi("post", "api/register", {
            phone: this.state.phone,
            code : this.refs.form.getValues().phone,
            password: this.refs.form.getValues().password
          });
        if (res.err) throw res.err;
        let payload = res.data;

        this.mySetState({
          spinner: false,
          enterCode: true,
        });
        //this.clearText();
        this.props.onLogin(payload);
        this.getUserDetail(res.data.access_token);
        setTimeout(()=>this.props.navigate());

      } catch (err) {
        // <https://github.com/niftylettuce/react-native-loading-spinner-overlay/issues/30#issuecomment-276845098>
        this.mySetState({ spinner: false });
        func.errAlert(err);
      }

    }, 100);

  }

  _forgotPassword = () => {
    if(this.refs.form.getValues().password !== this.refs.form.getValues().passwordConfirm){
        Alert.alert("Two passwords not match."/*'请确认两次输入密码相同。'*/);
        return;
    }
    if(this.refs.form.getValues().password.length<=6){
      Alert.alert("Password minimum length is 6."/*'密码长度至少6位。'*/);
      return;
    }

    this.mySetState({ spinner: true});

    setTimeout(async () => {

      try {
            
        let phone = this.state.country.callingCode+this.refs.form.getValues().phone;
        const res = await func.callApi("post", "api/forgot_password", {
            phone: this.state.phone,
            code : this.refs.form.getValues().phone,
            password: this.refs.form.getValues().password
          });
        if (res.err) throw res.err;

        this.mySetState({
          mode: "Login",
          spinner: false,
          enterCode: false,
          phone: "",
        });
        this.clearText();
        setTimeout(() => {
            Alert.alert('Password Edited.'/*'密码修改成功。'*/);
        }, 100);

      } catch (err) {
        // <https://github.com/niftylettuce/react-native-loading-spinner-overlay/issues/30#issuecomment-276845098>
        this.mySetState({ spinner: false });
        func.errAlert(err);
      }

    }, 100);

  }

  clearText = () => {
    this.refs.form.refs.textInput.setNativeProps({ text: ' ' });//dirty solution for ios
    if(this.refs.form.refs.password)
      this.refs.form.refs.password.setNativeProps({ text: ' ' });
    if(this.refs.form.refs.passwordConfirm)
      this.refs.form.refs.passwordConfirm.setNativeProps({ text: ' ' });
    setTimeout(() => {
      this.refs.form.refs.textInput.setNativeProps({ text: '' });
      if(this.refs.form.refs.password)
        this.refs.form.refs.password.setNativeProps({ text: '' });
      if(this.refs.form.refs.passwordConfirm)
        this.refs.form.refs.passwordConfirm.setNativeProps({ text: '' });
    });
  }

  _onChangeText = (val) => {
    // if (this.state.enterCode&&val.length === MAX_LENGTH_CODE)
    //     this._verifyCode();
    this.mySetState({
        text:val
    })
  }

  _tryAgain = () => {
    this.clearText();
    this.refs.form.refs.textInput.focus();
    this.mySetState({ enterCode: false });
  }

  _changeCountry = (country) => {
    this.mySetState({ country });
    this.refs.form.refs.textInput.focus();
  }

  _renderFooter = () => {

    if (this.state.enterCode)
      return (
        <View>
          <Text style={styles.wrongNumberText} onPress={func.debounce(this._tryAgain)}>
            Wrong phone number or need to resend code?          
          </Text>
        </View>
      );

    return (
      <View>
        <Text style={styles.disclaimerText}>{this.state.mode=="Login"?"":"Click to send verigication code."}</Text>
      </View>
    );

  }

  _renderCountryPicker = () => {

    if (this.state.enterCode)
      return (
        <View />
      );

    return (
      <CountryPicker
        disabled={true}
        ref={'countryPicker'}
        closeable
        style={styles.countryPicker}
        onChange={this._changeCountry}
        cca2={this.state.country.cca2}
        styles={countryPickerCustomStyles}
        translation='eng'/>
    );

  }

  _renderCallingCode = () => {

    if (this.state.enterCode)
      return (
        <View />
      );

    return (
      <View style={styles.callingCodeView}>
        <Text style={styles.callingCodeText}>+{this.state.country.callingCode}</Text>
      </View>
    );

  }

  _renderTabHeader = () => {
    let headers = [];
    let viewStyle, textStyle;
    for (let i = 0; i < this.state.modes.length; i++) {
      let value = this.state.modes[i];
      if (this.state.mode === value) {
        viewStyle = [styles.tab, styles.tabActive];
        textStyle = [styles.tabText, styles.tabActiveText];
      } else {
        viewStyle = [styles.tab, styles.tabInactive];
        textStyle = [styles.tabText, styles.tabInactiveText];
      }
      headers.push(
        <TouchableHighlight hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
          activeOpacity={1} underlayColor={null}
          key={i}
          style={viewStyle}
          onPress={func.debounce(() => {
            this._scrollView.scrollTo({y:0})
            this.mySetState({mode:value});
          })}
        >
          <Text style={textStyle}>{value}</Text>
        </TouchableHighlight>
      );
    }
    //console.log(headers);
    return <View style={styles.tabHeader}>{headers}</View>;
  }

  _getSubmitAction = (index) => {
    if(index==1&&(this.state.enterCode||this.state.mode==='Login'))
      this.refs.form.refs.password.focus();
    else if(index==2&&this.state.enterCode)
      this.refs.form.refs.passwordConfirm.focus();
    else
      switch(this.state.mode){
        case "Login":
            this._login();
            break;
        case "Register":
            if(this.state.enterCode)
                this._register();
            else
                this._getCode();
            break;
        case "Forgot":
            if(this.state.enterCode)
                this._forgotPassword();
            else
                this._getCode();
            break;
      }
  }

  render() {
    let headerText = "";
    let buttonText = "";
    switch(this.state.mode){
        case "Login":
            buttonText = "Login";
            break;
        case "Register":
            if(this.state.enterCode)
                buttonText = "Register";
            else
                buttonText = "Send Code";
            break;
        case "Forgot":
            if(this.state.enterCode)
                buttonText = "Submit new password";
            else
                buttonText = "Send Code";
            break;
    }

    let textStyle = {};/*this.state.enterCode ? {
      height: 50,
      textAlign: 'center',
      fontSize: 40,
      fontWeight: 'bold',
      fontFamily: 'Courier'
    } : {};*/

    return (
        <ImageBackground style={styles.imageBackground} source={require("../img/bg1.jpg")}>
        <ScrollView ref={(c) => { this._scrollView = c; }} style={styles.container}>
        <View style={styles.imageContainer}>
            <Image
                style={styles.image}
                source={require("../img/app_icon.jpg")}
                />
        </View>
        {this._renderTabHeader()}

        <Form ref='form' style={styles.form}>

            <View>
                <Text style={styles.disclaimerText}>{this.state.enterCode?"Enter 6 digit code":""}</Text>
            </View>
          <View style={styles.InputContainer}>

            {this._renderCountryPicker()}
            {this._renderCallingCode()}

            <TextInput
              ref='textInput'
              name={'phone'}
              type={'TextInput'}
              underlineColorAndroid={'transparent'}
              autoCapitalize={'none'}
              autoCorrect={false}
              //onChangeText={this._onChangeText}
              defaultValue={this.state.text}
              placeholder={this.state.enterCode ? 'Enter code' : 'Enter phone number'}
              keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
              style={[ styles.textInput, textStyle ]}
              returnKeyType='go'
              placeholderTextColor={main_color}
              selectionColor={main_color}
              maxLength={this.state.enterCode ? 6 : 20}
              onFocus={()=>this._scrollView.scrollTo({y:100})}
              onEndEditing={()=>this._scrollView.scrollTo({y:0})}
              onSubmitEditing={()=>this._getSubmitAction(1)} />
            
          </View>
        
          { (this.state.enterCode||this.state.mode==='Login')?
          <View style={styles.InputContainer}>
            <TextInput
                ref='password'
                name={'password'}
                type={'TextInput'}
                secureTextEntry={true}
                underlineColorAndroid={'transparent'}
                autoCapitalize={'none'}
                autoCorrect={false}
                //onChangeText={(text)=>this.mySetState({'password':text})}
                defaultValue={this.state.password}
                placeholder={'Password'}
                style={[ styles.textInput, textStyle]}
                placeholderTextColor={main_color}
                selectionColor={main_color}
                maxLength={20}
                onFocus={()=>this._scrollView.scrollTo({y:140})}
                onEndEditing={()=>this._scrollView.scrollTo({y:0})}
                onSubmitEditing={()=>this._getSubmitAction(2)} />
            </View>
            :[]
          }


          { (this.state.enterCode)?
            <View style={styles.InputContainer}>
                <TextInput
                    ref='passwordConfirm'
                    name={'passwordConfirm'}
                    type={'TextInput'}
                    secureTextEntry={true}
                    underlineColorAndroid={'transparent'}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    //onChangeText={(text)=>this.mySetState({'passwordConfirm':text})}
                    defaultValue={this.state.passwordConfirm}
                    placeholder={'Confirm password'}
                    style={[ styles.textInput, textStyle]}
                    placeholderTextColor={main_color}
                    selectionColor={main_color}
                    maxLength={20}
                    onFocus={()=>this._scrollView.scrollTo({y:180})}
                    onEndEditing={()=>this._scrollView.scrollTo({y:0})}
                    onSubmitEditing={()=>this._getSubmitAction(3)} />
            </View>
            :[]
          }

          { (this.state.mode==='Register')?
              <CheckBox
                center
                title="Accept <Qooka's Terms & Conditions>"
                size={35}
                checked={this.state.agreed}
                containerStyle={{
                  backgroundColor:"rgba(0,0,0,0)",
                  borderWidth: 0
                }}
                textStyle={{color:main_color,}}
                onPress={func.debounce(() => this.props.navigate('Terms'))}
                onIconPress = {func.debounce(() => this.mySetState({agreed: !this.state.agreed}))}
              />
            :[]
          }

          <TouchableOpacity style={styles.button} onPress={func.debounce(this._getSubmitAction)}>
            <Text style={styles.buttonText}>{ buttonText }</Text>
          </TouchableOpacity>

          {this._renderFooter()}

        </Form>

        <Spinner
          visible={this.state.spinner}
          textContent={'Please wait...'}
          textStyle={{ color: '#fff' }} />
        </ScrollView>
      </ImageBackground>

    );
  }
}
// your brand's theme primary color
const main_color = "#ff9600";
const secondary_color = "#fff";
const styles = StyleSheet.create({
  countryPicker: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
  },
  imageBackground: {
    flex:1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    paddingTop:Platform.OS === "ios" && Dimensions.get("window").height === 812 ? 24 : 0,
  },
  header: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 22,
    margin: 20,
    color: '#4A4A4A',
  },
  form: {
    margin: 20
  },
  textInput: {
    padding: 0,
    margin: 0,
    flex: 1,
    fontSize: 20,
    color: main_color
  },
  button: {
    marginTop: 20,
    height: 50,
    backgroundColor: main_color,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Helvetica',
    fontSize: 16,
    fontWeight: 'bold'
  },
  wrongNumberText: {
    margin: 10,
    fontSize: 14,
    textAlign: 'center'
  },
  disclaimerText: {
    marginTop: 30,
    fontSize: 12,
    color: 'grey'
  },
  callingCodeView: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  callingCodeText: {
    fontSize: 20,
    color: main_color,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    paddingRight: 10
  },
  InputContainer:{ 
    flexDirection: 'row' ,
    backgroundColor: "rgba(222,222,222,0.5)",
    borderRadius: 35,
    paddingVertical: 15,
    marginTop: 15,
    paddingLeft:20
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop:Dimensions.get("window").height * 0.05,
    marginBottom:Dimensions.get("window").height * 0.05,
  },
  image: {
    borderColor: "#fff",
    borderRadius:25,
    height: 125,
    width: 125
  },
  tabHeader: {
    borderWidth: 2,
    borderColor: main_color,
    borderRadius:10,
    flexDirection: "row",
    justifyContent: "center",
    height: 38,
    width: Dimensions.get("window").width * 0.9,
    marginHorizontal: Dimensions.get("window").width * 0.05,
    overflow: "hidden"
  },
  tab: {
      height: 38,
    width: Dimensions.get("window").width * 0.3,
    justifyContent: "center",
    alignItems: "center",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: main_color,
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

//export default PhoneLogin;
export default connect(mapStateToProps, mapDispatchToProps)(PhoneLogin);
