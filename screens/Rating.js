import { Rating, AirbnbRating } from 'react-native-ratings';
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput
} from "react-native";
import Api from '../components/Api';
import { appColor } from '../components/Style';
export default function Review({navigation,route}) {
    const [value,setValue] = useState(1);
    const [review,setReview] = useState('');
    const ratingCompleted = (rating) => {
        setValue(rating);
      console.log("Rating is: " + rating)
    }
    useEffect(()=>{
        console.log(route.params);
    },[])
    const submitReview = async() =>{
        let json = await Api('/review/add','POST',{courseId:route.params.id,rating:value,review:review});
        console.log(json);
        navigation.goBack();
    }
    return(
        <>
        <Text style={{fontSize:18,margin:10}}>Course</Text>
        <View style={{backgroundColor:"white",borderWidth:3,borderColor:"white",margin:10}}>
            <View style={{flexDirection:"row",margin:10,alignItems:"center"}}>
                <Image source={{uri:route.params.image}} style={{height:50,width:50}} />
                <Text style={{marginLeft:10}}>{route.params.name}</Text>
            </View>
            <View style={{marginTop:20}}>
                <Text style={{textAlign:"center",fontSize:22}}>Perfect!!! You did rate {value} star for this course</Text>
                <Text style={{textAlign:"center",fontSize:15,color:"#8F9BB3",marginTop:20}}>Your reviews help us to be better</Text>
            </View>
            <View style={{marginBottom:25}}>
            <AirbnbRating
                showRating
                defaultRating={1}
                onFinishRating={ratingCompleted}
                count={5}
                ratingColor='#3498db'
                ratingBackgroundColor='#c8c7c8' />
            </View>
            <View style={{margin:10,padding:10}}>
            <TextInput
                placeholder="Say something about this course..."
                    style={{
                    width: '100%',
                    height:74,
                    // borderColor: '#D2D5DB',
                    // borderWidth: 1,
                    borderRadius:15,
                    backgroundColor:"#F4F4F4"
                   
                    }}
                    multiline
                    onChangeText={(text)=>setReview(text)}
                    value={review}
              />
            </View>
        </View>
        <View>
        <TouchableOpacity
            style={{
 
                marginTop:10,
                paddingTop:15,
                paddingBottom:15,
                marginLeft:30,
                marginRight:30,
                backgroundColor:appColor,
                borderRadius:10,
                borderWidth: 1,
                borderColor: '#fff'
              }}
            activeOpacity = { .5 }
            onPress={() => submitReview() }
        >
  
              <Text style={{
                color:'#fff',
                textAlign:'center',
            }}> Submit Review </Text>
              
        </TouchableOpacity>
        </View>
        
     
        </>
    )
    
}
