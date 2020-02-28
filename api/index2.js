// import axios from "axios";

// const api = axios.create({
//   baseURL: 'http://194.246.80.173:3000/' //"https://kuhenland-test.herokuapp.com"
// });

// export const signIn = async data => {
//   try {
//     const res = await api.post("/users/login", data);

//     if (res && res.data.hasOwnProperty("token")) {
//       return res.data;
//     }
//   } catch (err) {
//     return { error: true, msg: JSON.stringify(err) };
//   }

//   return { error: true, msg: 'Ошибка авторизации' };
// };

// export const getPackageById = async (id, token) => {
//   try {
//     api.defaults.headers.common["Authorization"] = `Baerer ${token}`;

//     const res = await api.post("package/byid", { id });

//     if (res) {
//       return res.data;
//     } else {
//      // localStorage.clear();
//     }
//   } catch (err) {
//     return { error: true, msg: JSON.stringify(err) };
//   }

//   return { error: true, msg: err };
// };

// export const updatePackage = async (data, token) => {
//   try {
//     api.defaults.headers.common["Authorization"] = `Baerer ${token}`;

//     const res = await api.post("/package/update", data);

//     if (res) {
//       return res.data;
//     }

//   } catch (err) {
//     return { error: true, msg: JSON.stringify(err) };
//   }

//   return { error: true, msg: 'Ошика обновления данных' };
// };

// export const getLocations = async token => {
//   try {
//     api.defaults.headers.common["Authorization"] = `Baerer ${token}`;

//     const res = await api.post("/locations", {skip:0, limit: 10000});

//     if (res) {
//       return res.data;
//     }
//   } catch (err) {
//     return { error: true, msg: JSON.stringify(err) };
//   }

//   return { error: true, msg: 'Ошибка получения данных о локациях' };
// }
