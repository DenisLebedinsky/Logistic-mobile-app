import React from "react";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import {Provider} from 'react-redux';

import BarcodeScanner from "./components/BarCodeScaner";
import PackageInfo from "./components/PackageInfo";
import Home from "./components/Home";
import Auth from './components/Auth'
import AcceptPackage from "./components/AcceptPackage";
import RedirectPackage from "./components/RedirectPackage";
import ShowStatus from "./components/ShowStatus"
import DriverDetails from './components/DriverDetails';
import store from './redux/store';

const AppNavigator = createStackNavigator(
  {
    Home: {
      screen: Home
    },
    Login: {
      screen: Auth
    },
    BarcodeScanner: {
      screen: BarcodeScanner
    },
    PackageInfo: {
      screen: PackageInfo
    },
    AcceptPackage: {
      screen: AcceptPackage
    },
    RedirectPackage: {
      screen: RedirectPackage
    },
    ShowStatus: {
      screen: ShowStatus
    },
    DriverDetails: {
      screen: DriverDetails
    },
  },
  {
    defaultNavigationOptions: {
      header: null
    }
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render () {
    return (
        <Provider store={store}>
          <AppContainer/>
        </Provider>
    )
  }
}