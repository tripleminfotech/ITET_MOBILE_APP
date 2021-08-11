import { Button, CheckBox } from "native-base";
import React from "react";
import {
  View,
  Text,
 TouchableOpacity, StyleSheet, Modal, TouchableHighlight, ImageBackground
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
let arrnew = []
const jsonData = {"quiz" : {
  "quiz1" : {
    "question1" : {
      "correctoption" : "option3",
      "options" : {
        "option1" : "Java",
        "option2" : "PHP",
        "option3" : "Javascript",
        "option4" : "IOS"
      },
      "question" : "React is a ____ library"
    },
    "question2" : {
      "correctoption" : "option4",
      "options" : {
          "option1" : "XML",
          "option2" : "YML",
          "option3" : "HTML",
          "option4" : "JSX"
        },
      "question" : "____ tag syntax is used in React"
    },
    "question3" : {
      "correctoption" : "option1",
      "options" : {
          "option1" : "Single root DOM node",
          "option2" : "Double root DOM node",
          "option3" : "Multiple root DOM node",
          "option4" : "None of the above"
        },
      "question" : "Application built with just React usually have ____"
    },
    "question4" : {
      "correctoption" : "option2",
      "options" : {
          "option1" : "mutable",
          "option2" : "immutable",
          "option3" : "variable",
          "option4" : "none of the above"
        },
      "question" : "React elements are ____"
    },
    "question5" : {
      "correctoption" : "option3",
      "options" : {
          "option1" : "functions",
          "option2" : "array",
          "option3" : "components",
          "option4" : "json data"
        },
      "question" : "React allows to split UI into independent and reusable pieses of ____"
    }
  }
}
}
  export default class Test extends React.Component {
    constructor(props) {
      super(props);
      this.qno = 0
    this.score = 0

    const jdata = jsonData.quiz.quiz1
    arrnew = Object.keys(jdata).map( function(k) { return jdata[k] });
    this.state = {
                  selectedLang:'',
                  question : arrnew[this.qno].question,
                    options : arrnew[this.qno].options,
                    correctoption : arrnew[this.qno].correctoption,
                    countCheck : 0,
                    checkprev:false,
                    modalVisible:false
                };
    }

    prev(){
        if(this.qno<2 || this.qno === 0){
            this.setState({checkprev:false})
        }
        if(this.qno > 0){
          this.qno--
          this.setState({ question: arrnew[this.qno].question, options: arrnew[this.qno].options, correctoption : arrnew[this.qno].correctoption})
        }
      }
      next(){
        if(this.qno < arrnew.length-1){
          this.qno++
          this.setState({selectedLang:'',checkprev:true, countCheck: 0, question: arrnew[this.qno].question, options: arrnew[this.qno].options, correctoption : arrnew[this.qno].correctoption})
        }else{
          // this.setState({modalVisible:true})
          alert(this.score);
        //   this.props.quizFinish(this.score*100/5)
         }
      }
      _answer(ans){
        console.log(ans)
        // if(status == true){
        //     const count = this.state.countCheck + 1
        //     this.setState({ countCheck: count })
        //     if(ans == this.state.correctoption ){
        //       this.score += 1
        //     }
        //   }else{
        //     const count = this.state.countCheck - 1
        //     this.setState({ countCheck: count })
        //     if(this.state.countCheck < 1 || ans == this.state.correctoption){
        //     this.score -= 1
        //    }
        //   }
        const count = this.state.countCheck + 1
            this.setState({ countCheck: count })
            if(ans == this.state.correctoption ){
              this.score += 1
            }
            else{
              this.score -= 1
            }
    
      }
_renderOptions = ({text,_key}) =>{
    
    return(
            <View style={styles.item} key={_key}>  
                <CheckBox checked={this.state.selectedLang===_key} color="#fc5185" onPress={() => (this._answer(_key),this.setState({selectedLang:_key}))}/>
                <Text style={
                        {...styles.checkBoxTxt,
                            color:this.state.selectedLang===_key?"#fc5185":"gray",
                            fontWeight:this.state.selectedLang===_key? "bold" :"normal"
                        }}
            >{text}</Text>
            </View>
    )
    

} 
    render() {
    let _this = this
    const currentOptions = this.state.options
    const options = Object.keys(currentOptions).map( function(k) {
      return <_this._renderOptions _key={k} text={currentOptions[k]} />
    });
        return (
            <>
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                  this.setState({modalVisible:false})
                    this.props.navigation.reset({
                      index: 0,
                      routes: [{ name: 'certificate' }],
                    });;
                }}
            >
                <View style={styles.centeredView}>
                <View  style={styles.modalView}>
                <Text style={{...styles.modalText,fontSize:22}}>You have successfully completed your test</Text>
                <ImageBackground source={require('../mark_bg.png')} style={styles.image}>
                    <Text style={{fontSize:25,color:"#0095FF"}}>55/60</Text>
                    
                    </ImageBackground>
                    <TouchableHighlight
                    style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                    onPress={() => {
                      this.setState({modalVisible:false})
                        this.props.navigation.reset({
                          index: 0,
                          routes: [{ name: 'certificate' }],
                        });;
                    }}
                    >
                    <Text style={styles.textStyle}>Get Certificate</Text>
                    </TouchableHighlight>
                    </View>
                </View>
            </Modal>

                   
            <View style={{flex:1,margin:10,alignItems:"center",justifyContent:"center"}}>
            <Text style={{
                fontSize:25,
                fontWeight:"bold",
                color:"#364f6b",
                marginBottom:40,
              }}>{this.state.question}</Text>
              { options }
              
        <View style={{flexDirection:"row",justifyContent:"space-between"}}>
        
        {this.state.checkprev?
            <TouchableOpacity onPress={() => this.prev()} >
            <View style={styles.submit}>
              <Icon name="arrow-back" size={30} color="white" />
            </View>
          </TouchableOpacity >: <Text></Text> }
         

            <TouchableOpacity onPress={() => this.next()} >
          <View style={styles.submit}>
            <Icon name="arrow-forward" size={30} color="white" />
          </View>
        </TouchableOpacity >
        </View>
        </View>
           
      </>
        )
    }

}

const styles = StyleSheet.create({
        item:{
                width:"80%",
                backgroundColor:"#fff",
                borderRadius:20,
                padding:10,
                marginBottom:10,
                flexDirection:"row",
              },
        checkBoxTxt:{
            marginLeft:20
            },
        submit:{
        // width:"80%",
            backgroundColor:"#fc5185",
            borderRadius:20,
            padding:10,
            marginLeft:10,
            alignItems:"center",
            marginTop:40
            },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
    modalView: {
        margin: 20,
        width:"80%",
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
        },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
        },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
        },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
        },
    image: {
        margin: 20,
        width:"70%",
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    
    }
});