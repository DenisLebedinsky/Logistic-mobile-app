import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  TouchableOpacity
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Auth = ({ signIn, err, setErr, isLoading }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const autorize = () => {
    signIn({ login: login.trim(), password });
  };

  const changeLogin = text => {
    if (err) {
      setErr(false);
    }
    setLogin(text);
  };

  const changePassword = text => {
    if (err) {
      setErr(false);
    }
    setPassword(text);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      {isLoading ? (
        <View style={styles.contentCenter}>
          <ActivityIndicator size="large" color="#fa000c" />
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.block}>
            <Text style={styles.lable}>Логин:</Text>
            <TextInput
              style={styles.input}
              textContentType="username"
              placeholder="введите логин..."
              onChangeText={changeLogin}
              value={login}
            />
          </View>
          <View style={styles.block}>
            <Text style={styles.lable}>Пароль:</Text>
            <TextInput
              style={styles.input}
              textContentType="password"
              secureTextEntry={true}
              placeholder="введите пароль..."
              onChangeText={changePassword}
              value={password}
            />
          </View>

          {err && (
            <View>
              <Text style={styles.errText}>
                Введены неверные логин и пароль
              </Text>
            </View>
          )}

          <View style={styles.btnBlock}>
            <TouchableOpacity onPress={autorize}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Войти</Text>
                <Ionicons name="md-log-in" size={32} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

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
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "#fa000c",
    paddingHorizontal: 10,
    width: 200,
    color: "#fff"
  },
  lable: {
    color: "#fff"
  },
  input: {
    padding: 10,
    color: "#fff"
  },
  btnBlock: {
    width: 200,
    height: 35,
    marginTop: 20,
    borderRadius: 25
  },
  errText: {
    color: "#ab150a"
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
    color: "#fff"
  }
});

export default Auth;
