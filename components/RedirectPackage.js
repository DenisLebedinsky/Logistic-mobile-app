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
import DebounceTouchbleOpacity from './helpers/DebounceTouchbleOpacity'
import { useDispatch, useSelector } from "react-redux";
import { locationsSelector, } from '../redux/reducers/locations';
import { sendFromTransit, packageSelector } from '../redux/reducers/packages'

const RedirectPackage = ({ navigation }) => {

  const dispatch = useDispatch();
  const item = useSelector(packageSelector)
  const { list, error } = useSelector(locationsSelector);
  const [selectLoc, setSelectLoc] = useState("");

  const handleChange = loc => {
    setSelectLoc(loc);
  };

  const resend = () => {
    dispatch(sendFromTransit(selectLoc))
    navigation.navigate("DriverDetails");
  };

  const cancel = () => {
    navigation.navigate("PackageInfo");
  };

  return (

    <View style={styles.container}>
      <View style={styles.contentInfo}>
        <View style={styles.info}>
        
          <View style={styles.colorBlock}>
            <Text style={styles.headTitle}>Конечный получатель:</Text>
            <Text style={styles.text}>
              {item.resiverId && item.resiverId.title}
            </Text>
          </View>

          <Text style={styles.textCenter}>
            Выберите нового получателя из списка
            </Text>

          {list &&
            <View style={(styles.pickerBlock, styles.colorBlock)}>
              <Picker
                selectedValue={selectLoc}
                style={(styles.picker, styles.textWihte)}
                onValueChange={loc => handleChange(loc)}
              >

                {list.length &&
                  list.map(loc => (
                    <Picker.Item
                      label={loc.title}
                      value={loc.title}
                      key={loc._id}
                    />
                  ))}
              </Picker>
            </View>
          }
          {/* <Text style={styles.textCenter}>или введите вручную</Text>
            <TextInput
              style={
                (styles.textInput,
                  { ...styles.colorBlock, ...styles.textWihte })
              }
              onChangeText={loc => setSelectLoc(loc)}
              value={selectLoc}
            /> */}
        </View>
      </View>
      <View style={styles.contentCenter}>

        {error && (
          <View>
            <Text style={styles.err}>
              Ошибка обновления, повторите попытку
              </Text>
          </View>
        )}

        <View style={styles.btnBlock}>
          <View>
            <DebounceTouchbleOpacity onPress={cancel} delay={1000}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Отменить</Text>
              </View>
            </DebounceTouchbleOpacity>
          </View>
          <View>
            <DebounceTouchbleOpacity onPress={resend} delay={1000}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Отправить</Text>
              </View>
            </DebounceTouchbleOpacity>
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
    backgroundColor: "#fa000c",
    marginHorizontal: 10,
    padding: 10
  },
  btnText: {
    color: "#fff",
    fontSize: 16
  },
  btnBlock: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10
  },
  title: {
    width: "70%",
    fontSize: 16
  },

  headTitle: {
    fontWeight: "bold",
    textAlign: "left",
    color: "#fff",
    fontSize: 16
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
    color: "#fff",
    fontSize: 16
  },
  textCenter: {
    textAlign: "left",
    marginVertical: 10,
    color: "#000",
    fontWeight: "800"
  },
  colorBlock: {
    backgroundColor: "#fa000c",
    padding: 10
  },
  textWihte: {
    color: "#fff",
    fontWeight: "800",
    fontFamily: 'Roboto',
    fontSize: 17
  },
  text:{
    color: "#000",
    fontWeight: "800",
    fontFamily: 'Roboto',
    fontSize: 17
  }
});

export default RedirectPackage;
