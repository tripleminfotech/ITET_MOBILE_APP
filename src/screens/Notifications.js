import React,{ Component } from 'react';
import {
  View,
  FlatList,
  Text,
  StatusBar,
  Image,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
function Notifications(props){
    const renderItems = ({item}) =>{
        return (
            <TouchableOpacity onPress={()=>props.navigation.navigate('notifi',{id:item.id})} style={{marginTop:10,marginLeft:10,marginRight:10,padding:10,backgroundColor:"white",borderRadius:10}}>
            <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                <Text style={{fontSize:17,fontWeight:item.read?"normal":"bold"}}>{item.sender}</Text>
                {/* <Icon name="circle-medium" color={false?"green":"red"} size={30}/> */}
            </View>
                    <Text>{item.subject}</Text>
            </TouchableOpacity>
        )
    }
    return (
        <>
        <View style={{backgroundColor:"white",alignItems:"center",paddingTop:50,paddingBottom:30}}>
            <StatusBar  backgroundColor="black" />
            <Text style={{fontSize:18}}>Notifications</Text>
        </View>
        <FlatList
        data = {props.value}
        renderItem = {(item)=>renderItems(item)}
        keyExtractor = {item => item.id}
        />
        
        </>
    )
}
const mapStateToProps = (state) => {
    return {
        value: state.notificationItems.notification,
        read: state.notificationItems.read
    }
}
export default connect(mapStateToProps, null)(Notifications);