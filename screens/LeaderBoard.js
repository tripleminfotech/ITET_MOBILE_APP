import React, { useEffect, useState } from 'react';
import { AsyncStorage, Image, ProgressBarAndroid, ScrollView, Text, TouchableHighlight, View } from 'react-native';
import { Colors, ProgressBar } from 'react-native-paper';
import Api from '../components/Api';
import CircularProgress from '../components/CircularProgress';
import { appColor } from '../components/Style';
import defaultAvatar from '../Oval.png';

export default function LeaderBoard(){
    const [avatar, setAvatar] = useState(defaultAvatar);
    const [data,setData] = useState([]);
    useEffect(()=>{
        const fetchData = async() =>{
            const userId = await AsyncStorage.getItem('UserId')
            let json = await Api(`/leaderboard/${userId}`,'GET')
            setData(json.data.user[0])
        }
        fetchData();
    },[])
    return (
        <ScrollView >
        <View style={{backgroundColor:appColor,margin:20,justifyContent:"center",alignItems:"center",padding:20,borderRadius:20}}>
                <Image source={avatar} style={{borderRadius:50,height:105,width:105}} />
                <Text style={{marginTop:10,fontSize:22,color:"white"}}>{data.first_name} {data.last_name}</Text>
                <Text style={{marginTop:10,fontSize:17,color:"white"}}>Point Earned : {data.points}</Text> 
        </View>
        <View style={{flexDirection:"row",justifyContent:"space-between",margin:10}}>
            <View style={{flex:1,backgroundColor:"#F52D55",borderRadius:15,marginLeft:10,alignItems:"center",paddingVertical:30}}>
                <Text style={{color:"white"}}>Videos Watched</Text>
                <Text style={{fontSize:36,color:"white",marginTop:10}}>{data.video}</Text>
            </View>
            <View style={{flex:1,backgroundColor:"#FE8D00",borderRadius:15,marginLeft:10,marginRight:10,alignItems:"center",paddingVertical:30}}>
                <Text style={{color:"white"}}>Quiz Attended</Text>
                <Text style={{fontSize:36,color:"white",marginTop:10}}>{data.quiz}</Text>
            </View>
        </View>

        <View style={{flexDirection:"row",justifyContent:"space-between",margin:10}}>
            <View style={{flex:1,backgroundColor:"#5754D7",borderRadius:15,marginLeft:10,alignItems:"center",paddingVertical:30}}>
                <Text style={{color:"white"}}>Q & A</Text>
                <Text style={{fontSize:36,color:"white",marginTop:10}}>{data.qanda}</Text>
            </View>
            <View style={{flex:1,backgroundColor:"#6DD400",borderRadius:15,marginLeft:10,marginRight:10,alignItems:"center",paddingVertical:30}}>
                <Text style={{color:"white"}}>Assignments</Text>
                <Text style={{fontSize:36,color:"white",marginTop:10}}>{data.assignments}</Text>
            </View>
        </View>

        <View style={{flexDirection:"row",justifyContent:"space-between",margin:10}}>
            <View style={{flex:1,backgroundColor:"#B620E0",borderRadius:15,marginLeft:10,alignItems:"center",paddingVertical:30}}>
                <Text style={{color:"white"}}>Courses</Text>
                <Text style={{fontSize:36,color:"white",marginTop:10}}>{data.courses}</Text>
            </View>
            <View style={{flex:1,backgroundColor:"#F7B500",borderRadius:15,marginLeft:10,marginRight:10,alignItems:"center",paddingVertical:30}}>
                <Text style={{color:"white"}}>Login</Text>
                <Text style={{fontSize:36,color:"white",marginTop:10}}>{data.login}</Text>
            </View>
        </View>
        {/* <View style={{marginTop:10,marginLeft:20}}>
            <Text style={{fontSize:17}}>Courses</Text>
        </View>
    <View style={{marginBottom:10}}>
        <View style={{padding:10,backgroundColor:"white",flexDirection:"row",marginLeft:20,marginRight:20,marginTop:10,borderRadius:10,justifyContent:"space-between",alignItems:"center"}}>
            <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                <Image source={require('../Rectangle.png')} width={66} height={66} />
                <View style={{marginLeft:10}}>
                    <Text style={{fontSize:17}}>
                        Web Design
                    </Text>
                    <Text style={{marginTop:10}}>
                        10 of 50 completed
                    </Text> 
                </View>
            </View>
            <View>
                <CircularProgress size={50} strokeWidth={5} pgColor={appColor} bgColor="#EEEEEE" textSize="13" textColor={appColor} text={"50%"} progressPercent={50} />
            </View>
        </View>

        <View style={{padding:10,backgroundColor:"white",flexDirection:"row",marginLeft:20,marginRight:20,marginTop:10,borderRadius:10,justifyContent:"space-between",alignItems:"center"}}>
            <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                <Image source={require('../Rectangle.png')} width={66} height={66} />
                <View style={{marginLeft:10}}>
                    <Text style={{fontSize:17}}>
                        Web Design
                    </Text>
                    <Text style={{marginTop:10}}>
                        10 of 50 completed
                    </Text> 
                </View>
            </View>
            <View>
                <CircularProgress size={50} strokeWidth={5} pgColor={appColor} bgColor="#EEEEEE" textSize="13" textColor={appColor} text={"50%"} progressPercent={50} />
            </View>
        </View>
        </View> */}
        </ScrollView>
    )
}