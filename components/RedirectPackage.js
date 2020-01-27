import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Picker,
  TextInput,
  AsyncStorage,
  TouchableOpacity,
  ImageBackground
} from "react-native";
import { getLocations, updatePackage } from "../api";

const RedirectPackage = ({ navigation }) => {
  const item = navigation.getParam("item");

  const [locations, setLocations] = useState(null);
  const [selectLoc, setSelectLoc] = useState("");
  const [err, setErr] = useState(false);

  useEffect(() => {
    if (!locations) {
      fetchLocations();
    }
  });

  fetchLocations = async () => {
    const token = await AsyncStorage.getItem("TOKEN");
    const res = await getLocations(token);

    if (res !== "error") {
      setLocations(res);
    }
  };

  const handleChange = loc => {
    setSelectLoc(loc);
  };

  const resend = async () => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem("USER"));
      const token = await AsyncStorage.getItem("TOKEN");

      let dateNow = Date.now();

      if (
        item.transit.length > 0 &&
        !item.transit[item.transit.length - 1].date
      ) {
        item.transit[item.transit.length - 1].date = dateNow;
        item.transit[item.transit.length - 1].sendfactLocId = user.locationId;
        item.transit[item.transit.length - 1].userId = user.id;
      }

      if (
        !(
          item.reciverId._id === selectLoc ||
          item.reciverId.title.toLowerCase() === selectLoc.toLowerCase()
        )
      ) {
        item.transit.push({
          sendLocId: { title: selectLoc }
        });
      }

      if (user.id && selectLoc && item._id) {
        const data = {
          _id: item._id,
          transit: item.transit,
          test: item.reciverId,
          status: "передано в доставку"
        };

        navigation.navigate("RedirectPackage", { data, token });
      } else {
        setErr(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const cancel = () => {
    navigation.navigate("PackageInfo");
  };

  return (
    <ImageBackground
      source={require("../assets/bg4.png")}
      style={{ width: "100%", height: "100%" }}
    >
      <View style={styles.container}>
        <View style={styles.contentInfo}>
          <View style={styles.info}>
            <View style={styles.colorBlock}>
              <Text style={styles.headTitle}>Конечный получатель:</Text>
              <Text style={(styles.textCenter, styles.textWihte)}>
                {item.reciverId && item.reciverId.title}
              </Text>
            </View>
            <Text style={styles.textCenter}>
              Выберите нового получателя из списка
            </Text>
            <View style={(styles.pickerBlock, styles.colorBlock)}>
              <Picker
                selectedValue={selectLoc}
                style={(styles.picker, styles.textWihte)}
                onValueChange={loc => handleChange(loc)}
              >
                {locations &&
                  locations.map(loc => (
                    <Picker.Item
                      label={loc.title}
                      value={loc.title}
                      key={loc._id}
                    />
                  ))}
              </Picker>
            </View>
            <Text style={styles.textCenter}>или введите вручную</Text>
            <TextInput
              style={
                (styles.textInput,
                { ...styles.colorBlock, ...styles.textWihte })
              }
              onChangeText={loc => setSelectLoc(loc)}
              value={selectLoc}
            />
          </View>
        </View>
        <View style={styles.contentCenter}>
          {err && (
            <View>
              <Text style={styles.err}>
                Ошибка обновления, повторите попытку
              </Text>
            </View>
          )}
          <View style={styles.btnBlock}>
            <View>
              <TouchableOpacity onPress={cancel}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>Отменить</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity onPress={resend}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>Отправить</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
    flex: 1
  },
  btn: {
    backgroundColor: "#fa000c",
    marginHorizontal: 10,
    padding: 10
  },
  btnText: {
    color: "#fff"
  },
  btnBlock: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10
  },
  title: {
    width: "70%"
  },

  headTitle: {
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#fff"
  },
  err: {
    color: "red",
    textAlign: "center"
  },
  pickerBlock: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 25,
    padding: 10,
    margin: 5
  },
  piker: {
    color: "#fff"
  },
  textInput: {
    padding: 15,
    margin: 5,
    color: "#fff"
  },
  textCenter: {
    textAlign: "center",
    marginVertical: 10,
    color: "#000",
    fontWeight: "800"
  },
  colorBlock: {
    backgroundColor: "#fa000c"
  },
  textWihte: {
    color: "#fff",
    padding: 10
  }
});

export default RedirectPackage;
