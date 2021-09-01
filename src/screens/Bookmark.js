import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { SectionList } from 'react-native';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Api from '../components/Api';
import { appColor } from '../components/Style';

export default function Bookmark({navigation,route}){
    const [data,setData] = useState([])
    const [nodata,setNodata] = useState(false)
    useEffect(()=>{
        console.log(route.params.id)
        fetchData()
    },[])
    const fetchData = async() =>{
        let json = await Api(`/bookmarks_by_course/${route.params.id}`,'GET')
        console.log(json)
        const section = json.data.map(blog => ({
            title: blog.title,
            data: JSON.parse(blog.notes),
            id:blog.lesson_id
          }
          ));
        setData(section)
        setNodata(json.data.length === 0 ? true:false)
    }
    function getMinutesFromSeconds(time) {
        const minutes = time >= 60 ? Math.floor(time / 60) : 0;
        const seconds = Math.floor(time - minutes * 60);
      
        return `${minutes >= 10 ? minutes : '0' + minutes}:${
          seconds >= 10 ? seconds : '0' + seconds
        }`;
      }
    const SectionHead = ({title}) => {
        return  <View style={{marginTop:10,marginLeft:10,marginRight:10,padding:15,backgroundColor:"white",borderTopRightRadius:10,borderTopLeftRadius:10}}>
                    <Text>{title}</Text>
                </View>
        }
        const SectionItem = ({item,index,id}) => {
            console.log(id)
            return (
                <TouchableOpacity onPress={() => navigation.navigate('StartCourse',{screen:"Lesson",params:{id:id,duration:item.duration}})} style={{backgroundColor:"white",marginLeft:10,marginRight:10}}>
                    <View style={{margin:10,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                        <Text style={{color:"#8F9BB3",textAlign:"center"}}>{item.note}</Text>
                        <Text style={{color:"green",textAlign:"center"}}>{getMinutesFromSeconds(item.duration)}</Text>
                    </View>
                </TouchableOpacity>
            )
        }
    return (
        <>
        
        <ScrollView>
        <View style={{padding:10,margin:10}} >
        <Text style={{fontSize:22}}>{route.params.title}</Text>
        </View>
        {nodata?
        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <Text style={{fontSize:16,marginBottom:10}}>No Bookmarks are There</Text>
            <TouchableOpacity onPress={()=>navigation.navigate('StartCourse',{screen:"StartCourse",params:{id:route.params.id}})}>
                <Text style={{color:appColor}}>Click Here To Goto Course</Text>
            </TouchableOpacity>
        </View>
        :
        <SectionList
            sections={data}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item,index,section:{id} }) => <SectionItem item={item} index={index} id={id}/>}
            renderSectionHeader={({ section: { title } }) => (
               <SectionHead title={title} />
            )}
            />
        }
      </ScrollView>
      
      </>
    )
}

