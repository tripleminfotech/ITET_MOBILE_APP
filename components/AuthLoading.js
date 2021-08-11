import React from 'react';
import { Image } from 'react-native';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

class AuthLoadingScreen extends React.Component {
  componentDidMount() {
    setTimeout(()=>{
      this._bootstrapAsync();
    },3500)
    // this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
        <Image source={require('../logo-dark.png')} style={{alignItems:"center"}} />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

export default AuthLoadingScreen;