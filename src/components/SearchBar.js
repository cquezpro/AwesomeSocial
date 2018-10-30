import React, { Component } from "react";
import {
  Image,
  TouchableHighlight,
  StyleSheet,
  View,
  Text,
  Dimensions,
  TextInput,
  ScrollView,
  FlatList,
  Platform
} from "react-native";
import Form from 'react-native-form';
import { Icon } from "react-native-elements";
import RNGooglePlaces from "react-native-google-places";
//import ViewOverflow from 'react-native-view-overflow';
import * as func from "../func/func";

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onFocus: false,
      searchKey: "",
      hotSearchkeys: [
        "54",
        "UGG雪地靴",
        "电冰箱",
        "旧电视机",
        "澳洲纯羊毛棉裤"
      ],
      historySearchkeys: ["牛奶11", "冰箱", "洗衣机", "电脑", "UGG"],
      SearchOptions: [
        "射手座",
        "射手座手链",
        "射手座项链",
        "射手座奖",
        "射手座礼物",
        "射手座生日礼物",
        "射手座：会有星光越重洋",
        "射手座沙发",
        "射手座戒指"
      ],
      predictions: []
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

  propsclearSearch = () => {
    this.focus(true);
  };

  onChangeText = () => {
    if(this.props.isAddress)
      this.getPredictions(this.refs.form.getValues().input);
    // this.mySetState({
    //   searchKey: text
    // });
  }
  
  getPredictions = (text) => {
    RNGooglePlaces.getAutocompletePredictions(text)
      .then((results) => {
        if(true/*Platform.OS === "android"*/)
          this.props.androidShowPredictions(results);
        else
          this.mySetState({
            predictions: results //primaryText secondaryText placeID
          });
      })
      .catch((error) => {
        //console.warn(error.message);
    });
  }

  focus(onClear) {
    //this.nameInput.focus();
    this.refs.form.refs.input.focus();
    if (onClear)
      this.mySetState({
        onFocus: true,
        searchKey: ""
      });
    else
      this.mySetState({
        onFocus: true,
        searchKey: this.props.searchedKey ? this.props.searchedKey : ""
      });
  }

  quitSearch = () => {
    this.refs.form.refs.input.setNativeProps({ text: ' ' });//dirty solution for ios
    setTimeout(() => {
      const field = TextInput.State.currentlyFocusedField();
      TextInput.State.blurTextInput(field);
      this.refs.form.refs.input.setNativeProps({ text: '' });
    });
    this.mySetState({ onFocus: false});
    this.props.search('');
  };

  render() {
    let displaySearchPage = { display: "none" };
    let displaySearchOptions = [];//{ display: "none" };
    let displayHotSearch = this.props.isAddress?{ display: "none" }:{}
    searchedKey = <View />;
    let quitButton = quitButton = (
      <TouchableHighlight hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
        activeOpacity={1} underlayColor={null}
        style={styles.quitSearch}
        onPress={func.debounce(() => this.quitSearch())}
      >
        <Text style={styles.quitSearchText}>{this.state.onFocus||this.props.isAddress?"Clear":""}</Text>
      </TouchableHighlight>
    );
    if (this.state.onFocus) {
      if (this.state.predictions.length>0&&this.props.isAddress)
        displaySearchOptions = <View style={[styles.searchPageContainer, displaySearchOptions]}>
        <ScrollView
          keyboardShouldPersistTaps="always"
          style={{flex:1}}
        >
          <FlatList
            keyboardShouldPersistTaps="always"
            style={{ marginTop: 10 }}
            data={this.state.predictions}
            keyExtractor={(item, index) => ""+index}
            renderItem={({ item }) => (
              <TouchableHighlight hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
                activeOpacity={1} underlayColor={null}
                style={styles.historyItem}
                onPress={func.debounce(() => {
                  this.props.search(item);
                })}
              >
                <View>
                  <Text style={[styles.historyItemText, { marginLeft: 20 }]}>
                    {item.primaryText}
                  </Text>
                  <Text style={[styles.historyItemText, { marginLeft: 20 }]}>
                    {item.secondaryText}
                  </Text>
                </View>
              </TouchableHighlight>
            )}
          />
        </ScrollView>
      </View>;
      // else displaySearchPage = [];
    } else {
      if (this.props.searchedKey)
        searchedKey = (
          <AddedTag tag={this.props.searchedKey} onClear={() => this.propsclearSearch()}/>
        );
    }
    let hotSearchKeys = [];
    for (let i = 0; i < this.state.hotSearchkeys.length; i++)
      hotSearchKeys.push(
        <TouchableHighlight hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
          activeOpacity={1} underlayColor={null}
          key={i}
          style={styles.hotSearch}
          onPress={func.debounce(() => {
            this.props.search(this.state.hotSearchkeys[i]);
          })}
        >
          <Text style={styles.hotSearchText}>
            {this.state.hotSearchkeys[i]}
          </Text>
        </TouchableHighlight>
      );
    return (
      <View style={styles.container}>
        <TouchableHighlight hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
          activeOpacity={1} underlayColor={null}
          style={{ flex: 4 }}
          onPress={func.debounce(() => this.focus(false))}
        >
          <View style={styles.searchContainer}>
            <View style={styles.iconContainer}>
              <Icon name="search" color="grey" />
            </View>
            <View style={styles.textContainer}>
              {searchedKey}
              <Form ref='form' style={{flex:1,height:27,}} pointerEvents="none">
                <TextInput
                  // ref={input => {
                  //   this.nameInput = input;
                  // }}
                  ref='input'
                  name={'input'}
                  type={'TextInput'}
                  textAlignVertical={'center'}
                  underlineColorAndroid={'rgba(0,0,0,0)'}
                  style={
                    this.props.searchedKey && !this.state.onFocus
                      ? { flex: 0 ,padding:0}
                      : { flex: 1 ,padding:0}
                  }
                  returnKeyType="search"
                  placeholder={
                    this.props.searchedKey && !this.state.onFucus
                      ? ""
                      : (this.props.isAddress?"Enter pick up address"/*"输入取餐地址"*/:"Search restaurant"/*"输入商家或商品名称"*/)
                  }
                  defaultValue={this.state.searchKey}
                  onChangeText={this.onChangeText}
                  onSubmitEditing={() => {
                    if(!this.props.isAddress)
                      this.props.search(this.refs.form.getValues().input);
                  }}
                />
              </Form>
            </View>
            <View style={styles.imageContainer}>
              <Image
                style={{ width: 25, height: 25 }}
                source={require("../img/app_icon_nbg.png")}
              />
            </View>
          </View>
        </TouchableHighlight>
        {quitButton}
        {displaySearchOptions}
        {/*<ScrollView
          keyboardShouldPersistTaps="always"
          style={[styles.searchPageContainer, displaySearchPage]}
        >
          <View style={[styles.hotSearchContainer,displayHotSearch]}>
            <View style={styles.hotSearchTitleContainer}>
              <Text style={styles.TitleText}>热搜</Text>
            </View>
            <View style={styles.hotSearchKeyContainer}>
              <ScrollView
                keyboardShouldPersistTaps="always"
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={styles.hotSearchKeyScrollView}
              >
                {hotSearchKeys}
              </ScrollView>
            </View>
          </View>
          <View style={styles.historySearchContainer}>
            <View style={styles.gapContainer} />
            <View style={styles.historyContainer}>
              <FlatList
                keyboardShouldPersistTaps="always"
                ListHeaderComponent={() => (
                  <View style={styles.historyHeader}>
                    <Text style={styles.historyHeaderText}>历史搜索</Text>
                  </View>
                )}
                data={this.state.historySearchkeys}
                renderItem={({ item }) => (
                  <TouchableHighlight hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
                    activeOpacity={1} underlayColor={null}
                    style={styles.historyItem}
                    onPress={func.debounce(() => {
                      this.props.search(item);
                    })}
                  >
                    <Text style={styles.historyItemText}>{item}</Text>
                  </TouchableHighlight>
                )}
                keyExtractor={item => item}
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableHighlight hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
                activeOpacity={1} underlayColor={null}
                style={styles.touchableHighlight}
                onPress={func.debounce(() => console.log("delete search history!"))}
              >
                <View style={styles.button}>
                  <Icon name="delete-forever" color="grey" />
                  <Text style={styles.buttonText}>清空历史搜索</Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
              </ScrollView>*/}
      </View>
    );
  }
}

const width = Dimensions.get("window").width+func.screen_width_offset;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 33,
    //position: "absolute",
    //width: Dimensions.get("window").width * 6 / 8,
    flexDirection:"row",
    //backgroundColor:"#ff7",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 35,
    borderWidth: 3,
    backgroundColor: "#eeF0F3",
    borderColor: "#eeF0F3"
  },
  quitSearch: {
    flex:1,
    //position: "absolute",
    // width: 50,
    // height: 33,
    // right: -50,
    // top: 0,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
  },

  searchPageContainer: {
    backgroundColor: "#fff",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    position: "absolute",
    right: -Dimensions.get("window").width / 8,
    top: 33
  },
  iconContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  textContainer: {
    height:33,
    flex: 7,
    flexDirection: "row",
    zIndex: 1
  },
  textInputArea: {
    flex: 1
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  quitSearchText: {
    color: "#ff9600",
    paddingRight: 3,
    fontSize: width*0.023,//14,
    fontWeight: "600"
  },
  hotSearchContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eeF0F3",
    paddingVertical: 10,
    paddingLeft: 10
  },
  hotSearchTitleContainer: {},
  TitleText: {
    fontSize: width*0.027,//16,
    fontWeight: "600"
  },
  hotSearchKeyContainer: {
    paddingTop: 10
  },
  hotSearchKeyScrollView: {
    flexDirection: "row"
  },
  hotSearch: {
    marginRight: 14,
    paddingHorizontal: 2,
    borderRadius: 5,
    backgroundColor: "#eeF0F3"
  },
  hotSearchText: {
    paddingVertical: 3,
    paddingHorizontal: 5,
    color: "#444"
  },
  historySearchContainer: {},
  gapContainer: {
    height: 10,
    backgroundColor: "#eeF0F3",
    borderTopWidth: 1,
    borderTopColor: "#ddd"
  },
  historyContainer: {
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: "#f7f7f7"
  },
  historyHeader: {
    paddingVertical: 10
  },
  historyHeaderText: {
    fontSize: 16,
    fontWeight: "600"
  },
  historyItem: {
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#f7f7f7"
  },
  historyItemText: {
    fontSize: width*0.024,//15,
    fontWeight: "400",
    color: "#777"
  },
  buttonContainer: {
    paddingTop: 20,
    alignItems: "center"
  },
  touchableHighlight: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    width: 280,
    height: 42,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: {
    fontSize: width*0.024,//15,
    fontWeight: "400",
    color: "#777"
  }
});

export default SearchBar;
