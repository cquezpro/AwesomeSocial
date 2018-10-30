import React,{Component} from "react";
import propTypes from "prop-types";
import {
  View,
  Image,
  Animated,
} from "react-native";
import * as func from "../func/func";

//组件
class AsyncImage extends Component {
  
    constructor(props) {
      super(props)
      this.state = {
          loaded: false,
          placeholderScale: new Animated.Value(1.0),
          placeholderOpacity: new Animated.Value(1.0),
          imageOpacity: new Animated.Value(0.0),
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

    _onLoad = () => {
        if(!this.componentMounted)
            return;
        if(this.props.no_animation){
            this.mySetState({loaded:true,imageOpacity:1});
        }else{
            let implode_time = 70;
            let explode_time_placeholder = 100;
            let explode_time_image = 200;
            Animated.sequence([
                //Implode
                Animated.parallel([
                    Animated.timing(this.state.placeholderScale,{
                        toValue: 0.92,
                        duration: implode_time,
                        useNativeDriver: true
                    }),
                    Animated.timing(this.state.placeholderOpacity,{
                        toValue: 0.83,
                        duration: implode_time,
                        useNativeDriver: true
                    }),
                ]),
                //Explode
                Animated.parallel([
                    Animated.parallel([
                        Animated.timing(this.state.placeholderScale,{
                            toValue: 1.05,
                            duration: explode_time_placeholder,
                            useNativeDriver: true
                        }),
                        Animated.timing(this.state.placeholderOpacity,{
                            toValue: 0,
                            duration: explode_time_placeholder,
                            useNativeDriver: true
                        }),
                    ]),
                    Animated.timing(this.state.imageOpacity,{
                        toValue: 1.0,
                        //delay: explode_time_placeholder/3,
                        duration: explode_time_image,
                        useNativeDriver: true
                    }),
                ]),
            ]).start(()=>{
                this.mySetState({loaded:true});
            });
        }
    }

    render() {

      const {
        placeholderColor,
        style,
        source
      } = this.props;
      return (
        <View style={style}>
            {this.state.loaded && this.props.dark && <View
                style={[style,{
                    zIndex:12,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    position: 'absolute'
                }]}
            />}
            <Animated.Image
                source = {source}
                resizeMode={'cover'}
                style={[
                    style,{
                        opacity:this.state.imageOpacity,
                        position:"absolute",
                        resizeMode: 'cover'
                    }
                ]}
                onLoad={this._onLoad}
            />
            {!this.state.loaded && <Animated.View
                style={[style,{
                    opacity: this.state.placeholderOpacity,
                    transform: [{scale:this.state.placeholderScale}],
                    backgroundColor: placeholderColor,
                    position: 'absolute'
                }]}
                />}
        </View>
      )
    }
  
    
  }

export default AsyncImage;
