import React, { Component } from "react";
import {StyleSheet, Text, View,InteractionManager,Dimensions,ScrollView,FlatList,TouchableHighlight} from 'react-native';
import MapView from 'react-native-maps';
import { connect } from "react-redux";
import RNGooglePlaces from "react-native-google-places";
import Header from "../components/Header";
import * as func from "../func/func";

const mapStateToProps = state => ({ ...state.GoogleMap });

const mapDispatchToProps = dispatch => ({
  onSetPickUpPosition: (payload) => {
    dispatch({
      type: "SET_PICK_UP_POSITION",
      payload: payload
    });
  }
});

class GoogleMap extends Component {
  constructor() {
    super();
    this.state = {
      renderPlaceholderOnly: true,
      predictions: [],
      isMapReady: false,
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

  componentDidMount() {
    this.componentMounted = true;
    InteractionManager.runAfterInteractions(() => {
      this.mySetState({renderPlaceholderOnly: false});
    });
  }

  onMapLayout = () => {
    this.mySetState({ isMapReady: true });
  }

  static navigationOptions = ({ navigation }) => ({
    header: null,
    gesturesEnabled: false,
  });

  onSearch = (value) => {
    if(value.placeID)
      RNGooglePlaces.lookUpPlaceByID(value.placeID)
        .then((result) => {
          this.props.onSetPickUpPosition({
            longitude: result.longitude,
            latitude: result.latitude,
            address: value.fullText,
            placeID: value.placeID
          });
        })
      .catch((error) => {
        //console.warn(error.message)
      });
    this.props.navigation.goBack();
  }

  onBack = () => {
    this.props.navigation.goBack();
  };

  androidShowPredictions = (results) => {
    this.mySetState({
      predictions: results //primaryText secondaryText placeID
    });
  }

  _renderPlaceholderView() {
    return (
      <View style={styles.container}>
        <Header
          isAddress={true}
          onBack={() => this.onBack()}
          search={value => this.onSearch(value)}
          icons={[]}
        />
      </View>
    );
  }

  render() {
    if (this.state.renderPlaceholderOnly) {
      return this._renderPlaceholderView();
    }
    let displaySearchOptions = [];
    if (this.state.predictions.length>0)
        displaySearchOptions = <View style={styles.searchPageContainer}>
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
                  this.onSearch(item);
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
    return (
      <View style={styles.container}>
        <Header
          isAddress={true}
          onBack={() => this.onBack()}
          search={value => this.onSearch(value)}
          icons={[]}
          androidShowPredictions={this.androidShowPredictions}
        />
        {displaySearchOptions}
        <View style={styles.bodyContainer}>
        <MapView
          provider={MapView.PROVIDER_GOOGLE}
          style={{ ...StyleSheet.absoluteFillObject }}
          region={{
            latitude: this.props.current_position ? this.props.current_position.latitude : 3.146642,
            longitude: this.props.current_position ? this.props.current_position.longitude : 101.695845,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
        >
          {this.props.current_position && this.state.isMapReady &&
            <MapView.Marker
              coordinate={{ latitude: this.props.current_position.latitude, longitude: this.props.current_position.longitude }}
              pinColor="#ff9600"
            />
          }
        </MapView>
        {/*<SearchBox
          onGetPredictedPositions = {this.props.onGetPredictedPositions}
        />*/}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bodyContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  searchPageContainer: {
    backgroundColor: "#fff",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    // position: "absolute",
    // right: -Dimensions.get("window").width / 8,
    // top: 33
  },
  historyItem: {
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#f7f7f7"
  },
  historyItemText: {
    fontSize: 15,
    fontWeight: "400",
    color: "#777"
  },
});

//export default GoogleMap;
export default connect(mapStateToProps, mapDispatchToProps)(GoogleMap);
