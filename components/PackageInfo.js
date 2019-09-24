import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  AsyncStorage,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  FlatList
} from "react-native";
import { getPackageById, updatePackage } from "../api";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";

const PackageInfo = ({ navigation }) => {
  const id = navigation.getParam("id");
  const [item, setItem] = useState(null);
  const [err, setErr] = useState(false);
  const [isOpenItems, setIsOpenItems] = useState(false);
  const [isOpenTransit, setIsOpenTransit] = useState(false);

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

    console.log(user)
    
    const data = {
      _id: id,
      sendData: Date.now(),
      sendUserId: user.id,
      status: "inProcess"
    };
    const res = updatePackage(data, item.token);
    if (res === "error") {
      setErr(true);
    } else {
      setErr(false);
      navigation.navigate("ShowStatus");
    }
  };

  const toggleItemList = () => {
    setIsOpenItems(!isOpenItems);
  };

  const toggleTransitList = () => {
    setIsOpenTransit(!isOpenTransit);
  };

  const getSendBtn = () => {
    return (
      <TouchableOpacity onPress={send}>
        <View style={styles.btn}>
          <Text style={styles.btnText}>Отправить</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const getSelectBtn = status => {
    if (status === "accepted") {
      return (
        <View>
          <Text style={styles.err}>Комплект уже принят!</Text>
        </View>
      );
    }
    return (
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
              <Text style={styles.btnText}>
                {item.transit.length > 0
                  ? "Принять и закончить маршрут"
                  : "Принять"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ImageBackground
      source={require("../assets/bg4.png")}
      style={{ width: "100%", height: "100%" }}
    >
      <View style={styles.container}>
        {!item && <ActivityIndicator size="large" color="#fa000c" />}
        {item && (
          <View>
            <View style={styles.contentInfo}>
              <View style={styles.info}>
                <Text style={styles.textheader}>Получатель:</Text>
                <Text style={styles.text}>
                  {item.resiverId && item.resiverId.title}
                </Text>
              </View>

              <View style={styles.listBlock}>
                <TouchableOpacity onPress={toggleItemList}>
                  <View style={styles.listbtn}>
                    <Text style={styles.btnText}>
                      {isOpenItems
                        ? "Cкрыть список предметов"
                        : "Показать список предметов"}
                    </Text>
                    <Ionicons name="md-list" size={32} color="#fff" />
                  </View>
                </TouchableOpacity>

                {isOpenItems && (
                  <View>
                    <ScrollView>
                      <FlatList
                        data={item.inventory}
                        renderItem={({ item }) => (
                          <View style={styles.list}>
                            <View style={styles.titleItem}>
                              <Text style={styles.listText}>{item.title}</Text>
                            </View>
                            <View style={styles.countItem}>
                              <Text style={styles.listText}>{item.count}</Text>
                            </View>
                          </View>
                        )}
                        keyExtractor={item => item._id.toString()}
                      ></FlatList>
                    </ScrollView>
                  </View>
                )}
              </View>

              <View style={styles.listBlock}>
                <TouchableOpacity onPress={toggleTransitList}>
                  <View style={styles.listbtn}>
                    <Text style={styles.btnText}>
                      {isOpenTransit
                        ? "Cкрыть транзитные пункты"
                        : "Показать транзитные пункты"}
                    </Text>
                    <Ionicons name="md-list" size={32} color="#fff" />
                  </View>
                </TouchableOpacity>

                {isOpenTransit && item.transit.length > 0 && (
                  <View>
                    <ScrollView>
                      <FlatList
                        data={item.transit}
                        renderItem={({ item }) => (
                          <View style={styles.list}>
                            <View style={styles.titleItemT}>
                              <Text style={styles.listText}>
                                {item.sendLocId && item.sendLocId.title}
                              </Text>
                            </View>
                            <View style={styles.countItemT}>
                              <Text style={styles.listText}>
                                {item.date &&
                                  moment(item.date).format("DD.MM.YYYY hh:mm")}
                              </Text>
                            </View>
                          </View>
                        )}
                        keyExtractor={item => "transit_" + item._id}
                      ></FlatList>
                    </ScrollView>
                  </View>
                )}
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
              {item && item.status !== "notSent"
                ? getSelectBtn(item.status)
                : getSendBtn()}
            </View>
          </View>
        )}
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
  contentInfo: {
    flex: 1,
    marginTop: 30
  },
  info: {
    backgroundColor: "#fa000c",
    padding: 15
  },
  loading: {
    width: 200,
    height: 200
  },
  text: {
    textAlign: "center",
    color: "#fff"
  },
  textheader: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "800"
  },
  listBlock: {
    flex: 1,
    textAlign: "center",
    marginTop: 30,
    minWidth: 300
  },
  list: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    justifyContent: "space-between",
    backgroundColor: "#fa000c",
    padding: 10
  },
  titleItem: {
    width: "70%"
  },
  countItem: {
    width: "20%"
  },
  titleItemT: {
    width: "55%"
  },
  countItemT: {
    width: "40%"
  },
  listText: {
    color: "#fff"
  },
  listbtn: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#fa000c",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10
  },
  btn: {
    backgroundColor: "#fa000c",
    padding: 10,
    borderWidth: 1,
    borderColor: "#fff",
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
