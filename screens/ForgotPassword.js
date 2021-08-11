import React, {Component, useState} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {set} from 'react-native-reanimated';
import Api from '../components/Api';
import globalStyle, {appColor, appName} from '../components/Style';

export default function ForgotPassword({navigation}) {
  const [value, setValue] = useState();
  const [send, setSend] = useState(false);
  const [loading, setLoading] = useState(false);

  const onPress = async () => {
    setLoading(true);
    let json = await Api('/forgot/password', 'POST', {email: value});
    if (!json.error) {
      setSend(true);
      setLoading(false);
    } else {
      setSend(false);
      setLoading(false);
      alert(json.message);
    }
  };
  return (
    <>
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator />
        </View>
      ) : send ? (
        <View
          style={{
            justifyContent: 'center',
            flexDirection: 'column',
            flex: 1,
            backgroundColor: 'white',
          }}>
          <Text style={{textAlign: 'center', fontSize: 20}}>
            Your Password Reset Link Sended Successfully.Please Check Your
            Email.
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{color: appColor, textAlign: 'center', marginTop: 10}}>
              Click Here To Login Page
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            justifyContent: 'center',
            flexDirection: 'column',
            flex: 1,
            backgroundColor: 'white',
          }}>
          <Text style={{textAlign: 'center', fontSize: 24}}>
            Forgot Password
          </Text>
          <Text style={{textAlign: 'center', color: '#8F9BB3', margin: 20}}>
            Please enter your registered email then we will help you create a
            new password
          </Text>
          <TextInput
            style={styles.inputStyle}
            keyboardType="email-address"
            placeholderColor="#c4c3cb"
            autoCapitalize={'none'}
            onChangeText={(text) => setValue(text)}
            value={value}
            placeholder="Enter Your Email"
            placeholderTextColor="#8b9cb5"
          />
          <TouchableOpacity
            style={(globalStyle.appColor, styles.buttonStyle)}
            activeOpacity={0.5}
            onPress={() => onPress()}>
            <Text style={styles.buttonTextStyle}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  inputStyle: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    marginBottom: 5,
    height: 50,
    fontSize: 14,
    color: '#8b9cb5',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'white',
    backgroundColor: '#F4F4F4',
  },
  buttonStyle: {
    height: 50,
    backgroundColor: appColor,
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 20,
    marginBottom: 5,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
});
