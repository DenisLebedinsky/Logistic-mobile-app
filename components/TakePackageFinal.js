import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, AsyncStorage } from "react-native";
import { updatePackage } from "../api";
import { TouchableOpacity } from "react-native-gesture-handler";

const TakePackageFinal = ({ navigation }) => {
  const [comment, setComment] = useState("");
  const packageItem = navigation.getParam("item");

  const [err, ssetErr] = useState(false);

  const take = async () => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem("USER"));
      const token = await AsyncStorage.getItem("TOKEN");

      if (user.id && user.locationId && packageItem._id) {
        const status = user.locationId !== item.resiverId._id ? 'Принято на транзитном складе': 'доставлено';
 
        const data = {
          _id: packageItem._id,
          status,
          recipientId: user.id,
          factresiverId: user.locationId,
          resiveData: Date.now(),
          comment: comment
        };

        const res = await updatePackage(data, token);
        if (res === "error") {
          ssetErr(true);
        } else {
          navigation.navigate("ShowStatus");
        }
      } else {
        ssetErr(true);
      }
    } catch (error) {
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
          <Text style={styles.headTitle}>Комментарий:</Text>
          <TextInput
            style={styles.textInput}
            multiline={true}
            numberOfLines={10}
            onChangeText={text => setComment(text)}
            value={comment}
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
                <Text style={styles.btnText}>Готово</Text>
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
    flex: 1,
    width: 300,
    height: "70%"
  },
  loading: {
    width: 200,
    height: 200
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
  list: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    borderBottomWidth: 1,
    justifyContent: "space-between"
  },
  title: {
    width: "70%"
  },
  count: {
    width: "20%"
  },
  headTitle: {
    fontWeight: "bold",
    marginBottom: 10
  },
  textInput: {
    padding: 10,
    textAlignVertical: "top",
    borderColor: "#fa000c",
    borderWidth: 1
  },
  err: {
    color: "red",
    textAlign: "center"
  }
});

export default TakePackageFinal;
