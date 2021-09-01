import React, { useEffect, useState } from 'react';
import { Text, View } from "react-native";
import Api from '../components/Api';
import VideoPlayer from './VideoPlayer';
import Test from './Test';
import Youtube from './Youtube';
import { ActivityIndicator } from 'react-native-paper';

export default function Lessons({route,navigation}){
    const [data,setData] = useState([])
    const [id,setId] = useState();
    const [loading,setLoading] = useState(false);
    useEffect(() => {
        async function fetchData(){
          console.log(route.params.id);
          let json = await Api(`/lesson/${route.params.id}`,"GET");
          
          await setData(json[0]);
          setId(json[0].id);
        }
        fetchData();  
      }, []);
    // const fetchData = async() => {
    //     let json = await Api(`/lesson/${route.params.id}`,"GET");
    //     setData(json);
    //     console.log(json)
    //     // setLoading(false);
    //   }
    const QandA = () =>{
        navigation.navigate('qanda');
    }
    const onPress = () =>{
        navigation.navigate('Lesson',{id:data.next_lesson});
    }
    const nextPrev = (lesson) =>{
      setLoading(true)
      async function fetchData(){
        let json = await Api(`/lesson/${lesson}`,"GET");
        
        await setData(json[0]);
        setId(json[0].id)
        setLoading(false)
      }
      fetchData();
    } 
    const markAscompleted = async() =>{
        setLoading(true)
        await Api(`/mark_lesson_completed/`,"POST",{lessonId: id,progress: 1});
        async function fetchData(){
            let json = await Api(`/lesson/${data.next_lesson}`,"GET");
            
            await setData(json[0]);
            setId(json[0].id)
          }
          if(data.next_lesson !== null){
            fetchData();
            setLoading(false)
          }
          else{
            alert("All lessons are completed...!");
            navigation.navigate('MyCourses');
            setLoading(false)
          }
    }
    return (
        <>
        {/* {data.video_type === "YouTube" ? <Youtube navigatio={navigation} data={data} completed={markAscompleted} next={nextPrev} /> :
        
        null}
        {data.video_type === "Vimeo" ? <VideoPlayer navigatio={navigation} data={data} completed={markAscompleted} next={nextPrev} /> : null} */}
        {loading?<View style={{ flex: 1, justifyContent:"center",backgroundColor:"white" }}>
        <ActivityIndicator/>
        </View>:data.lesson_type === "quiz"?<Test data={data} navigatio={navigation} next={nextPrev} completed={markAscompleted} />
         :
         data.lesson_type === "video"?
        <VideoPlayer navigatio={navigation} data={data} completed={markAscompleted} next={nextPrev} rout={route} />
        :
        <View style={{ flex: 1, justifyContent:"center",backgroundColor:"white" }}>
        <ActivityIndicator/>
        </View>
        }
        </>
    )
}