import React, {Component,} from 'react';
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

import globalStyle, {appColor, appName} from '../components/Style';
import {ActivityIndicator} from 'react-native-paper';

// import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import Api from '../components/Api';
import Toast from 'react-native-simple-toast';
import store from '../store';
import {getNotification} from '../reducers/cartItems';
import AsyncStorage from '@react-native-community/async-storage';

const appId = '1047121222092614';

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: '',
      isLoading: false,
      username: '',
      password: '',
      nav: '',
      userInfo: {},
      hidden: true,
    };
  }

  render() {
    const {data, isLoading} = this.state;
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
                  <Text style={styles.headerText}>Welcome to {appName}</Text>
                  <Text
                    style={{
                      marginTop: 5,
                      textAlign: 'center',
                      color: '#8F9BB3',
                    }}>
                    Please login your account.
                  </Text>
                </View>
                <View style={styles.SectionStyle}>
                  <TextInput
                    style={styles.inputStyle}
                    keyboardType="email-address"
                    placeholderColor="#c4c3cb"
                    autoCapitalize={'none'}
                    onChangeText={(text) => this.setState({username: text})}
                    value={this.state.username}
                    placeholder="Enter Email"
                    placeholderTextColor="#8b9cb5"
                    returnKeyType="next"
                  />
                </View>
                <View style={styles.passwordStyle}>
                  <TextInput
                    underlineColorAndroid="transparent"
                    style={styles.inputStyle}
                    autoCapitalize={'none'}
                    onChangeText={(text) => this.setState({password: text})}
                    value={this.state.password}
                    placeholder="Enter Password"
                    placeholderTextColor="#8b9cb5"
                    keyboardType="default"
                    onSubmitEditing={Keyboard.dismiss}
                    returnKeyType="next"
                    secureTextEntry={this.state.hidden}
                  />
                  <TouchableOpacity
                    style={{
                      right: 30,
                      top: 10,
                      resizeMode: 'contain',
                    }}
                    onPress={() => this.setState({hidden: !this.state.hidden})}>
                    <Image
                      style={{
                        width: 20,
                        height: 20,
                      }}
                      source={
                        this.state.hidden
                          ? require('../hide.png')
                          : require('../view.png')
                      }
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.forgotpass}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('forgot')}>
                    <Text style={styles.forgotpasstext}>Forgot password ?</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={(globalStyle.appColor, styles.buttonStyle)}
                  activeOpacity={0.5}
                  onPress={() => this.onLoginPress()}>
                  <Text style={(globalStyle.appColor, styles.buttonTextStyle)}>
                    LOGIN
                  </Text>
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 30,
                  }}>
                  <Text
                    style={{
                      fontSize: 17,
                      color: '#8F9BB3',
                      textAlign: 'center',
                    }}>
                    I don't have an account!
                  </Text>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('signup')}>
                    <Text
                      style={{fontSize: 17, color: appColor, marginLeft: 5}}>
                      Signup
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
  componentDidMount() {}

  componentWillUnmount() {}

  onLoginPress = async () => {
    try {
      this.setState({isLoading: true});
      let json = await Api(`/login/`, 'POST', {
        email: this.state.username,
        password: this.state.password,
      });
      // let response =await fetch("https://testing.itexpertsacademy.com/api/login",{
      //           method: 'POST',
      //           headers: {
      //             Accept: 'application/json',
      //             'Content-Type': 'application/json',
      //             'X-API-KEY': '64c3140d6e914e143b856bcbc9976f3218'
      //           },
      //           body: JSON.stringify({
      //             email: this.state.username,
      //             password: this.state.password
      //           })
      //       });
      // let json = await response.json();
      this.setState({data: json});
      console.log(json);
      return json;
    } catch (error) {
      console.error(error);
    } finally {
      this.setState({isLoading: false});
      if (this.state.data.validity === 1) {
        AsyncStorage.setItem('userToken', this.state.data.token);
        AsyncStorage.setItem('UserId', this.state.data.user_id);
        AsyncStorage.setItem('UserEmail', this.state.data.email);
        Toast.show(`Login successfully..!`, Toast.LONG);
        store.dispatch(getNotification());
        this.props.navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Discover',
            },
          ],
        });
      } else {
        // this.props.navigation.navigate('App');
        // console.log(navigation)
        alert('please check your email and password');
      }
    }
  };
  showPassword() {
    this.setState({securepass: !this.state.securepass});
    if (this.state.securepass == false) {
      this.setState({passIcon: 'eye'});
    } else {
      this.setState({passIcon: 'eye-off'});
    }
  }

  // GooglesignIn = async () => {
  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     const userInfo = await GoogleSignin.signIn();
  //     this.setState({ userInfo });
  //     console.log(userInfo);
  //   } catch (error) {
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //       console.log('cancelled')
  //       // user cancelled the login flow
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
  //       // operation (e.g. sign in) is in progress already
  //       console.log('processed')
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //       // play services not available or outdated
  //       console.log('play service not available')
  //     } else {
  //       // some other error happened
  //       console.log(error.toString())
  //     }
  //   }
  // };
  //   async onFbLoginPress() {
  //     const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(appId, {
  //       permissions: ['public_profile', 'email'],
  //     });
  //     if (type === 'success') {
  //       const response = await fetch(
  //         `https://graph.facebook.com/me?access_token=${token}`);
  //       Alert.alert(
  //         'Logged in!',
  //         `Hi ${(await response.json()).name}!`,
  //       );
  //     }
  //   }
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
    marginTop: 30,
  },
  header: {
    flexDirection: 'column',
    height: 40,
    marginTop: 2,
    margin: 10,
  },
  headerText: {
    fontSize: 24,
    margin: 1,
    textAlign: 'center',
    justifyContent: 'center',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 30,
    marginLeft: 35,
    marginRight: 35,
    margin: 5,
  },
  passwordStyle: {
    flexDirection: 'row',
    height: 40,
    width: '89%',
    marginTop: 30,
    marginLeft: 35,
    marginRight: 35,
    margin: 5,
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
    color: '#FFFFFF',
    borderColor: '#7DE24E',
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
