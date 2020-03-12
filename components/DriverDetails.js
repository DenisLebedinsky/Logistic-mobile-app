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
import { Container } from 'native-base';
import { useDispatch, useSelector } from "react-redux";
import { packageSelector, updateDriverDetails, errorUpdateSelector } from '../redux/reducers/packages'

const DriverDetails = ({ navigation }) => {
  const dispatch = useDispatch();
  const item = useSelector(packageSelector);
  const updateError = useSelector(errorUpdateSelector)
  const [driverName, serDrivername] = useState(item.driverDetails.driverFullname || '')
  const [regNumber, serregNumber] = useState(item.driverDetails.regNumber || '')


  const update = () => {
    let value = {
      driverDetails: {
        regNumber: item.driverDetails.regNumber,
        driverFullname: item.driverDetails.driverFullname
      }
    };

    if (regNumber !== item.driverDetails.regNumber || driverName !== item.driverDetails.driverFullname) {

      value.driverDetails = {
        driverFullname: driverName,
        regNumber
      }
    }

    dispatch(updateDriverDetails(value, navigation))
  }


  const renderError = () => <View>
    <Text style={styles.err}>
      Ошибка обновления, повторите попытку
   </Text>
  </View>

  const renderContent = () => <View>
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
  </View>

  return (
    <ImageBackground
      source={require("../assets/bg4.png")}
      style={{ width: "100%", height: "100%" }}
    >
      <View style={styles.container}>
        {updateError ? renderError() : renderContent()}

        <TouchableOpacity onPress={update}>
          <View style={styles.btn}>
            <Text style={styles.btnText}>Отправить</Text>
          </View>
        </TouchableOpacity>
      </View >

    </ImageBackground >
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
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
    padding: 10
  },
  btnText: {
    color: "#fff",

    fontSize: 16
  },
  err: {
    color: "red",
    textAlign: "center"
  },
  textInput: {
    backgroundColor: "#fa000c",
    padding: 15,
    margin: 5,
    color: "#fff",
    fontSize: 16
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
