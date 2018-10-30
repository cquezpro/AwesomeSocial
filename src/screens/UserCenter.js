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
import { connect } from "react-redux";
import { LOGIN } from "../constants/actionTypes";
import PhoneLogin from "./PhoneLogin";
import UserPanels from "./UserPanels";
import Closer from "../components/Closer";
import * as cache from "../func/cache";
import * as func from "../func/func";

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
  onLogout : () => {
    dispatch({
        type: "USER_LOGOUT"
    });
  }
});
class UserCenter extends Component {
  constructor() {
    super();
    this.state = {};
  }

  static navigationOptions = ({ navigation }) => ({
    header: null,
    gesturesEnabled: false,
    mode: Platform.OS === "ios" ? "modal" : "card",
  });

  navigate = (nav="ProductList") => {
    if(nav==="ProductList")
      this.props.navigation.goBack();
    else if(nav === "Logout"){
      Alert.alert(
        "Logout this account?",
        "",
        [
          {text: 'Cancel', onPress: () => {}},
          {text: 'Logout', onPress: func.debounce(() => {
            cache.clearCache();
            this.props.onLogout();
          })},
        ]
      );
    }else if(nav === "Terms"){
      //this.props.navigation.navigate("Terms");
      this.props.navigation.navigate({ key: 'Terms', routeName: 'Terms'});
    }
    else if(this.props.navigation.state.params==="back")
        this.props.navigation.goBack();
    else 
      this.props.navigation.navigate({ key: nav, routeName: nav});
        //this.props.navigation.navigate(nav);
  }

    render() {
      return <View style={styles.container}>
            <Closer onPress={func.debounce(this.navigate)}/>
            {(this.props.access_token)?
            <UserPanels navigate={this.navigate}/>:<PhoneLogin navigate={this.navigate}/>}
        </View>;
    }
}
const styles = StyleSheet.create({
    container: {
      flex:1
    },
});
export default connect(mapStateToProps, mapDispatchToProps)(UserCenter);
//export default User;
