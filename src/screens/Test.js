import {  CheckBox } from "native-base";
import React from "react";
import {
  View,
  Text,
 TouchableOpacity,
 FlatList,
 Button
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Api from "../components/Api";
import { appColor } from "../components/Style";
import Modal from 'react-native-modal';
import { StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native";
export default class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data:[],
      score: 0,
      attempt:0,
      mark:0,
      current_mark:0,
      open:false,
      loading:false
    }
  }

  componentDidMount(){
    const setArray = () =>{
      const newArr = this.props.data.quizzes.map(v => ({...v, selected:''}));
      this.setState({
        data:newArr
      });
      if(this.props.data.quiz_progress[0].quiz_progress !== null){
        var qui = JSON.parse(this.props.data.quiz_progress[0].quiz_progress);
        this.setState({
          attempt:qui[0].attempts,
          mark:qui[0].mark
        })
      }
    }
    setArray();
    
  }

  _onPress = ({id,index}) =>{
    let json = this.state.data
    for(var i in json){
      if(json[i].id === id){
        json[i].selected = index
        break;
      }
    }
    // console.log(json);
    this.setState({
      data:json
    })
  }
  _submitTest = async() =>{
    this.setState({
      loading:true
    })
    let json = this.state.data
    var count = 0
    var check = false
    for(var i in json){
      if(json[i].selected !== ''){
        if((json[i].selected+1).toString() === JSON.parse(json[i].correct_answers)[0]){
          count = count + 1
         }
         check = true
      }
     else{
       check = false
       this.setState({
        loading:false
      })
       alert("please fill all datas")
       break;
     }
      // console.log(count)
    }
    console.log((100/this.props.data.quizzes.length)*count)
    this.setState({
      current_mark:(100/this.props.data.quizzes.length)*count
    })
    var dd = {
      course_id: this.props.data.course_id,
      lesson_id: this.props.data.id.toString(),
      attempts: (this.state.attempt+1).toString(),
      total_questions: this.props.data.quizzes.length.toString(),
      correct_answers: count.toString()
  }
  if(check){
    let json = await Api('/quiz/submit','POST',dd);
    console.log(dd);
    this.setState({
      score:count,
      attempt:this.state.attempt + 1,
      mark:json.data[0].mark,
      open:true,
      loading:false
    })
  }
    // 
    
    //mark as completed
    //next lesson
  }
_renderItem = ({item}) =>{
  var id = item.id
  var select = item
  return(
    <View style={{marginLeft:10,marginTop:10,marginRight:10}}>
      <View style={{borderBottomWidth:0.5}}>
      <Text style={{fontSize:17}}>{item.title}</Text>
      </View>
      <FlatList
        data = {JSON.parse(item.options)}
        keyExtractor ={item=>item}
        renderItem = {({index,item})=>
        <View style={{flexDirection:"row",justifyContent:"space-between",marginTop:10}}>
          <Text>{item}</Text>
          <CheckBox style={{marginRight:20}} checked={select.selected===index} color="#fc5185" onPress={()=>this._onPress({id,index})}/>
        </View>
        }
        />
    </View>
  )
}
 
  render(){
    return (
      <>
      <View style={{backgroundColor:"white"}}>
        <Text style={{textAlign:"center",fontSize:20,marginTop:10}}>Quizz</Text>
      </View>
      <Modal 
        testID={'modal'} 
        isVisible={this.state.open}
        onBackButtonPress={()=>this.setState({open:false})}
        >
      <View style={styles.content}>
        <Text style={styles.contentTitle}>Congratulations 🎉!</Text>
        <Text>Your Highest Mark - {this.state.mark}</Text>
        <Text style={{marginBottom:10}}>Your Current Mark - {this.state.current_mark}</Text>
        <TouchableOpacity onPress={()=>this.setState({open:false})} style={{width:150,backgroundColor:appColor,padding:10,marginBottom:10,borderRadius:6}}>
          <Text style={{textAlign:"center",color:"white"}}>RETAKE TEST</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>this.props.navigatio.goBack()} style={{width:150,backgroundColor:appColor,padding:10,borderRadius:6}}>
          <Text style={{textAlign:"center",color:"white"}}>DONE</Text>
        </TouchableOpacity>
        </View>
      </Modal>
      {this.state.attempt !== 3 ? 
      <ScrollView style={{backgroundColor:"white"}}>
      
      <Modal 
        testID={'modal'} 
        isVisible={this.state.loading}
        >
      
        <ActivityIndicator />
     
      </Modal>
        
        
        <>
        <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",margin:10}}>
        <Text>Your Highest Mark - {this.state.mark}</Text>
        <Text>Remainig Attempt - {3 - this.state.attempt}</Text>
      </View>
      <SafeAreaView>
        <FlatList
                data = {this.state.data}
                keyExtractor={item=>item.id}
                renderItem = {({item})=>this._renderItem({item})}
              />
            </SafeAreaView>
          </>
              
            
      </ScrollView>
      :
      <View style={{flex:1,justifyContent:"center",alignItems:"center",alignContent:"center",backgroundColor:"white"}}>
        <Text style={styles.contentTitle}>👨🏻‍💻</Text>
        <Text style={styles.contentTitle}>Already Finished</Text>
        <Text style={styles.contentTitle}>Your Highest Mark is {this.state.mark}</Text>
        <TouchableOpacity onPress={()=>this.props.navigatio.goBack()}>
          <Text style={{color:appColor}}>Click Here To Goback</Text>
        </TouchableOpacity>
      </View>
      }
    {/* <Text>{this.state.score}</Text> */}
    {this.state.attempt !== 3 && <TouchableOpacity onPress={()=>this._submitTest()} style={{backgroundColor:appColor,padding:15,margin:10,borderRadius:15}}>
        <Text style={{color:"white",textAlign:"center"}}>Submit the Test</Text>
      </TouchableOpacity> }
      
      </>
    )
  }
}

const styles = StyleSheet.create({
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