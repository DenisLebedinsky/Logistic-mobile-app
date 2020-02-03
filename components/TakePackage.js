import React from "react";
import { StyleSheet, Text, View, ScrollView, FlatList } from "react-native";
import DebounceTouchbleOpacity from './helpers/DebounceTouchbleOpacity'

const TakePackage = ({ navigation }) => {
  const packageItem = navigation.getParam("item");

  const take = async () => {
    navigation.navigate("TakePackageFinal", { item: packageItem });
  };

  const cancel = () => {
    navigation.navigate("PackageInfo");
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentInfo}>
        <View style={styles.info}>
          <Text style={styles.headTitle}>ОПИСЬ ВЛОЖЕНИЯ:</Text>
          <ScrollView>
            <FlatList
              data={packageItem.inventory}
              renderItem={({ item }) => (
                <View style={styles.list}>
                  <View style={styles.title}>
                    <Text>{item.title}</Text>
                  </View>
                  <View style={styles.count}>
                    <Text>{item.count}</Text>
                  </View>
                </View>
              )}
              keyExtractor={item => item._id.toString()}
            ></FlatList>
          </ScrollView>
        </View>
      </View>
      <View style={styles.contentCenter}>
        <View style={styles.btnBlock}>
          <View>
            <DebounceTouchbleOpacity onPress={cancel}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Отменить</Text>
              </View>
            </DebounceTouchbleOpacity>
          </View>
          <View>
            <DebounceTouchbleOpacity onPress={take}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Принять</Text>
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
  loading: {
    width: 200,
    height: 200
  },
  btn: {
    backgroundColor: "#fa000c",
    marginHorizontal: 10,
    padding: 10,
  
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
  err: {
    color: "red",
    textAlign: "center"
  }
});

export default TakePackage;
