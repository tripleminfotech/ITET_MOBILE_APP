import React,{ useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';
import Star from 'react-native-star-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// const [like,setLike] = useState(false);
const CourseComponent = ({item, onPress,click }) => {
  const rating = parseFloat(item.rating).toFixed(1);
    return(
        
            <TouchableOpacity onPress={() => onPress(item.id)} style={{ marginLeft: 20, marginBottom:15,backgroundColor:"#F4F4F4",borderRadius:10,flexDirection:"row",alignItems:"center",justifyContent:"space-between",padding:20,marginRight:20}}>
              <Image source={{uri:item.thumbnail}} style={{width:82,height:82}} />
              <View style={{marginLeft:10,width:200}}>
                <Text style={{flexShrink:1}}>{item.title}</Text>
                <Text style={{color:"#8F9BB3",fontSize:15}}>{item.instructor_name}</Text>
                <View style={{flexDirection:"row",alignItems:"center"}}>
                <Star score={isNaN(rating)?0:rating} style={{height:20,width:90}} />
                <Text style={{color:"#8F9BB3",fontSize:13}}>{isNaN(rating)?0:rating}</Text>
                <Text style={{color:"#C5CEE0",fontSize:13}}>({item.number_of_ratings} reviews)</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => click(item.id)}>
              <Icon name={item.is_wishlisted?"heart":"heart-outline"} color={"red"} size={20} style={{marginLeft:10}} />
            </TouchableOpacity>
            </TouchableOpacity>
          
    )
  }

export default CourseComponent;