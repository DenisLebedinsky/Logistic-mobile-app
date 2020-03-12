import { ToastAndroid } from 'react-native';

export default function (msg) {
    return ToastAndroid.showWithGravity(
        msg,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        50,
      );
}