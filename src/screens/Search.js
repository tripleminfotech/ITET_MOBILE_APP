// import React, { useState,useRef, useEffect } from 'react';
// import {
//     View,
//     TouchableOpacity,
//     Text, Dimensions, StyleSheet, Button, TextInput, FlatList, ScrollView, AsyncStorage
//   } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import MaterialIcon from "react-native-vector-icons/MaterialIcons";

// import { SearchBar } from 'react-native-elements';
// import Modal from 'react-native-modal';
// import { Host, Portal } from 'react-native-portalize';
// import PopularCourse from '../components/PopularCourse';
// import { SafeAreaView } from 'react-navigation';
// import { Checkbox } from 'react-native-paper';
// import Api from '../components/Api';
// import CourseComponent from '../components/CourseComponent';
// export default function Search({navigation}){
//   const initial = {
//     level:[{id:1,value:'Beginer',checked:false},{id:2,value:'Intermediate',checked:false},{id:3,value:'Advanced',checked:false}],
//     sort:[{id:1,value:'Rating',checked:false},{id:2,value:'Free Course',checked:false}]
//   }
//     const [search,setSearch] = useState('')
//     const [data,setData] = useState('')
//     const [focus,setFocus] = useState(false)
//     const [isLoading,setLoading] = useState(false)
//     const [submit,setSubmit] = useState(false);
//     const [isOpen,setisOpen] = useState(false)
//     const data1 = require('./userList.json');
//     const [sdata,setSdata] = useState([]);
//     const [filter,setFilter] = useState(initial);
//     const [showFilter,setShowfilter] = useState(false);
//   //   const onPress = () =>{
//   //     navigation.navigate('Course')
//   // }
//   // useEffect(() => {
//   //   filter.level.map((key) => console.log(key)) ;
//   //   // console.log()
//   // });
//   const filterCheck = (key,id) => {
//     console.log(key,id)
//     if (key === 'level'){
//       var newData = filter.level.map(val => ({...val,checked: val.id === id ? !val.checked : val.checked}));
//       setFilter(f => ({...f,level:newData}));
//     }
//     else{
//       var newData = filter.sort.map(val => ({...val,checked: val.id === id ? !val.checked : val.checked}));
//       setFilter(f => ({...f,sort:newData}));
//     }
//   }
//   const onOpen = () => {
//     setisOpen(true)
//   };
//   const onClose = () => {
//     setisOpen(false);
//     setFilter(initial);
//   };
//   const _onTyping = text => {

//     console.log(text.length)
//     if(text.length === 0){

//         setFocus(false)
//         setShowfilter(false);

//     }
//     else{
//       setFocus(true)
//       setSearch(text)
//       setLoading(true)
//       setShowfilter(false);
//     }

//       setSearch(text)
//       getMoviesFromApiAsync(text);
//        console.log(data);
//   }
//     const getMoviesFromApiAsync = async (search) => {

//       setLoading(true)
//         try {
//             const response = await fetch(`http://suggestqueries.google.com/complete/search?client=firefox&q=${search}`, {
//                 method: `get`
//             });
//             const data = await response.json();
//             setData(data[1]);
//             // setLoading(false);
//             // setShowfilter(true);
//             return data[1];
//         } catch (error) {
//           console.error(error);
//         }
//       };

//     const onSubmit = (value) =>{
//       console.log(value);
//       setSearch(value)
//       setLoading(false)
//       setShowfilter(true)
//       fetchData();
//     }
//     const fetchData = async() =>{
//       let json = await Api('/search','POST',{"string": search});
//       setSdata(json);
//     }
//     const onPresss = async(id) => {
//       const userToken = await AsyncStorage.getItem('userToken');
//         if(userToken){
//          await Api('/toggle_wishlist',"POST",{courseId:id});
//          fetchData();

//         }
//         else{
//           Alert.alert(
//             "Alert",
//             "sign in please",
//             [
//               {
//                 text: "Cancel",
//                 onPress: () => console.log("Cancel Pressed"),
//                 style: "cancel"
//               },
//               { text: "Sign in", onPress: () => navigation.navigate('login') }
//             ],
//             { cancelable: false }
//           );

//         }
//       }
//     const onPress = (id) =>{
//       navigation.navigate('Course',{'id':id})
//     }
//     return (

//     <View style={{flex:1,backgroundColor:"white"}}>
//       <View style={styles.searchSection}>
//       {focus?  <MaterialIcon style={styles.searchIcon} name="arrow-back" size={20} color="#000"/> :
//          <MaterialIcon style={styles.searchIcon} name="search" size={20} color="#000"/>}
//         <TextInput
//             style={styles.input}
//             placeholder="User Nickname"
//             placeholder="Type Here..."
//             onChangeText={_onTyping}
//             value={search}
//             returnKeyType={"search"}
//             onSubmitEditing={() => onSubmit(search)}
//             underlineColorAndroid="transparent"
//         />

//         {focus?  <MaterialIcon name="clear" size={20} style={{marginRight:20}} onPress={()=>{setSearch('');setFocus(false);setShowfilter(false)}}/> :
//          null}
//         {showFilter?<Icon name="filter-variant" size={30} style={{marginRight:10}} onPress={onOpen} /> : null }
//     </View>
//     {isLoading ?<FlatList
//               ListHeaderComponent = {
//                 <>
//                 <TouchableOpacity onPress={()=>onSubmit(search)} style={{flexDirection:"row",margin:15}}>
//                   <MaterialIcon name="search" size={20} color="#000"/>
//                      <Text style={{marginLeft:10}}>search for "{search}" in ITET</Text>
//                 </TouchableOpacity>
//                 <Text style={{margin:10,fontSize:18}}>SUGGESTED COURSE SEARCHES</Text>
//                 </>
//               }
//               style={{marginBottom: 50,marginRight:20}}
//               showsVerticalScrollIndicator={false}
//             data={data}
//             renderItem={({ item }) =><TouchableOpacity onPress={()=>onSubmit(item)} style={{flexDirection:"row",margin:10}}>
//               <MaterialIcon name="search" size={20} color="#000"/>
//                                         <Text style={{marginLeft:10}}>{item}</Text>
//                                       </TouchableOpacity>}
//             keyExtractor={item => item.id}
//           /> : <FlatList
//                     data = {sdata}
//                     renderItem={({item})=><CourseComponent item={item} onPress={onPress} click={onPresss} />}
//                     keyExtractor={item=> item.id}
//                     />

//        }

//       <Portal>
//       <Modal
//         testID={'modal'}
//         isVisible={isOpen}
//         onSwipeThreshold={200}
//         onSwipeComplete={onClose}
//         onBackButtonPress={onClose}
//         swipeDirection={['up', 'left', 'right', 'down']}
//         style={styles.view}>
//           <>
//           <View style={{backgroundColor:"white",borderTopLeftRadius:5,borderTopRightRadius:5}}>
//             <Icon name="minus" size={30} color={"#D8D8D8"} style={{textAlign:"center",}} />
//             <View style={{flexDirection:"row",justifyContent:"space-between",marginLeft:10,marginRight:10,borderBottomWidth:0.5,borderBottomColor:"#EDF1F7"}}>
//               <Text style={{fontSize:22,color:"#222B45"}}>Filters</Text>
//               <TouchableOpacity onPress={()=> setFilter(initial)}>
//                   <Text style={{fontSize:15,color:"#8F9BB3"}}>clear</Text>
//               </TouchableOpacity>
//             </View>
//             <View style={{margin:10}}>
//               <Text style={{fontSize:17}}>Level</Text>
//                 {filter.level.map((key) =>

//                       <View style={{marginTop:10,flexDirection:"row",justifyContent:"space-between",borderBottomWidth:0.2,borderBottomColor:"#EDF1F7"}}>
//                       <Text>{key.value}</Text>
//                       <Checkbox status={ key.checked? "checked" : "unchecked"}
//                       onPress={() => filterCheck("level",key.id)}
//                       />
//                       </View>)

//                       }

//             </View>
//             <View style={{margin:10}}>
//               <Text style={{fontSize:17}}>Sort</Text>
//                 {filter.sort.map((key) =>

//                       <View style={{marginTop:10,flexDirection:"row",justifyContent:"space-between",borderBottomWidth:0.2,borderBottomColor:"#EDF1F7"}}>
//                       <Text>{key.value}</Text>
//                       <Checkbox status={ key.checked? "checked" : "unchecked"}
//                       onPress={() => filterCheck("sort",key.id)}
//                       />
//                       </View>)

//                       }

//             </View>
//             <TouchableOpacity onPress={()=>console.log('apply')} style={{margin:10,padding:15,backgroundColor:"blue",borderRadius:15}}>
//               <Text style={{textAlign:"center",color:"white"}}>Apply</Text>
//             </TouchableOpacity>
//           </View>

//       </>
//       </Modal>
//       </Portal>
//     </View>
//     )
// }

// const styles = StyleSheet.create({
//   searchSection: {
//     // marginRight:10,
//     marginTop:10,
//     // marginLeft:10,
//     // borderRadius:10,
//     borderBottomWidth:0.2,
//     marginBottom:5,
//     // flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     // backgroundColor: '#F4F4F4',
// },
// searchIcon: {
//     padding: 10,
// },
// input: {
//     flex: 1,
//     paddingTop: 10,
//     paddingRight: 10,
//     paddingBottom: 10,
//     borderRadius:10,
//     paddingLeft: 0,
//     // backgroundColor: '#F4F4F4',
//     color: '#424242',
// },
//   view: {
//     justifyContent: 'flex-end',
//     margin: 0,
//   },
//   content: {
//     backgroundColor: 'white',
//     padding: 22,
//     justifyContent: 'center',
//     alignItems: 'center',
//     // borderRadius: 4,
//     borderColor: 'rgba(0, 0, 0, 0.1)',
//   },
//   contentTitle: {
//     fontSize: 20,
//     marginBottom: 12,
//   },
// });

// // const data = require('./userList.json');
// // export default function Search({navigation}){

// //     return (
// //         <View>

// //       {/* <FlatList
// //         data={data}
// //         renderItem={({ item }) =><PopularCourse item={item} />}
// //         keyExtractor={item => item.id}
// //       /> */}
// //       </View>
// //     )
// // }

import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TextInput, View, FlatList} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import * as Animate from 'react-native-animatable';
import AsyncStorage from '@react-native-community/async-storage';
import Api from '../../components/Api';
import CourseComponent from '../../components/CourseComponent';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';
import PopularCourse from '../../components/PopularCourse';
import {Alert} from 'react-native';
const loaderData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export default function Search({navigation}) {
  const [isLoading, setLoading] = useState(false);
  const [isTyping, setTyping] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [focus, setFocus] = useState(false);
  const [searchData, setSearchData] = useState([]);
  useEffect(() => {
    getData();
  }, []);
  const MyLoader = () => (
    <ContentLoader
      height={100}
      width={400}
      speed={2}
      primaryColor="#f3f3f3"
      secondaryColor="#ecebeb">
      <Rect x="110" y="10.92" rx="4" ry="4" width="288.99" height="12.24" />
      <Rect x="110" y="29.92" rx="3" ry="3" width="255.85" height="9.85" />
      <Rect x="20.33" y="5.92" rx="0" ry="0" width="78.48" height="71.72" />
      <Rect x="110" y="35.92" rx="0" ry="0" width="0" height="0" />
      <Rect x="110" y="54.78" rx="3" ry="3" width="55.93" height="10.05" />
      <Rect x="181" y="54.78" rx="3" ry="3" width="55.93" height="10.05" />
      <Rect x="248" y="54.78" rx="3" ry="3" width="55.93" height="10.05" />
    </ContentLoader>
  );

  const getData = async () => {
    setLoading(true);
    let json = await Api('/popular_courses', 'GET');
    let arr = [];
    for (var i = 0; i < json.length; i++) {
      if (json[i].status === 'active') {
        arr.push(json[i]);
      }
    }
    setData(arr);
    setLoading(false);
  };
  const fetchData = async () => {
    setLoading(true);
    let json = await Api('/search', 'POST', {string: search});
    console.log(json);
    if (json.length > 0) {
      let arr = [];
      for (var i = 0; i < json.length; i++) {
        if (json[i].status === 'active') {
          arr.push(json[i]);
        }
      }
      setSearchData(arr);
      setTyping(false);
      setLoading(false);
      // setSearchData(json);
    } else if (json.error) {
      setTyping(false);
      setError(false);
      setSubmit(false);
      setLoading(false);
      // setSearchData(json);
    } else {
      setTyping(false);
      setError(true);
      setSubmit(false);
      setSearchData(json);
      setLoading(false);
    }
  };
  const onPresss = async (id) => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken) {
      await Api('/toggle_wishlist', 'POST', {courseId: id});
      getData();
      fetchData();
    } else {
      Alert.alert(
        'Alert',
        'sign in please',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'Sign in', onPress: () => navigation.navigate('login')},
        ],
        {cancelable: false},
      );
    }
  };
  const onPress = (id) => {
    navigation.navigate('Course', {id: id});
  };
  const _onSubmit = async () => {
    setSubmit(true);
    fetchData();
  };

  const _onTyping = (text) => {
    console.log(text.length);
    if (text.length === 0) {
      setTyping(false);
      setFocus(false);
      setSubmit(false);
      setError(false);
    } else {
      setTyping(true);
      setFocus(true);
      setSearch(text);
    }

    setSearch(text);
  };
  return (
    <>
      <View style={{backgroundColor: 'white'}}>
        <Animate.View
          animation="slideInRight"
          duration={1000}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            margin: 20,
            borderRadius: 8,
            shadowOffset: {
              width: 0,
              height: 11,
            },
            shadowOpacity: 0.57,
            shadowRadius: 15.19,
            elevation: 3,
          }}>
          {focus ? (
            <MaterialIcon
              style={styles.searchIcon}
              name="arrow-back"
              size={20}
              color="#000"
            />
          ) : (
            <MaterialIcon
              style={styles.searchIcon}
              name="search"
              size={20}
              color="#000"
            />
          )}
          <TextInput
            style={styles.input}
            onChangeText={_onTyping}
            value={search}
            placeholder="Search here"
            returnKeyType={'search'}
            // keyboardType="number-pad"
            underlineColorAndroid="transparent"
            onSubmitEditing={_onSubmit}
          />
          {focus && (
            <MaterialIcon
              name="clear"
              size={20}
              style={{marginRight: 20}}
              onPress={() => {
                setFocus(false);
                setSearch('');
                setSubmit(false);
                setError(false);
              }}
            />
          )}
        </Animate.View>
      </View>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        {isLoading ? (
          <FlatList
            data={loaderData}
            keyExtractor={(item) => item.toString()}
            renderItem={({item}) => <MyLoader />}
          />
        ) : isTyping ? (
          <Text style={{textAlign: 'center'}}>
            click search to get result for "{search}"
          </Text>
        ) : submit ? (
          <FlatList
            data={searchData}
            renderItem={({item}) => (
              <CourseComponent item={item} onPress={onPress} click={onPresss} />
            )}
            keyExtractor={(item) => item.id}
          />
        ) : error ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{textAlign: 'center', fontSize: 35}}>
              data not found
            </Text>
          </View>
        ) : (
          <View>
            <Text style={{marginLeft: 20, fontSize: 17, marginBottom: 10}}>
              Maybe you like
            </Text>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={data}
              style={{marginBottom: 30, marginRight: 20}}
              renderItem={({item}) => (
                <PopularCourse item={item} onPress={onPress} click={onPresss} />
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    borderRadius: 10,
    paddingLeft: 0,
    // backgroundColor: '#F4F4F4',
    color: '#424242',
  },
  container: {
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
    borderRadius: 8,
  },

  // Tab Selector Styles
  tabContainer: {
    flexDirection: 'row',
    height: 40,
    marginTop: 10,
    marginBottom: 10,
    position: 'relative',
    backgroundColor: '#EEEEEE',
    borderRadius: 8,
  },

  overlay: {
    position: 'absolute',
    width: '33.33%',
    height: '100%',
    top: 0,
    left: 0,
    backgroundColor: '#36C48E',
    borderRadius: 8,
  },

  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },

  tab1: {
    borderRightWidth: 0,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },

  tab2: {
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },

  tab3: {
    borderLeftWidth: 0,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },

  // Content Styles
  contentContainter: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  contentText: {
    color: 'white',
    fontSize: 25,
    fontFamily: 'Nunito-Bold',
  },
});
