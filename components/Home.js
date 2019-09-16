import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  AsyncStorage,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Auth from "./Auth";
import { signIn } from "../api";

export default function Home({ navigation }) {
  const [auth, setAuth] = useState({
    isLogin: false,
    isLoading: true,
    token: "",
    user: { username: "", id: "" }
  });
  const [err, setErr] = useState(false);

  useEffect(() => {
    if (auth.isLoading && !auth.isLogin) {
      _retrieveData();
    }
  });

  const signInMethod = async data => {
    const res = await signIn(data);

    if (res !== "error") {
      setAuth({
        isLogin: true,
        isLoading: false,
        token: res.token,
        user: {
          username: res.username,
          id: res.id
        }
      });
      _storeData(res.token, {
        username: res.username,
        id: res.id,
        locationId: res.locationId
      });
    } else {
      setErr(true);
    }
  };

  openScaner = () => {
    navigation.navigate("BarcodeScanner");
  };

  logout = () => {
    setAuth({
      isLogin: false,
      isLoading: false,
      token: "",
      user: { username: "", id: "" }
    });
    _removeData();
  };

  _retrieveData = async () => {
    try {
      const token = await AsyncStorage.getItem("TOKEN");
      const user = JSON.parse(await AsyncStorage.getItem("USER"));
      if (token && user) {
        setAuth({ ...auth, token, isLoading: false, user, isLogin: true });
      } else {
        setAuth({ ...auth, isLoading: false });
      }
    } catch (error) {
      console.log(error);
    }
  };

  _storeData = async (token, user) => {
    try {
      await AsyncStorage.setItem("TOKEN", token);
      await AsyncStorage.setItem("USER", JSON.stringify(user));
    } catch (error) {
      console.log(error);
    }
  };

  _removeData = async () => {
    try {
      await AsyncStorage.removeItem("TOKEN");
      await AsyncStorage.removeItem("USER");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/bg4.png")}
      style={{ width: "100%", height: "100%" }}
    >
      <View style={styles.container}>
        {auth.isLoading ? (
          <View style={styles.contentCenter}>
            <ActivityIndicator size="large" color="#fa000c" />
          </View>
        ) : auth.isLogin ? (
          <View style={styles.profileContainer}>
            <View style={styles.profile}>
              <Text style={styles.profileText}>{auth.user.username}</Text>
              <TouchableOpacity onPress={logout}>
                <Ionicons
                  name="md-log-out"
                  size={32}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={openScaner}>
              <View style={styles.contentCenter}>
                <Image
                  style={styles.stretch}
                  source={require("../assets/scan.jpg")}
                />
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.contentCenter}>
            <Auth signIn={signInMethod} err={err} setErr={setErr} />
          </View>
        )}
      </View>
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
    justifyContent: "flex-end",
    borderWidth: 1,
    borderColor: "#000",
    borderColor: "#fff",
    backgroundColor: "#fa000c",
    padding: 30
  },
  profileContainer: {
    flex: 1,
    marginTop: 40
  },
  profileText: {
    fontSize: 20,
    marginRight: 30,
    color: "#fff"
  }
});
