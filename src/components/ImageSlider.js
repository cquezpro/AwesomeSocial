import React from "react";
import { TouchableHighlight, View, Text, TextInput, Dimensions, Image } from "react-native";
import { Icon } from "react-native-elements";
import Swiper from "react-native-swiper";
import * as func from "../func/func";
import AsyncImage from "./AsyncImage";

const ImageSlider = props => {
    let images = [];
    // for (let i = 0; i < props.images.length; i++) {
    //     let value = props.images[i];
    //     images.push(
    //       <TouchableHighlight hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
    //         activeOpacity={1} underlayColor={null} key={i}>
    //         <AsyncImage
    //           style={styles.wrapperContainer}
    //           source={{uri: func.image_url + value,cache:'force-cache'}}
    //           placeholderColor={"#eee"}
    //           no_animation={true}
    //         />
    //       </TouchableHighlight>
    //     );
    // }
    images.push(
        <Image  key={0} style={styles.wrapperContainer} source={require("../img/ad1.jpeg")}/>
    );
    images.push(
        <Image  key={1} style={styles.wrapperContainer} source={require("../img/ad2.jpeg")}/>
    );
  return (
    <View style={styles.wrapperContainer}>
        <Swiper
            style={styles.wrapper}
            showsButtons={false}
            loop={true}
            index={0}
            autoplay={true}
            autoplayTimeout={5}
            /*renderPagination={this.renderPagination}*/
            key={props.images.length}
        >
            {images}
        </Swiper>
    </View>
  );
};

const styles = {
    wrapperContainer: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").width/4
    },
};

export default ImageSlider;
