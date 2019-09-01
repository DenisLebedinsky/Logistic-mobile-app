import React from "react";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import BarcodeScanner from './components/BarCodeScaner';
import PackageInfo from './components/PackageInfo';
import Home from "./components/Home";
import TakePackage from './components/TakePackage'

const AppNavigator = createStackNavigator(
  {
    Home: {
      screen: Home
    },
    BarcodeScanner: {
      screen: BarcodeScanner
    },
    PackageInfo: {
      screen: PackageInfo
    },
    TakePackage:{
      screen: TakePackage
    }
  },
  {
    defaultNavigationOptions: {
      header: null
    }
  }
);

export default createAppContainer(AppNavigator);
