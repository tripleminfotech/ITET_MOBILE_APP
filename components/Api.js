import Url from './Url';
import AsyncStorage from '@react-native-community/async-storage';

export default async function Api(path, method, data) {
  const userToken = await AsyncStorage.getItem('userToken');
  console.log(method);
  if (method === 'GET') {
    console.log(Url + path);
    const result = await fetch(Url + path, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-API-KEY': '64c3140d6e914e143b856bcbc9976f3218',
        'X-Auth-Token': userToken ? userToken : '',
      },
      // data !== undefined ? body:  JSON.stringify(data) : []
    });
    let json = await result.json();
    return json;
  } else if (method === 'POST') {
    let response = await fetch(Url + path, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-API-KEY': '64c3140d6e914e143b856bcbc9976f3218',
        'X-Auth-Token': userToken ? userToken : '',
      },
      body: JSON.stringify(data),
    });
    let json = await response.json();
    return json;
  }
}
