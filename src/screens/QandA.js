import React, { useEffect, useState } from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import AudioPlayer from '../components/AudioPlayer';
import DocumentView from '../components/DocumentViewer';
import Api from '../components/Api';
import Modal from 'react-native-modal';
import { StyleSheet } from 'react-native';
import { Button } from 'native-base';

export default function QandA({route,navigation}){
  const [data,setData] = useState({})
  const [open,setOpen] = useState(false)
  const [question,setQuestion] = useState('')
  useEffect(()=>{
    console.log(route.params.id)
    fetchData()
  },[])
  const fetchData = async() =>{
    let json = await Api(`/qanda/${route.params.id}/`,'GET')
    await setData(json)
  }
  const renderQuestions = (item) => {
    return(
    <View style={{marginLeft:10,marginTop:10,marginRight:10,backgroundColor:"white",padding:10,borderRadius:10}}>
          <Text style={{fontSize:17}}>{item.question}</Text>
          {item.audio_attachment !== null ? <AudioPlayer url={item.audio_attachment} /> : null }
          {item.attachment_url !== null ?  <DocumentView url={item.attachment_url} /> : null}
          <Text style={{marginTop:5,color:'#821A1A'}}>{item.answer.length > 0? item.answer.length : "no" }responses</Text>
          <FlatList
            data = {item.answer}
            keyExtractor = {value => value.id}
            renderItem = {(value) => renderAnswers(value)}/>
    </View>
    )
    
  };

  const renderAnswers = (value) => {
    console.log("index",value)
    const index = value.index
    const item = value.item
    return (
      <View style={{margin:10,backgroundColor:"#E9E9E9",padding:10,borderRadius:10}}>
        <Text style={{fontSize:17}}>answer {index+1}</Text>
        <Text style={{marginTop:5}}>{item.answer}</Text>
        {item.audio_attachment !== null ? <AudioPlayer url={item.audio_attachment} /> : null }
        {item.attachment_url !== null ?  <DocumentView url={item.attachment_url} /> : null}
        {item.status === null ? 
        
        <View style={{flexDirection:"row",justifyContent:"space-between",margin:10}}>
        <TouchableOpacity style={{padding:10,backgroundColor:"#79fd79",borderRadius:10}}>
          <Text style={{color:"white"}}>Understood</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{padding:10,backgroundColor:"#ff6060",borderRadius:10}}>
          <Text style={{color:"white"}}>Need Clarification</Text>
        </TouchableOpacity>
    </View>
      :
        <Text style={{marginTop:10,color:"red"}}>{item.status}</Text>
      }
        
        
      </View>
    )

  }

  return (
    <>
    <TouchableOpacity onPress={()=>setOpen(true)} style={{backgroundColor:"white",padding:10}}>
      <Text style={{fontSize:18,textAlign:"center",color:"blue"}}>Ask a New Question</Text>
    </TouchableOpacity>
    <Modal
        testID={'modal'}
        isVisible={open}
        onSwipeComplete={()=>setOpen(false)}
        onBackButtonPress={()=>setOpen(false)}
        swipeDirection={['up', 'left', 'right', 'down']}
        style={styles.view}>
        <View style={styles.content}>
        <Text style={styles.contentTitle}>Hi 👋!</Text>
        <Button testID={'close-button'} onPress={()=>setOpen(false)} title="Close" />
      </View>
      </Modal>
    <FlatList
      data = {data.data}
      
      renderItem = {({item}) => renderQuestions(item)}
      keyExtractor = {item => item.id}
      />
    </>
  )
}

const styles = StyleSheet.create({
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
});