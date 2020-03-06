import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  StyleSheet,
  Text,
  View,
  Image,
  AsyncStorage,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { locationsSelector, getLocations } from '../redux/reducers/locations';
import { authSelector, loginSuccess, logout } from "../redux/reducers/auth";
import DebounceTouchbleOpacity from './helpers/DebounceTouchbleOpacity'

import { getPackage } from '../redux/reducers/packages';

export default function Home({ navigation }) {

  const auth = useSelector(authSelector);
  const locations = useSelector(locationsSelector)
  const dispatch = useDispatch();

  // const scanData = ()=>{
  //   dispatch(getPackage("5e481865b0379f2ad4c00fc1"));
  //   navigation.navigate('PackageInfo');
  // }

  useEffect(() => {
    if (!(auth.loading || !!auth.user.id)) {
      getAuthFromASS();

    }
  });

  useEffect(() => {
    if (!locations.loading && !!auth.user.id && !locations?.list.length) {  
      dispatch(getLocations())
    }
  });

  const getAuthFromASS = async () => {
    const user = await AsyncStorage.getItem('user')

    if (user) {
      const parseUser = JSON.parse(user);

      dispatch(loginSuccess(parseUser))
    } else {
      navigation.replace("Login");
    }
  }

  openScaner = () => {
    navigation.push("BarcodeScanner");
  };

  const _logout = () => {
    dispatch(logout())
  }

  function renderContent() {
    if (auth.loading) {
      return <View style={styles.contentCenter}>
        <ActivityIndicator size="large" color="#fa000c" />
      </View>
    }

    return <View style={styles.profileContainer}>
      <View style={styles.profile}>
   
      <DebounceTouchbleOpacity onPress={_logout} delay={1000}>
        <Text style={styles.profileText}>
          {auth.user.username}
        </Text>
        </DebounceTouchbleOpacity>
      </View>
      <DebounceTouchbleOpacity 
      onPress={openScaner}
      delay={1000}>
        <View style={styles.contentCenter}>
          <Image
            style={styles.stretch}
            source={require("../assets/scan.jpg")}
          />
        </View>
      </DebounceTouchbleOpacity>
    </View>
  }

  return (
    <ImageBackground
      source={require("../assets/bg4.png")}
      style={{ width: "100%", height: "100%" }}
    >
      <View style={styles.container}>
        {renderContent()}
      </View >
     </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    margin: 50
  },
  contentCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  stretch: {
    width: 100,
    height: 100
  },
  loading: {
    width: 200,
    height: 200
  },
  exit: {
    width: 30,
    height: 30
  },
  start: {
    backgroundColor: "#0c06a1",
    color: "#fff",
    width: 100,
    height: 100,
    borderRadius: 50
  },
  profile: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "#fa000c",
    padding: 20
  },
  profileContainer: {
    flex: 1,
    marginTop: 40
  },
  profileText: {
    fontSize: 20,
   // marginRight: 30,
    color: "#fff"
  }
});
