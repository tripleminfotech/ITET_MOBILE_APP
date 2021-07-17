import React from 'react';
import {
  Text,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';


export default function Category({navigation,item}){
    
    return(
        
        <TouchableOpacity onPress={() => navigation.navigate('Detail',{'id':item.id})} style={{ height: 100, width: 100, marginLeft: 20,borderRadius:25 }}>
            <ImageBackground source={{uri:item.thumbnail}} style={{ flex: 1, width: null,borderRadius:20, height: null, resizeMode: 'cover',flexDirection:"column-reverse"}}>
                <Text style={{color:"white",marginLeft:10}}>{item.name}</Text>
            </ImageBackground>
        </TouchableOpacity>
            
    )
}

