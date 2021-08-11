import React, { useState,useRef } from 'react';
import {
    View,
    TouchableOpacity,
    Text, Dimensions, StyleSheet, Button, TextInput
  } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SearchBar } from 'react-native-elements';
import Modal from 'react-native-modal';
import { Host, Portal } from 'react-native-portalize';
export default function MySearchBar({navigation}){
    const [search,setSearch] = useState('')
    const [data,setData] = useState('')
    const [isLoading,setLoading] = useState(false)
    const [isOpen,setisOpen] = useState(false)
  const onOpen = () => {
    setisOpen(true)
  };
  const onClose = () => {
    setisOpen(false)
  };
    const getMoviesFromApiAsync = async (search) => {
        try {
            const response = await fetch(`http://suggestqueries.google.com/complete/search?client=firefox&q=${search}`, {
                method: `get`
            });
            const data = await response.json();
            setData(data[1]);
            return data[1];
        } catch (error) {
          console.error(error);
        }
      };
     const updateSearch = (search) => {
        setSearch(search);
        //  if(data.length != 0){
        //      setLoading(false);
        //  }
        //  else{
        //      setLoading(true)
        //      getMoviesFromApiAsync(search)
        //  }
        getMoviesFromApiAsync(search)
       console.log(data);
      };
    
    return (
      
       <>
       {/* <View style={{flexDirection:"row", justifyContent:'center'}}>
       <Icon name="keyboard-backspace" size={30} onPress={()=>navigation.goBack()} style={{marginTop:22,marginRight:20}}/>
        <SearchBar
        placeholder="Type Here..."
        onChangeText={updateSearch}
        value={search}
        lightTheme={true}
        round = {true}
        onPress={()=>console.log("search pressed")}
        leftIcon={<Icon name="home"/>}
        containerStyle={{backgroundColor:"#ffff",width:263,height:44,padding:0,marginTop:15}}
        
      />
      <Icon name="filter-variant" size={30} style={{marginTop:20,marginLeft:20}} onPress={onOpen}/>
      </View> */}
      <View style={styles.searchSection}>
        <Icon style={styles.searchIcon} name="home" size={20} color="#000"/>
        <TextInput
            style={styles.input}
            placeholder="User Nickname"
            onChangeText={(searchString) => {this.setState({searchString})}}
            underlineColorAndroid="transparent"
        />
    </View>
     <View style=
     {{flex:1,justifyContent:"center",flexDirection:"row",marginTop:20}}>
           <Text>searching "{search}"</Text>
       </View>

      <Portal>
      <Modal
        testID={'modal'}
        isVisible={isOpen}
        onSwipeThreshold={200}
        onSwipeComplete={onClose}
        swipeDirection={['up', 'left', 'right', 'down']}
        style={styles.view}>
          <>
          <View style={{backgroundColor:"white",borderTopLeftRadius:5,borderTopRightRadius:5}}>
            <Icon name="minus" size={30} color={"#D8D8D8"} style={{textAlign:"center",}} />
            <View style={{flexDirection:"row",justifyContent:"space-between",marginLeft:10,marginRight:10,borderBottomWidth:0.5,borderBottomColor:"#EDF1F7"}}>
              <Text style={{fontSize:22,color:"#222B45"}}>Filters</Text>
              <Text style={{fontSize:15,color:"#8F9BB3"}}>clear</Text>
            </View>
            <View>
              <Text>hello</Text>
            </View>
          </View>
      
      </>
      </Modal>
      </Portal>
    </>
    )
}

const styles = StyleSheet.create({
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
},
searchIcon: {
    padding: 10,
},
input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: '#fff',
    color: '#424242',
},
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
});
