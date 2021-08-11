import React,{ Component } from 'react';
import {
  View,
  FlatList,
  Text,
  StatusBar,
  Image,
  TouchableOpacity
} from 'react-native';

import Navigation from '../components/Navigation';

export default function Messages({navigation}){
    return (
        <>
        <View style={{backgroundColor:"white",alignItems:"center",paddingTop:50,paddingBottom:30}}>
            <StatusBar  backgroundColor="black" />
            <Text style={{fontSize:18}}>Messages</Text>
        </View>
        <TouchableOpacity onPress={()=>navigation.navigate('message',{title:"sk"})} style={{flexDirection:"row",margin:10,marginTop:20,justifyContent:"space-between",backgroundColor:"white",padding:15,borderRadius:15}}>
            <View style={{flexDirection:"row",alignItems:"center"}}>
                <View>
                <Image source={require('../Oval.png')} />
                </View>
                <View style={{marginLeft:10}}>
                <Text>Belle Schultz</Text>
                <Text style={{color:"#8F9BB3",fontSize:13}}>Yah, I have 3 lessons for you.</Text>
                </View>
                
            </View>
           
            <View>
                <Text>11 min</Text>
            </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate('message',{title:"sr"})} style={{flexDirection:"row",margin:10,justifyContent:"space-between",backgroundColor:"white",padding:15,borderRadius:15}}>
            <View style={{flexDirection:"row",alignItems:"center"}}>
                <View>
                <Image source={require('../Oval.png')} />
                </View>
                <View style={{marginLeft:10}}>
                <Text>Belle Schultz</Text>
                <Text style={{color:"#8F9BB3",fontSize:13}}>Yah, I have 3 lessons for you.</Text>
                </View>
                
            </View>
           
            <View>
                <Text>11 min</Text>
            </View>
        </TouchableOpacity>
        </>
    )
}