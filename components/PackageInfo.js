import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  AsyncStorage,
  TouchableOpacity
} from "react-native";
import { getPackageById, updatePackage } from "../api";

const PackageInfo = ({ navigation }) => {
  const id = navigation.getParam("id");
  const [item, setItem] = useState(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    if (!item) {
      getPackage();
    }
  });

  const getPackage = async () => {
    try {
      const token = await AsyncStorage.getItem("TOKEN");
      const res = await getPackageById(id, token);
      if (res !== "error") {
        console.log(res);
        setItem({ ...res, token });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const take = () => {
    navigation.navigate("TakePackage", { item });
  };

  const transmit = () => {
    navigation.navigate("RedirectPackage", { item });
  };

  const send = async () => {
    const user = JSON.parse(await AsyncStorage.getItem("USER"));

    const data = {
      _id: id,
      sendData: Date.now(),
      sendUserId: user._id,
      status: "inProcess"
    };
    const res = updatePackage(data, item.token);
    if (res === "error") {
      setErr(true);
    } else {
      setErr(false);
      navigation.navigate("Home");
    }
  };

  return (
    <View style={styles.container}>
      {!item && (
        <Image
          style={styles.loading}
          source={require("../assets/loading.gif")}
        />
      )}
      {item && (
        <View>
          <View style={styles.contentInfo}>
            <View style={styles.info}>
              <Text>Получатель:</Text>
              <Text>{item.resiverId && item.resiverId.title}</Text>
            </View>
          </View>
          {err && (
            <View>
              <Text style={styles.err}>
                Ошибка обновления статуса, повторите попытку
              </Text>
            </View>
          )}
          <View style={styles.contentCenter}>
            {item && item.status !== "NotSend" ? (
              <View style={styles.btnBlock}>
                <View>
                  <TouchableOpacity onPress={transmit}>
                    <View style={styles.btn}>
                      <Text style={styles.btnText}>Переслать</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity onPress={take}>
                    <View style={styles.btn}>
                      <Text style={styles.btnText}>Принять</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity onPress={send}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>Отправить</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
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
  contentInfo: {
    flex: 1,
    marginTop: 30
  },
  info: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 25,
    padding: 15
  },
  loading: {
    width: 200,
    height: 200
  },
  btn: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 25,
    margin: 10
  },
  btnText: {
    color: "#fff"
  },
  btnBlock: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center"
  },
  err: {
    color: "red",
    textAlign: "center"
  }
});

export default PackageInfo;
