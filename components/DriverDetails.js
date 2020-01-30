import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ImageBackground,
  TouchableOpacity,
  Button
} from "react-native";
import { getPackageById, updatePackage } from "../api";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";

const DriverDetails = ({ navigation }) => {
  const data = navigation.getParam("data");
  const token = navigation.getParam("token");

  const [driverName, serDrivername] = useState('')
  const [regNumber, serregNumber] = useState('')
  const [error, setError] = useState(false);
  
  const update = async () => {
    
    data.note = {
      regNumber: regNumber,
      driverFullname: driverName,
    };

    const res = await updatePackage(data, token);


    if (res === "error") {
      setError(true)
    } else {
      navigation.navigate("ShowStatus");
    }
  }

  return (
    <ImageBackground
      source={require("../assets/bg4.png")}
      style={{ width: "100%", height: "100%" }}
    >
      <View style={styles.container}>
        {error ? (
          <View>
            <Text style={styles.err}>
              Ошибка обновления, повторите попытку
              </Text>


          </View>) : (
            <View>
              <View style={styles.textBlock}>

                <Text style={styles.text}>ФИО водителя</Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={text => serDrivername(text)}
                  value={driverName}
                />
              </View>

              <View style={styles.textBlock}>
                <Text style={styles.text}>Рег. номер автомобиля</Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={text => serregNumber(text)}
                  value={regNumber}
                />
              </View>
            </View>)}

        <TouchableOpacity onPress={update}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Отправить</Text>
              </View>
            </TouchableOpacity>
      </View>

    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 50
  },
  contentCenter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  textBlock: {
    textAlign: "center",
    marginVertical: 10,
    color: "#000",
    fontWeight: "800",
    fontSize: 24, 
    minWidth: 300
  },
  btn: {
    marginTop: 20,
    backgroundColor: "#fa000c",
    marginHorizontal: 10,
    padding: 20
  },
  btnText: {
    color: "#fff"
  },
  err: {
    color: "red",
    textAlign: "center"
  },
  textInput: {
    backgroundColor:"#fa000c",
    padding: 15,
    margin: 5,
    color: "#fff"
  },
  colorBlock: {
    backgroundColor: "#fa000c"
  },
  textWihte: {
    color: "#fff",
    padding: 10
  }
});

export default DriverDetails;
