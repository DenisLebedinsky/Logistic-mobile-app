import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { StyleSheet, Text, View, Button } from "react-native";
import * as Permissions from "expo-permissions";
import { getPackage } from '../redux/reducers/packages';
import { BarCodeScanner } from "expo-barcode-scanner";
import BarcodeMask from 'react-native-barcode-mask';

const BarcodeScanner = ({ navigation }) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    getPermissionsAsync();
  });

  getPermissionsAsync = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      setHasCameraPermission(status === "granted");
    }
    catch (err) {
      console.log(err)
    }
  };

  handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    dispatch(getPackage(data));

    navigation.push('PackageInfo');
  };

  if (hasCameraPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Получение разрешений</Text>
        <Text>на использование камеры </Text>
      </View>
    );
  }

  if (hasCameraPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />

      <BarcodeMask width={300} height={300} />

      {scanned && (
        <Button title={"Повторить сканирование"} onPress={() => setScanned(false)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#000'
  }
});

export default BarcodeScanner;
