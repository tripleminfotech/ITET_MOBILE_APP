import React, {Component, useEffect, useState} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import {set} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome5';

import globalStyle, {appColor, appName} from '../components/Style';
import {ActivityIndicator} from 'react-native-paper';
// import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import Api from '../components/Api';
import Toast from 'react-native-simple-toast';
import store from '../store';
import {getNotification} from '../reducers/cartItems';
import AsyncStorage from '@react-native-community/async-storage';

export default function Signup({navigation}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [disable, setDisable] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [check, setCheck] = useState(true);
  const [hidePass, setHidePass] = useState(true);

  var data;
  useEffect(() => {
    if (name != '' && email != '' && password != '' && password2 != '') {
      setDisable(false);
      if (password === password2) {
        setDisable(false);
      } else {
        setDisable(true);
      }
    } else {
      setDisable(true);
    }
  }, [name, email, password2, password]);
  // useEffect(() =>{
  //         if(password === password2){
  //             setCheck(false);
  //         }
  //         else{
  //             setCheck(true);
  //         }

  // },[password2])
  const login = async () => {
    let json = await Api(`/login`, 'POST', {
      email: email,
      password: password,
    });
    AsyncStorage.setItem('userToken', json.token);
    AsyncStorage.setItem('UserId', json.user_id);
    AsyncStorage.setItem('UserEmail', json.email);
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Discover',
        },
      ],
    });
    Toast.show(`Register successfully..!`, Toast.LONG);
  };
  const onSignupPress = async () => {
    if (password.length < 8) {
      alert('Password length must be greater than 8 characters');
    } else {
      try {
        setLoading(true);
        let json = await Api(`/register/user`, 'POST', {
          name: name,
          email: email,
          password: password,
        });
        //   let response =await fetch("https://testing.itexpertsacademy.com/api/register/user",{
        //             method: 'POST',
        //             headers: {
        //               Accept: 'application/json',
        //               'Content-Type': 'application/json',
        //               'X-API-KEY': '64c3140d6e914e143b856bcbc9976f3218'
        //             },
        //             body: JSON.stringify({
        //                 name: name,
        //               email: email,
        //               password: password
        //             })
        //         });
        //   let json = await response.json();
        data = json;
        console.log(json);
        return json;
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        if (data.error === null) {
          login();
        } else {
          alert(data.message);
        }
      }
    }
  };
  return (
    <View style={styles.mainBody}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <View>
            <KeyboardAvoidingView enabled>
              <View style={{alignItems: 'center', marginTop: 40}}>
                <Image
                  source={require('../logo-dark.png')}
                  style={styles.logo}
                />
              </View>
              <View style={styles.header}>
                <Text
                  style={{
                    fontSize: 24,
                    margin: 1,
                    textAlign: 'center',
                    justifyContent: 'center',
                  }}>
                  Welcome to {appName}
                </Text>
                <Text
                  style={{
                    marginTop: 5,
                    textAlign: 'center',
                    color: '#8F9BB3',
                  }}>
                  Please create your account here.
                </Text>
              </View>
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  keyboardType="email-address"
                  placeholderColor="#c4c3cb"
                  autoCapitalize={'none'}
                  onChangeText={(text) => setName(text)}
                  value={name}
                  placeholder="Username"
                  placeholderTextColor="#8b9cb5"
                  returnKeyType="next"
                />
              </View>
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  keyboardType="email-address"
                  placeholderColor="#c4c3cb"
                  autoCapitalize={'none'}
                  onChangeText={(text) => setEmail(text)}
                  value={email}
                  placeholder=" Email"
                  placeholderTextColor="#8b9cb5"
                  returnKeyType="next"
                />
              </View>
              <View style={styles.passwordStyle}>
                <TextInput
                  style={styles.inputStyle}
                  autoCapitalize={'none'}
                  onChangeText={(text) => setPassword(text)}
                  value={password}
                  placeholder="Password"
                  placeholderTextColor="#8b9cb5"
                  keyboardType="default"
                  onSubmitEditing={Keyboard.dismiss}
                  returnKeyType="next"
                  secureTextEntry={hidePass ? true : false}
                />
                <Icon
                  style={{
                    right: 30,
                    top: 10,
                    resizeMode: 'contain',
                  }}
                  name={hidePass ? 'eye-slash' : 'eye'}
                  size={15}
                  color="grey"
                  onPress={() => setHidePass(!hidePass)}
                />
              </View>
              <View style={styles.passwordStyle}>
                <TextInput
                  style={styles.inputStyle}
                  autoCapitalize={'none'}
                  onChangeText={(text) => setPassword2(text)}
                  value={password2}
                  placeholder="Confirm Password"
                  placeholderTextColor="#8b9cb5"
                  keyboardType="default"
                  onSubmitEditing={Keyboard.dismiss}
                  returnKeyType="next"
                  secureTextEntry={hidePass ? true : false}
                />
                <Icon
                  style={{
                    right: 30,
                    top: 10,
                    resizeMode: 'contain',
                  }}
                  name={hidePass ? 'eye-slash' : 'eye'}
                  size={15}
                  color="grey"
                  onPress={() => setHidePass(!hidePass)}
                />
              </View>

              <TouchableOpacity
                disabled={disable}
                onPress={() => onSignupPress()}
                style={{
                  ...styles.buttonStyle,
                  backgroundColor: !disable ? appColor : 'gray',
                }}>
                <Text style={styles.buttonTextStyle}>SIGNUP</Text>
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginBottom: 10,
                }}>
                <Text
                  style={{
                    fontSize: 17,
                    color: '#8F9BB3',
                    textAlign: 'center',
                  }}>
                  I already have an account!
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('login')}>
                  <Text style={{fontSize: 17, color: appColor, marginLeft: 5}}>
                    Signin
                  </Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    alignContent: 'center',
  },
  logo: {
    width: '50%',
    height: 100,
    resizeMode: 'contain',
    margin: 5,
  },
  header: {
    flexDirection: 'column',
    height: 40,
    marginTop: 2,
    margin: 10,
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 25,
    marginLeft: 35,
    marginRight: 35,
    margin: 5,
  },
  passwordStyle: {
    flexDirection: 'row',
    height: 40,
    width: '88%',
    marginTop: 30,
    marginLeft: 35,
    marginRight: 35,
    margin: 5,
    resizeMode: 'contain',
  },
  forgotpass: {
    alignContent: 'center',
    justifyContent: 'center',
    margin: 10,
    marginRight: 35,
  },
  forgotpasstext: {
    color: '#8F9BB3',
    textAlign: 'right',
    margin: 1,
  },
  buttonStyle: {
    backgroundColor: appColor,
    borderWidth: 0,
    height: 40,
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: '#8b9cb5',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'white',
    backgroundColor: '#F4F4F4',
  },
  registerTextStyle: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
});
