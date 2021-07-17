import React, { Component, useEffect, useState } from "react";
import { AsyncStorage, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import PhoneInput from 'react-native-phone-input'
import { set } from "react-native-reanimated";
import Api from "../components/Api";
import Toast from 'react-native-simple-toast';
import { appColor, appName } from "../components/Style";
import { ActivityIndicator } from "react-native-paper";

export default function Signup({navigation}){
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [password2,setPassword2] = useState('');
    const [phone,setPhone] = useState('');
    const [code,setCode] = useState('');
    const [disable,setDisable] = useState(true);
    const [isLoading,setLoading] = useState(false);
    const [check,setCheck] = useState(true)
    var data;
    useEffect(() =>{
        if(name != '' && email != '' && password != '' && password2 != ''){
            setDisable(false);
            if(password === password2){
                setDisable(false);
            }
            else{
                setDisable(true)
            }
        }
        else{
            setDisable(true)
        }
    },[name,email,password2,password])
    // useEffect(() =>{
    //         if(password === password2){
    //             setCheck(false);
    //         }
    //         else{
    //             setCheck(true);
    //         }
        
    // },[password2])
    const login = async () =>{
        let json = await Api(`/login`,"POST",{
            email: email,
            password: password
          });
        AsyncStorage.setItem('userToken',json.token);
        AsyncStorage.setItem('UserId',json.user_id);
        AsyncStorage.setItem('UserEmail',json.email);
        navigation.reset({
            index: 0,
            routes: [
                {
                name: 'Discover'
                },
            ],
            });
            Toast.show(`Register successfully..!`, Toast.LONG);
    }
    const onSignupPress = async () => {
        if(password.length < 8){
            alert('Password length must be greater than 8 characters')
        }
        else{
            try {
                setLoading(true);
                let json = await Api(`/register/user`,"POST",{
                 name: name,
               email: email,
               password: password
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
               data = json
               console.log(json)
               return json;
             } catch (error) {
               console.error(error);
             }
             finally {
                 setLoading(false)
                 if(data.error === null){
                     login();
     
                 }
                 else{
                     alert(data.message);
                 }
               }
        }
        
      };
    
    return (
        <View style={{ flex: 1, justifyContent:"center",backgroundColor:"white" }}>
        {isLoading ? <ActivityIndicator/> : (
        <>
        <View style={{backgroundColor:"white",flex:1,justifyContent:"center",flexDirection:"column",alignItems:"center"}}>
            <Image source={require('../logo-dark.png')} style={{alignItems:"center",width:102,height:31}} />
            <Text style={{fontSize:32,margin:10,textAlign:"center"}}>Welcome to {appName}</Text>
            <Text style={{textAlign:"center",color:"#8F9BB3"}}>Please create your account and using app.</Text>
        </View>
        
        <View style={{flex:2,backgroundColor:"white"}}>
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
                placeholder="Username" 
                placeholderColor="#c4c3cb" 
                autoCapitalize={"none"} 
                onChangeText={(text)=>setName(text)}
                value={name} 
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
                placeholder="Email" 
                keyboardType="email-address"
                placeholderColor="#c4c3cb" 
                autoCapitalize={"none"} 
                onChangeText={(text)=>setEmail(text)}
                value={email} 
            />
            {/* <View style={{
                height: 50,
                fontSize: 14,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: 'white',
                backgroundColor: '#F4F4F4',
                marginLeft: 20,
                marginRight: 20,
                padding: 12,
                // paddingTop: 60,
                // marginTop: 20,
                alignItems:"center",
                marginBottom:5
            }}>
                <PhoneInput
                textProps={{placeholder:"phone"}}
                onSelectCountry = {(iso2)=>setCode(iso2)}
                onChangePhoneNumber = {(number) => setPhone(number)}
                initialCountry = 'in'
                value = {phone}
                ref={ref => {
                    data = ref;}}
                />
            </View> */}
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
                onChangeText={(text)=>setPassword(text)}
                value={password} 
                secureTextEntry={true}
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
                placeholder="Confirm Password" 
                placeholderColor="#c4c3cb" 
                autoCapitalize={"none"} 
                onChangeText={(text)=>setPassword2(text)}
                value={password2} 
                secureTextEntry={true}
            />
            
            <TouchableOpacity disabled={disable} onPress={() => onSignupPress()}  style={{...styles.signup,backgroundColor:!disable?appColor:"gray"}}>
                <Text style={styles.signup_text}>Signup</Text>
            </TouchableOpacity>
        </View>
        <View style={{flexDirection:"row",justifyContent:"center",marginBottom:10}}>
          <Text style={{fontSize:17,color:"#8F9BB3",textAlign:"center"}}>I already have an account!</Text>
          <TouchableOpacity onPress={()=>navigation.navigate('login')}>
             <Text style={{fontSize:17,color:appColor,marginLeft:5}}>Signin</Text>
            </TouchableOpacity>
          </View>
        </>
        )}
        </View>
    )
}

const styles = StyleSheet.create({
    signup:{
        margin:15,
        padding:15,
        backgroundColor:appColor,
        borderRadius:10
    },
    signup_text:{
        textAlign:"center",
        color:"white"
    }
})