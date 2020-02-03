import axios from "axios";

const instance = axios.create({
  baseURL: 'http://194.246.80.173:3000/' //"https://kuhenland-test.herokuapp.com"
});

export const signIn = async data => {
  try {
    const res = await instance.post("/users/login", data);

    if (res && res.data.hasOwnProperty("token")) {

      return res.data;
    }
  } catch (err) {
    return { error: true, msg: JSON.stringify(err) };
  }

  return { error: true, msg: 'Ошибка авторизации' };
};

export const getPackageById = async (id, token) => {
  try {
    instance.defaults.headers.common["Authorization"] = `Baerer ${token}`;

    const res = await instance.post("package/byid", { id });

    if (res) {
      return res.data;
    } else {
      localStorage.clear();
    }
  } catch (err) {
    return { error: true, msg: JSON.stringify(err) };
  }

  return { error: true, msg: err };
};

export const updatePackage = async (data, token) => {
  try {
    instance.defaults.headers.common["Authorization"] = `Baerer ${token}`;

    const res = await instance.post("/package/update", data);

    if (res) {
      return res.data;
    }

  } catch (err) {
    return { error: true, msg: JSON.stringify(err) };
  }

  return { error: true, msg: 'Ошика обновления данных' };
};



export const getLocations = async token => {
  try {

    instance.defaults.headers.common['Authorization'] = `Baerer ${token}`;

    const res = await instance.get('/locations');

    if (res) {
      return res.data;
    }
  } catch (err) {
    return { error: true, msg: JSON.stringify(err) };
  }

  return { error: true, msg: 'Ошибка получения данных о локациях' };
}
