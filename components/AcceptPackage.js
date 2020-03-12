import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, ActivityIndicator } from "react-native";
import DebounceTouchbleOpacity from './helpers/DebounceTouchbleOpacity'
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from '../redux/reducers/auth'
import { packageSelector, errorSelector, updateLaodingSelector, acceptPackage } from '../redux/reducers/packages';

const AcceptPackage = ({ navigation }) => {

  const dispatch = useDispatch();
  const item = useSelector(packageSelector);
  const auth = useSelector(authSelector)
  const error = useSelector(errorSelector);
  const updateLaoding = useSelector(updateLaodingSelector)
  const finalWerehouse = auth.user.locationId === item?.resiverId?._id;

  const [comment, setComment] = useState(item.comment || '');

  const onAccept = () => {
    dispatch(acceptPackage(comment, navigation));
  };

  const cancel = () => {
    navigation.navigate("PackageInfo");
  };

  if (updateLaoding) {
    return <View style={styles.contentCenter}>
      <ActivityIndicator size="large" color="#fa000c" />
    </View>
  }


  return (
    <View style={styles.container}>
      <View style={styles.contentInfo}>
        <View style={styles.info}>
          <Text style={styles.headTitle}>Комментарий:</Text>
          <TextInput
            style={styles.textInput}
            multiline={true}
            numberOfLines={30}
            onChangeText={text => setComment(text)}
            value={comment}
          />
        </View>
      </View>
      <View style={styles.contentCenter}>

        {error && (
          <View>
            <Text style={styles.err}>Ошибка обновления, повторите попытку</Text>
          </View>
        )}
      </View>

      <View style={styles.btnBlock}>

        <View>
          <DebounceTouchbleOpacity onPress={cancel}>
            <View style={styles.btn}>
              <Text style={styles.btnText}>Отменить</Text>
            </View>
          </DebounceTouchbleOpacity>
        </View>

        <View>
          <DebounceTouchbleOpacity onPress={onAccept}>
            <View style={styles.btn}>
              <Text style={styles.btnText}>Принять</Text>
            </View>
          </DebounceTouchbleOpacity>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    margin: 30
  },
  contentCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  contentInfo: {
    marginTop: 30,
    justifyContent: "space-between",
  },
  info: {

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
    color: "#fff",
    fontFamily: 'Roboto',
    fontSize: 16
  },
  btnBlock: {

    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10
  },
  list: {

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
    // height: 400,
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

export default AcceptPackage;
