import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Button,
  TouchableOpacity
} from "react-native";

const Auth = ({ signIn, err, setErr }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const autorize = () => {
  
    signIn({ login, password });
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
      <View style={styles.container}>
        <View style={styles.block}>
          <Text style={err && styles.errText}>Логин:</Text>
          <TextInput
            style={err ? styles.errInput : styles.input}
            textContentType="username"
            placeholder="введите логин..."
            onChangeText={changeLogin}
            value={login}
          />
        </View>
        <View style={styles.block}>
          <Text style={err && styles.errText}>Пароль:</Text>
          <TextInput
            style={err ? styles.errInput : styles.input}
            textContentType="password"
            secureTextEntry={true}
            placeholder="введите пароль..."
            onChangeText={changePassword}
            value={password}
          />
        </View>
        <View style={styles.btnBlock}>
          <TouchableOpacity onPress={autorize}>
            <View style={styles.btn}>
              <Text style={styles.btnText}>Войти</Text>
              </View>            
          </TouchableOpacity>
        </View>
      </View>
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
    borderColor: "#000",
    borderRadius: 25,
    paddingHorizontal: 10,
    width: 200
  },
  input: {
    padding: 10
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
  errInput: {
    padding: 10,
    color: "#ab150a"
  },
  btn:{
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    width:200,
    height: 45,
    color:"#4a0ee3",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 25,
    padding: 10,
  },
  btnText:{
    padding: 10,
    color:'#000'
  }
});

export default Auth;
