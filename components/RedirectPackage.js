import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Picker,
  TextInput,
  AsyncStorage,
  TouchableOpacity
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

  const take = async () => {
    try {
      debugger
      const user = JSON.parse(await AsyncStorage.getItem("USER"));
      const token = await AsyncStorage.getItem("TOKEN");
debugger
      let newDateArr = Date.now();
      if (item.transitSendData) {
        newDateArr = item.transitSendData;
        newDateArr.push(Date.now());
      }

      let newTransitArr = selectLoc;
      if (item.transitSendId) {
        newTransitArr = item.transitSendId;
        newTransitArr.push(selectLoc);
      }
      debugger
      if (user.id && selectLoc && item._id) {
        const data = {
          _id: item._id,
          LastSendlerId: user.id,
          transitSendId: newTransitArr,
          transitSendData: newDateArr
        };
        debugger
        const res = await updatePackage(data, token);

        if (res === "error") {
          setErr(true);
        } else {
          debugger
          navigation.navigate("Home");
        }
      } else {
        debugger
        setErr(true);
      }
    } catch (error) {
      debugger
      console.log(error);
    }
  };

  const cancel = () => {
    navigation.navigate("PackageInfo");
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentInfo}>
        <View style={styles.info}>
          <View>
            <Text style={styles.headTitle}>Конечный получатель:</Text>
            <Text style={styles.textCenter}>{item.factResiverId.title}</Text>
          </View>
          <Text style={styles.textCenter}>
            Выберите нового получателя из списка
          </Text>
          <View style={styles.pickerBlock}>
            <Picker
              selectedValue={selectLoc}
              style={styles.picker}
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
            style={styles.textInput}
            onChangeText={loc => setSelectLoc(loc)}
            value={selectLoc}
          />
        </View>
      </View>
      <View style={styles.contentCenter}>
        {err && (
          <View>
            <Text style={styles.err}>Ошибка обновления, повторите попытку</Text>
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
            <TouchableOpacity onPress={take}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Отправить</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    flex: 1
  },
  btn: {
    backgroundColor: "blue",
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 25
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
    textAlign: "center"
  },
  err: {
    color: "red",
    textAlign: "center"
  },
  pickerBlock: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 25,
    padding: 10,
    margin: 5
  },
  piker: {},
  textInput: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 25,
    padding: 15,
    margin: 5
  },
  textCenter: {
    textAlign: "center",
    marginVertical: 10
  }
});

export default RedirectPackage;
