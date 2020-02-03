import React from "react";

import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import DebounceTouchbleOpacity from './helpers/DebounceTouchbleOpacity'

export default function ShowStatus({ navigation }) {
  const retunToHome = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.textMSG}>Успешно отправлено!</Text>
      </View>
      <View>
        <DebounceTouchbleOpacity onPress={retunToHome}>
          <View style={styles.btn}>
            <Text style={styles.btnText}>Вернуться на главный экран</Text>
          </View>
        </DebounceTouchbleOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical:50
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
    textAlign: "center"
  },
  textMSG: {
    marginTop: 100,
    fontSize: 24,
    color: "#148031",
    fontWeight: "800"
  }
});
