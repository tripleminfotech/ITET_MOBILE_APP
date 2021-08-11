import ReadMore from "@fawazahmed/react-native-read-more";
import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  Image, ImageBackground,TouchableOpacity, CheckBox, SectionList
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { ProgressBar,Colors, ActivityIndicator } from "react-native-paper";
import LinearGradient from 'react-native-linear-gradient';
import Api from "../components/Api";
import { loaderData, MyLoader, MyLoader1 } from "../components/MyLoaders";
import { FlatList } from "react-native";

const image = { uri: "https://reactjs.org/logo-og.png" };
export default function StartCourse({route,navigation}){
    const [course,setCourse] = useState([]);
    const [loading,setLoading] = useState(true);
    const [sections,setSection] = useState([]);
    const [total,setTotal] = useState(0);
    const [complete,setComplete] = useState(0);
    const [completion,setCompletion] = useState(0);
    useEffect(  () => {
        async function fetchData(){
            // setLoading(true)
          let json = await Api(`/course/${route.params.id}`,"GET");
          console.log(json[0])
          setCourse(json[0])
          
          const section = json[0].sections.map(blog => ({
            title: blog.title,
            data: blog.lessons
          }
          ));
          var val = 0;
          var all = 0;
          const len = json[0].sections.map(item =>{
              
              
              all = all + item.lessons.length
              item.lessons.map(blog =>{
                  if(blog.is_completed === 1){
                      val = val+1;
                  }
              })
              
          })
          setTotal(all);
          setComplete(val);
          setSection(section)
          setLoading(false);
          let v = 100/all;
          const prog = (v * val)/100 ;
          console.log(prog);
          setCompletion(prog);
        }
        navigation.addListener('focus', () => {
            fetchData();
          });
        fetchData(); 


      }, []);
    
    const SectionHead = ({title}) => {
    return  <Text style={{marginLeft:10}}>Section {title}</Text>
    }
    const SectionItem = ({item,index}) => {
        return (
            <TouchableOpacity onPress={() => navigation.navigate('Lesson',{id:item.id})} style={{margin:10,padding:8,borderRadius:8,backgroundColor:"#222B45"}}>
            
               <Text style={{color:"#C5CEE0"}}>Lesson {index + 1}</Text>
               <View style={{flexDirection:"row",marginTop:10,alignItems:"center"}}>
               <CheckBox
                    value={item.is_completed === 0? false : true}
                    />
                <Text style={{fontSize:17,color:"white"}}>{item.title}</Text>
               </View>
               <Text style={{marginTop:5,marginLeft:30,color:"#C5CEE0"}}>{item.duration}</Text>
               
            </TouchableOpacity>
        )
    }
    
    return(
        <>
        {loading?
        <View style={{marginTop:10}}>
            <MyLoader1 />
            <FlatList
            data={loaderData}
            keyExtractor = {item => item.toString()}
            renderItem = {({item})=><MyLoader />}
            />
        </View>
            :
        <ScrollView style={{backgroundColor:"white"}}>
                <Image source={{uri:course.thumbnail}} style={{
                                            height: 250,
                                            resizeMode:"cover",
                                            position: 'relative', // because it's parent
                                        }}/>
                
           <Text style={{
                                fontSize:26,
                                margin:10,
                                color: 'black'
                        }}>{course.title}</Text>
            <View style={{
                                // position: 'absolute', // child
                                // top: "75%", // position where you want
                                paddingHorizontal:20,
                                paddingBottom:20,
                                width:"100%",
                                // left: "50%",
                                // transform:[{translateX:-100}]
                                }}>
                        
                        <View style={{marginTop:10,backgroundColor:"rgba(52,52,52,0.8)",paddingHorizontal:20,paddingTop:10,paddingBottom:10,borderRadius:8}}>
                            <ProgressBar progress={completion} color={Colors.white} style={{marginBottom:10,height:8,borderRadius:8}}/>
                            <Text style={{color:"#fff"}}>{complete} of {total}</Text>
                        </View>
                    </View>
        <View>
            {/* qanda view */}
           {/* <View style={{backgroundColor:"#F4F4F4",margin:10,padding:10,flexDirection:"row",justifyContent:'space-between',borderRadius:8}}>
               <Text style={{marginTop:10,marginLeft:5}}>You have any questions?</Text>
               <TouchableOpacity onPress={() => navigation.navigate('qanda',{"id":route.params.id})}>
               <Image source={require('../message.png')} style={{width:41,height:41}}/>
               </TouchableOpacity>
           </View> */}
        <View>
        <SectionList
            sections={sections}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item,index }) => <SectionItem item={item} index={index}/>}
            renderSectionHeader={({ section: { title } }) => (
               <SectionHead title={title} />
            )}
            />
            {/* <Text style={{marginLeft:10}}>Section Test</Text>
            <TouchableOpacity onPress={() => navigation.navigate('test')} style={{backgroundColor:"#222B45",margin:10,padding:8,borderRadius:8}}>
               <Text>Test</Text>
               <View style={{flexDirection:"row",marginTop:10,alignItems:"center"}}>
               <CheckBox
                    value={true}
                    />
                <Text style={{fontSize:17,color:"white"}}>Final Test</Text>
               </View>
               <Text style={{marginTop:5,marginLeft:30,color:"#C5CEE0"}}>20 min</Text>
            </TouchableOpacity> */}
        
        </View>
        {/* <View style={{padding:10}}>
            <Text style={{fontSize:17,marginBottom:5}}>Informations</Text>
            <ReadMore>{`Recurring Billing. Cancel anytime. Payment will be charged to your iTunes account at confirmation of pur chase. Your subscription automatically renews unless auto-renew account at confirmation account at`}</ReadMore>
        </View> */}
        <View style={{padding:10,flexDirection:"row",justifyContent:"space-between"}}>
            <Text style={{fontSize:15,marginBottom:5,color:"#8F9BB3"}}>Category</Text>
            <Text style={{fontSize:15,marginBottom:5}}>{course.language}</Text>
        </View>
        <View style={{padding:10,flexDirection:"row",justifyContent:"space-between"}}>
            <Text style={{fontSize:15,marginBottom:5,color:"#8F9BB3"}}>Required Level</Text>
            <Text style={{fontSize:15,marginBottom:5}}>{course.level}</Text>
        </View>
        {/* <View style={{padding:10}}>
        <Text style={{fontSize:17,marginBottom:5}}>Instructor</Text>
        <View style={{flexDirection:"row",backgroundColor:"#D1D1D1",borderRadius:8,padding:20}}>
           <Image source={require('../python.png')} style={{width:46,height:46,borderRadius:50}} /> 
           <Text style={{marginLeft:10}}>Belle Schultz</Text>
        </View>
        </View> */}
       </View>
       </ScrollView>
    }
    </>
    )
}
