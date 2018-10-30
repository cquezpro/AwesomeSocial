import React from "react";
import { TabNavigator, StackNavigator } from "react-navigation";
import { Icon } from "react-native-elements";

//import Comp from "../screens/Comp";
import ProductList from "../screens/ProductList";
//import Product from "../screens/Product";
//import CustomerList from "../screens/CustomerList";
import OrderList from "../screens/OrderList";
//import Customer from "../screens/Customer";
import Order from "../screens/Order";
//import User from "../screens/User";
import UserCenter from "../screens/UserCenter";
import UserPanels from "../screens/UserPanels";
import UserSettings from "../screens/UserSettings";
import ContactUs from "../screens/ContactUs";
//import SearchResult from "../screens/SearchResult";
import Terms from "../screens/Terms";
//import Login from "../screens/Login";
//import AddProduct from "../screens/AddProduct";
//import AddCategory from "../screens/AddCategory";
//import Category from "../screens/Category";
//import AddSpecification from "../screens/AddSpecification";
import GoogleMap from "../screens/GoogleMap";
import Shop from "../screens/Shop";
import ConfirmOrder from "../screens/ConfirmOrder";
import PhoneLogin from "../screens/PhoneLogin";
//import PlayGround from "../screens/PlayGround";

import {Platform} from "react-native";

export const Tabs = TabNavigator(
  {
    ProductList: {
      screen: ProductList,
      navigationOptions: {
        tabBarLabel: "外卖",
        tabBarIcon: ({ tintColor }) => (
          <Icon name="list" size={35} color={tintColor} />
        )
      }
    },
    // Comp: {
    //   screen: Comp,
    //   navigationOptions: {
    //     tabBarLabel: "组件",
    //     tabBarIcon: ({ tintColor }) => (
    //       <Icon name="extension" size={35} color={tintColor} />
    //     )
    //   }
    // },
    // CustomerList: {
    //   screen: CustomerList,
    //   navigationOptions: {
    //     tabBarLabel: "客户",
    //     tabBarIcon: ({ tintColor }) => (
    //       <Icon name="face" size={35} color={tintColor} />
    //     )
    //   }
    // },
    OrderList: {
      screen: OrderList,
      navigationOptions: {
        tabBarLabel: "订单",
        tabBarIcon: ({ tintColor }) => (
          <Icon name="receipt" size={35} color={tintColor} />
        )
      }
    },
    UserSettings: {
      screen: UserCenter,
      navigationOptions: {
        tabBarLabel: "用户中心",
        tabBarIcon: ({ tintColor }) => (
          <Icon name="account-circle" size={35} color={tintColor} />
        )
      }
    },
  },
  {
    tabBarPosition: "bottom"
  }
);


export const ProudctStacks = StackNavigator({
  ProductList: {
    screen: ProductList
  },
  GoogleMap: {
    screen: GoogleMap
  },
  Shop: {
    screen: Shop
  },
  ConfirmOrder: {
    screen: ConfirmOrder
  },
});

export const OrderStacks = StackNavigator({
  OrderList: {
    screen: OrderList
  },
  Order: {
    screen: Order
  },
});

export const Stacks = StackNavigator({
  // PlayGround: {
  //   screen: PlayGround
  // },
  ProudctStacks: {
    screen: ProudctStacks
  },
  UserCenter: {
    screen: UserCenter
  },
  OrderStacks: {
    screen: OrderStacks
  },
  UserSettings: {
    screen: UserSettings
  },
  ContactUs: {
    screen: ContactUs
  },
  Terms: {
    screen: Terms
  },
},{
  mode: Platform.OS === "ios" ? "modal" : "card",
});
