import React, { useEffect, useState } from 'react';
import { AsyncStorage, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Api from '../components/Api';

export default function UserCertificates({navigation}){
    const [data,setData] = useState([]);
    const [loading,setLoading] = useState(false)
    useEffect(() => {
        _bootstrapAsync();
        }, []);
   
   const _bootstrapAsync = async () => {
        const userToken = await AsyncStorage.getItem('userToken');
        if(userToken){
            fetchData();
        }
        
      };
      const fetchData = async() => {
          setLoading(true)
        let json = await Api(`/my_courses`,"GET");
        let arr = []
        await json.map(item =>{
            if(item.completion === 100 && item.is_certificate === "yes"){
                arr.push(item) 
            }
        })
        console.log(arr)
        setData(arr)
        setLoading(false);
      }

    return(
        <>
        {loading?
        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <ActivityIndicator />
        </View>:
        <FlatList
         data ={data}
         renderItem = {({item}) =>(<TouchableOpacity onPress={()=>navigation.navigate('StartCourse',{screen:"certificate",params:{id:item.id,instructor_name:item.instructor_name,language:item.language,level:item.level,title:item.title}})} style={{margin:10,backgroundColor:"white",flexDirection:"row",borderRadius:10,padding:15,alignItems:"center",justifyContent:"space-between"}}>
         <View style={{flexDirection:"row",alignItems:"center"}}>
             <Image source={{uri:item.thumbnail}} style={{width:61,height:61}} />
             <View style={{marginLeft:10}}>
                 <Text>{item.title}</Text>
                 <Text style={{color:"#8F9BB3",fontSize:13}}>{item.instructor_name}</Text>
             </View>
         </View>
         <Icon name="chevron-right" color="#18203A" size={30} style={{justifyContent:"flex-end"}} />
     </TouchableOpacity>) }
        />
    }

        </>
    )
}