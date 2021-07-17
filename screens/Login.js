import React, { Component } from "react";


import {Keyboard, Text, View, TextInput, TouchableWithoutFeedback, Alert, KeyboardAvoidingView, StyleSheet, AsyncStorage, TouchableOpacity, Image} from 'react-native';
import { Button } from 'react-native-elements';
import { ActivityIndicator } from "react-native-paper";
// import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import Api from "../components/Api";
import Toast from 'react-native-simple-toast';
import globalStyle, { appColor, appName } from "../components/Style";
import store from "../store";
import { getNotification } from "../reducers/cartItems";


const appId = "1047121222092614"
// GoogleSignin.configure({
//     scopes: ["https://www.googleapis.com/auth/userinfo.profile"],
//      webClientId: '143676774594-epsotpfcgg168iiceki0u19go1i7tsio.apps.googleusercontent.com',
//     //  offlineAccess: true
//    });
export default class LoginScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
          data: '',
          isLoading: false,
          username:'',
          password:'',
          nav:'',
          userInfo:{}
        };
      }

  render() {
    const { data, isLoading } = this.state;
    return (
        
        <View style={{ flex: 1, justifyContent:"center",backgroundColor:"white" }}>
        {isLoading ? <ActivityIndicator/> : (
          <>
        <View style={{backgroundColor:"white",flex:1,justifyContent:"center",flexDirection:"column",alignItems:"center"}}>
            <Image source={require('../logo-dark.png')} style={{alignItems:"center",width:102,height:31}} />
            <Text style={{fontSize:32,margin:10,textAlign:"center"}}>Welcome to {appName}</Text>
            <Text style={{textAlign:"center",color:"#8F9BB3"}}>Please login your account and using app.</Text>
        </View>
        <View style={{flex:2}}>
        <TextInput 
                style={{
                    height: 50,
                    fontSize: 14,
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: 'white',
                    backgroundColor: '#F4F4F4',
                    paddingLeft: 10,
                    marginLeft: 20,
                    marginRight: 20,
                    // marginTop: 20,
                    marginBottom: 5,
                }}
                placeholder="Email" 
                keyboardType="email-address"
                placeholderColor="#c4c3cb" 
                autoCapitalize={"none"} 
                onChangeText={text => this.setState({username:text})} 
                value={this.state.username}
            />
            <TextInput 
                style={{
                    height: 50,
                    fontSize: 14,
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: 'white',
                    backgroundColor: '#F4F4F4',
                    paddingLeft: 10,
                    marginLeft: 20,
                    marginRight: 20,
                    // marginTop: 20,
                    marginBottom: 5,
                }}
                placeholder="Password" 
                placeholderColor="#c4c3cb" 
                autoCapitalize={"none"} 
                onChangeText={text => this.setState({password:text})} 
                value={this.state.password} 
                secureTextEntry={true}
            />
            <TouchableOpacity onPress={()=>this.props.navigation.navigate('forgot')}>
              <Text style={{color:"#8F9BB3",textAlign:"right",margin:10}}>Forogot password?</Text>
            </TouchableOpacity>
            <Button
              buttonStyle={[globalStyle.appColor,styles.loginButton]}
              
              onPress={() => this.onLoginPress()}
              title="Login"
            />
          
          </View>
          <View style={{flexDirection:"row",justifyContent:"center",marginBottom:10}}>
          <Text style={{fontSize:17,color:"#8F9BB3",textAlign:"center"}}>I don't have an account!</Text>
          <TouchableOpacity onPress={()=>this.props.navigation.navigate('signup')}>
             <Text style={{fontSize:17,color:appColor,marginLeft:5}}>Signup</Text>
            </TouchableOpacity>
          </View>
        {/* <View style={styles.loginScreenContainer}>
          <View style={styles.loginFormView}>
          <Text style={styles.logoText}>ITET</Text>
            <TextInput placeholder="Username" placeholderColor="#c4c3cb" autoCapitalize={"none"} style={styles.loginFormTextInput} onChangeText={text => this.setState({username:text})} value={this.state.username}/>
            <TextInput placeholder="Password" placeholderColor="#c4c3cb" style={styles.loginFormTextInput} onChangeText={text => this.setState({password:text})} value={this.state.password} secureTextEntry={true}/>
            <TouchableOpacity onPress={()=>this.props.navigation.navigate('forgot')}>
              <Text style={{color:"#8F9BB3",textAlign:"right",margin:10}}>Forogot password?</Text>
            </TouchableOpacity>
            <Button
              buttonStyle={styles.loginButton}
              
              onPress={() => this.onLoginPress()}
              title="Login"
            />
            <Button
              buttonStyle={styles.loginButton}
              onPress={() => this.GooglesignIn()}
              // color="red"
              title="google"
            />
            
          </View>
          <View style={{flexDirection:"row",justifyContent:"center",marginBottom:10}}>
          <Text style={{fontSize:17,color:"#8F9BB3",textAlign:"center"}}>I don't have an account!</Text>
          <TouchableOpacity onPress={()=>this.props.navigation.navigate('signup')}>
             <Text style={{fontSize:17,color:"#0095FF",marginLeft:5}}>Signup</Text>
            </TouchableOpacity>
          </View>
          
        </View> */}
      </>
         ) }
         </View>
        
    );
  }

  componentDidMount() {
  
  }

  componentWillUnmount() {
  }


 onLoginPress = async () => {
    try {
        this.setState({ isLoading: true });
        let json = await Api(`/login/`,"POST",{
                      email: this.state.username,
                      password: this.state.password
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
      this.setState({data:json});
      console.log(json)
      return json;
    } catch (error) {
      console.error(error);
    }
    finally {
        this.setState({ isLoading: false });
        if(this.state.data.validity === 1){
            AsyncStorage.setItem('userToken',this.state.data.token);
            AsyncStorage.setItem('UserId',this.state.data.user_id);
            AsyncStorage.setItem('UserEmail',this.state.data.email);
            Toast.show(`Login successfully..!`, Toast.LONG);
            store.dispatch(getNotification());
            this.props.navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'Discover'
                },
              ],
            })
        }
        else{
            // this.props.navigation.navigate('App');
            // console.log(navigation)
            alert("please check your email and password");
        }
      }
  };


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

    containerView: {
      flex: 1,
    },
    loginScreenContainer: {
      flex: 1,
    },
    logoText: {
      fontSize: 40,
      fontWeight: "800",
      marginTop: 150,
      marginBottom: 30,
      textAlign: 'center',
    },
    loginFormView: {
      flex: 1
    },
    loginFormTextInput: {
      height: 43,
      fontSize: 14,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#eaeaea',
      backgroundColor: '#fafafa',
      paddingLeft: 10,
      marginLeft: 15,
      marginRight: 15,
      marginTop: 5,
      marginBottom: 5,
    
    },
    loginButton: {
      // backgroundColor: '#3897f1',
      borderRadius: 5,
      height: 45,
      marginTop: 10,
      marginRight:20,
      marginLeft:20
    },
    fbLoginButton: {
      height: 45,
      marginTop: 10,
      backgroundColor: 'transparent',
    },
    })