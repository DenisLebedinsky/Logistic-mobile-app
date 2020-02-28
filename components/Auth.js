import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ImageBackground,
  KeyboardAvoidingView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import DebounceTouchbleOpacity from './helpers/DebounceTouchbleOpacity'

import { authSelector, loginStart } from '../redux/reducers/auth'

function Auth({ navigation }) {
  const auth = useSelector(authSelector);
  const dispatch = useDispatch();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const autorize = () => {
    dispatch(loginStart({ login: login.trim(), password }))
  };

  const changeLogin = text => {
    setLogin(text);
  };

  const changePassword = text => {

    setPassword(text);
  };

  useEffect(() => {
    if (auth.user.id) {
      navigation.navigate("Home");
    }

  }, [auth])


  if (auth.user.laoding) {
    return <View style={styles.contentCenter}>
      <ActivityIndicator size="large" color="#fa000c" />
    </View>
  }

  return (
    <ImageBackground
    source={require("../assets/bg4.png")}
    style={{ width: "100%", height: "100%" }}
  >
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <View style={styles.container}>

        <View style={styles.block}>
          <Text style={styles.lable}>Логин</Text>
          <TextInput
            style={styles.input}
            textContentType="username"
            placeholder="введите логин..."
            onChangeText={changeLogin}
            value={login}
          />
        </View>

        <View style={styles.block}>
          <Text style={styles.lable}>Пароль</Text>
          <TextInput
            style={styles.input}
            textContentType="password"
            secureTextEntry={true}
            placeholder="введите пароль..."
            onChangeText={changePassword}
            value={password}
          />
        </View>

        {auth.error && (
          <View>
            <Text style={styles.errText}>
              {`Введены неверные логин или пароль
              поля регистрозависимые`}
              </Text>
          </View>
        )}

        <View style={styles.btnBlock}>
          <DebounceTouchbleOpacity onPress={autorize} delay={1000}>
            <View style={styles.btn}>
              <Text style={styles.btnText}>Войти</Text>
            </View>
          </DebounceTouchbleOpacity>
        </View>

      </View>
    </KeyboardAvoidingView >
    </ImageBackground>
  );
};

export default Auth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  block: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    margin: 10,
    borderWidth: 2,
    borderColor: "#fa000c",
    //backgroundColor: "#fa000c",
    paddingHorizontal: 10,
    width: 200,
    color: "#fff",
    position: 'relative'
  },
  lable: {
    color: "#fa000c",
    position: 'absolute',
    backgroundColor: '#fff',
    top: -12,
    left: 10,
  },
  input: {
    padding: 10,
    color: "#fa000c",
    fontSize: 14
  },
  btnBlock: {
    width: 200,
    height: 35,
    marginTop: 20,
    borderRadius: 25
  },
  errText: {
    color: "#fa000c"
  },
  btn: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    height: 45,
    borderWidth: 1,
    backgroundColor: "#fa000c",
    padding: 10,
    borderColor: "#fff"
  },
  btnText: {
    padding: 10,
    color: "#fff",
    fontWeight: 'bold'
  }
});


