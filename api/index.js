import axios from 'react-native-axios';

const api = axios.create({
  baseURL: 'http://194.246.80.173:3000/api/v2/',
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
});

export default api;
