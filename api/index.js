import axios from 'react-native-axios';

const api = axios.create({
  baseURL: 'http://baa297a3.ngrok.io',//'https://kuhenland-test.herokuapp.com/',
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
});

export default api;
