import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  StyleSheet,
  Text,
  View,
  Image,
  AsyncStorage,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  FlatList
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import DebounceTouchbleOpacity from './helpers/DebounceTouchbleOpacity'
import { authSelector } from '../redux/reducers/auth'
import { packageSelector, errorSelector, loadingSelector, changeUpdateItem, setUpdateItem } from '../redux/reducers/packages';
import { Container, Content } from "native-base";

const PackageInfo = ({ navigation }) => {
  const [isOpenItems, setIsOpenItems] = useState(false);
  const [isOpenTransit, setIsOpenTransit] = useState(false);

  const dispatch = useDispatch();
  const item = useSelector(packageSelector);
  const auth = useSelector(authSelector)
  const error = useSelector(errorSelector);
  const loading = useSelector(loadingSelector)
  const finalWerehouse = auth.user.locationId === item?.resiverId?._id;


  const onAccept = () => {
    navigation.push("AcceptPackage");
  };

  const transmit = () => {
    navigation.push("RedirectPackage");
  };

  const send = () => {
    const data = {
      _id: item._id,
      sendData: Date.now(),
      sendUserId: auth?.user?.id || '',
      status: "передано в доставку"
    };

    dispatch(changeUpdateItem(data))
    navigation.push("DriverDetails");
  };

  const toggleItemList = () => {
    setIsOpenItems(!isOpenItems);
  };

  const toggleTransitList = () => {
    setIsOpenTransit(!isOpenTransit);
  };

  const renderLoadError = () => <View>
    <Text style={styles.err}>
      {`Ошибка загрузки данных об отправлении,
       повторите попытку`}
    </Text>
    <DebounceTouchbleOpacity onPress={() => navigation.pop(1)} delay={1000}>
      <View style={styles.btn}>
        <Text style={styles.btnText}>Вернуться к сканированию</Text>
      </View>
    </DebounceTouchbleOpacity>
  </View>

  const renderInventoryEmpty = () => <View>
    <Text style={styles.err}>
      {`Список предметов пуст`}
    </Text>
  </View>

  const renderTransitEmpty = () => (<View>
    <Text style={styles.err}>
      {`Транзитные пункты не добавлены`}
    </Text>
  </View>)

  const renderButton = () => {
    console.log(item)

    if (item.status === "accepted" || item.status === "доставлено") {
      return (
        <View>
          <Text style={styles.err}>Комплект уже принят!</Text>
        </View>
      );
    }

    if (item.status === "notSent" || item.status === "не отправлено") {
      return (
        <DebounceTouchbleOpacity onPress={send}>
          <View style={styles.btn}>
            <Text style={styles.btnText}>Отправить</Text>
          </View>
        </DebounceTouchbleOpacity>
      );
    }


    return (
      <View style={styles.btnBlock}>
        <View>
          {!finalWerehouse &&
            <DebounceTouchbleOpacity onPress={transmit}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Переслать</Text>
              </View>
            </DebounceTouchbleOpacity>
          }
        </View>
        <View>

          <DebounceTouchbleOpacity onPress={onAccept}>
            {!finalWerehouse ? (
              <View style={styles.btn}>
                <Text style={styles.btnText}>
                  Принять на транзитный склад
                  </Text>
              </View>
            ) : (
                <View style={styles.btn}>
                  <Text style={styles.btnText}>
                    Принять и закончить маршрут
                  </Text>
                </View>
              )}
          </DebounceTouchbleOpacity>

        </View>
      </View>
    );
  };

  const renderInventory = () => <View>
    <DebounceTouchbleOpacity onPress={toggleItemList}>
      <View style={styles.listbtn}>
        <Text style={styles.btnText}>
          {isOpenItems
            ? "Cкрыть список предметов"
            : "Показать список предметов"}
        </Text>
        <Ionicons name="md-list" size={32} color="#fff" />
      </View>
    </DebounceTouchbleOpacity>

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



  const renderTransit = () => <View>
    <DebounceTouchbleOpacity onPress={toggleTransitList}>
      <View style={styles.listbtn}>
        <Text style={styles.btnText}>
          {isOpenTransit
            ? "Cкрыть транзитные пункты"
            : "Показать транзитные пункты"}
        </Text>
        <Ionicons name="md-list" size={32} color="#fff" />
      </View>
    </DebounceTouchbleOpacity>

    {isOpenTransit && item.transit?.length > 0 && (
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


  if (error) {
    return <Container style={{ justifyContent: 'center' }}>
      {error && <View>
        <Text style={styles.err}>
          {`При загрузки данных возникла ошибка,
        проверте интернет соединение 
        и повторите попытку`}
        </Text>
      </View>}
    </Container>
  }

  return (
    <Container style={{ justifyContent: 'center' }}>

      {loading && <ActivityIndicator size="large" color="#fa000c" />}

      {!loading && !item && renderLoadError()}

      {!loading && item &&
        // <View style={styles.contentInfo}>
        <Content style={styles.contentInfo}>
          <View style={styles.info}>

            <Text style={styles.textheader}>Получатель:</Text>
            <Text style={styles.text}>
              {item.resiverId && item.resiverId.title}
            </Text>

            <Text style={styles.textheader}>Примечание:</Text>
            <Text style={styles.text}>
              {item.note}
            </Text>

          </View>

          <View style={styles.listBlock}>
            {item.inventory?.length ? renderInventory() : renderInventoryEmpty()}
          </View>

          <View style={styles.listBlock}>
            {item.transit?.length ? renderTransit() : renderTransitEmpty()}
          </View>

          <View style={styles.listBlock}>
            <View style={styles.driverDetails}>
              <Text style={styles.textheader}>Транспортные данные:</Text>
              <Text style={styles.text}>
                {`ФИО ${item.driverDetails.driverFullname}`}
              </Text>
              <Text style={styles.text}>
                {`№ ${item.driverDetails.regNumber}`}
              </Text>
            </View>
          </View>

        </Content>
      }
      <View style={styles.contentCenter}>
        {!loading && item && renderButton()}
      </View>

    </Container>
  )
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
    marginTop: 30,
    marginBottom: 15,
    paddingHorizontal: 20
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
    // textAlign: "center",
    color: "#000",
    fontFamily: 'Roboto',
    fontSize: 17,
    fontWeight: '700'
  },
  textheader: {
    // textAlign: "center",
    color: "#fff",
    fontWeight: "800",
    fontFamily: 'Roboto',
    fontSize: 17
  },
  listBlock: {
    flex: 1,
    // textAlign: "center",
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
    color: "#000",
    fontFamily: 'Roboto',
    fontSize: 17
  },
  listbtn: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#fa000c",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingRight: 30,
    paddingLeft: 10
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#fa000c",
    padding: 10,
    borderWidth: 1,
    borderColor: "#fff",
    margin: 10
  },
  btnText: {
    color: "#fff",
    fontFamily: 'Roboto',
    fontSize: 16
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
    textAlign: "center",
    fontFamily: 'Roboto',
    fontSize: 16,
    marginVertical: 20
  },
  driverDetails: {
    alignItems: 'flex-start',
    paddingLeft: 10,
    paddingVertical: 10,
    backgroundColor: "#fa000c"
  },

});

export default PackageInfo;
