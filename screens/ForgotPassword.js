import React, { Component, useState } from "react";
import { Text,TextInput,View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native-paper";
import { set } from "react-native-reanimated";
import Api from "../components/Api";
import { appColor } from "../components/Style";



export default function ForgotPassword({navigation}){
    const [value,setValue] = useState();
    const [send,setSend] = useState(false);
    const [loading,setLoading] = useState(false)
 
    const onPress = async() =>{
        setLoading(true)
        let json = await Api('/forgot/password','POST',{email:value})
        if(!json.error){
            setSend(true)
            setLoading(false)
        }
        else{
            setSend(false)
            setLoading(false)
            alert(json.message)
        }

    }
    return (
        <>
        {loading?
        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <ActivityIndicator/>
        </View>
        :send?
        <View style={{justifyContent:"center",flexDirection:"column",flex:1,backgroundColor:"white"}}>
            <Text style={{textAlign:"center",fontSize:20}}>Your Password Reset Link Sended Successfully.Please Check Your Email.</Text>
            <TouchableOpacity onPress={()=>navigation.goBack()}>
                <Text style={{color:appColor,textAlign:"center",marginTop:10}}>Click Here To Login Page</Text>
            </TouchableOpacity>
        </View>
        
        : 
        <View style={{justifyContent:"center",flexDirection:"column",flex:1,backgroundColor:"white"}}>
            <Text style={{textAlign:"center",fontSize:30}}>Forgot Password</Text>
            <Text style={{textAlign:"center",color:"#8F9BB3",margin:10}}>Please enter your registered email then we will help you create a new password</Text>
            <TextInput 
                style={{
                    height: 50,
                    fontSize: 14,
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: 'white',
                    backgroundColor: '#F4F4F4',
                    paddingLeft: 10,
                    marginLeft: 15,
                    marginRight: 15,
                    marginTop: 20,
                    marginBottom: 5,
                }}
                placeholder="Enter Your Email" 
                placeholderColor="#c4c3cb" 
                autoCapitalize={"none"} 
                onChangeText={(text)=>setValue(text)}
                value={value} 
            />
            <TouchableOpacity onPress={() => onPress()} style={{margin:15,padding:15,backgroundColor:appColor,borderRadius:10}}>
                <Text style={{textAlign:"center",color:"white"}}>Submit</Text>
            </TouchableOpacity>
        </View>
        }
        </>
    )
}