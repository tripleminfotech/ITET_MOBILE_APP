import React,{ useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet, Image, Dimensions, AsyncStorage, Alert, Button
} from 'react-native';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import Toast from 'react-native-simple-toast';
import Category from '../components/Card';
import RecommendCourse from '../components/RecommendCourse';
import PopularCourse from '../components/PopularCourse';
import Api from '../components/Api';
import ShoppingCartIcon from '../components/CartIcon';
import { ActivityIndicator } from 'react-native-paper';
import Modal from 'react-native-modal';
import { appColor } from '../components/Style';
import { loaderData, MyLoader, MyLoader1 } from '../components/MyLoaders';


const Discover = ({ navigation }) => {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height / 2;
    const [loading,setLoading] = useState(true);
    const [modalLoading,setModalloading] = useState(false)
    const [data,setData] = useState([]);
    const [categories,setCategories] = useState([]);
    const [login,setLogin] = useState(false);
    const onPress = (id) =>{
      navigation.navigate('Course',{'id':id})
  }
  
  useEffect(() => {
    setLoading(true)
    async function fetchData(){
      console.log('fetching');
      let json = await Api(`/categories`,"GET");
      let json2 = await Api(`/popular_courses`,"GET");
      await setCategories(json);
      let arr = []
      for(var i=0;i<json2.length;i++){
        if(json2[i].status === 'active'){
          arr.push(json2[i])
        }
      }
      await setData(arr);
      const userToken = await AsyncStorage.getItem('userToken');
      if(userToken){
        setLogin(true);
      }
      setLoading(false)
    }
    

    navigation.addListener('focus', () => {
      fetchData();
    });
    fetchData();

    // return _unsubscribe();
  }, []);
    const onPresss = async(id) => {
      // const userToken = await AsyncStorage.getItem('userToken');
        if(login){
          setModalloading(true);
         let json = await Api('/toggle_wishlist',"POST",{courseId:id});
         data.map((item,index) =>{
              const ll = [...data]
              if(item.id === id){
               item.is_wishlisted = !item.is_wishlisted;
               ll[index] = item;
               setData(ll);
              }
            });
            setModalloading(false)
            Toast.show(`${json.wishlist} successfully..!`, Toast.LONG);
        }
        else{
          Alert.alert(
            "Alert",
            "sign in please",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "Sign in", onPress: () => navigation.navigate('login') }
            ],
            { cancelable: false }
          );
          
        }
        
     
    }
  return (
    <>
    {loading?
    <View style={{marginTop:10}}>
    <MyLoader1 />
    <FlatList
    data={loaderData}
    keyExtractor = {item => item.toString()}
    renderItem = {({item})=><MyLoader />}
    />
    </View>
     :
    <View>
      <Modal testID={'modal'} isVisible={modalLoading}>
      <View style={styles.content}>
      <ActivityIndicator/>
      </View>
      </Modal>
    <View style={{backgroundColor:"white",flexDirection:"row",alignItems:"center",justifyContent:"space-between",padding:5}}>
      <View style={{
        marginLeft: 10
      }}>
        <Image source={require('../logo-dark.png')} style={{alignItems:"center",width:102,height:31}} />
      </View>
      {login?
      <ShoppingCartIcon navigation={navigation} />
      :
      <TouchableOpacity style={{flexDirection:"row-reverse",margin:15}} onPress={()=>navigation.navigate('login')}>
        <Text style={{color:appColor}}>SIGN IN</Text>
      </TouchableOpacity>
    }
    </View>
      <ScrollView style={{backgroundColor:"white"}}>
        <View style={{ marginBottom:10, backgroundColor: "red",alignSelf:'center' }}>
              <Image
              style={{ width: windowWidth-30, height: windowHeight-60 }}
              source={require('../components/assets/banner.jpeg')}
            />
        </View>
    <View style={{ flexDirection:"row", marginLeft: 15,marginBottom:12,marginTop:12,justifyContent:"space-between"  }}>
                    <Text style={{ fontSize:17}}>Category</Text>
                    {/* <Text style={{color: '#0095FF',fontSize:17,marginRight:10}} onPress={() => navigation.navigate('Profile')}>
                            View all &gt;>
                    </Text> */}
    </View>
    <View style={{ marginTop: 10,marginBottom:10 }}>  
       <FlatList
       horizontal={true}
       showsHorizontalScrollIndicator ={false}
        data={categories}
        renderItem={({ item }) =><Category item={item} navigation={navigation} />}
        keyExtractor={item => item.id}
      />
    </View>
    
    {/* <View>  
    <View style={{ flexDirection:"row", marginLeft: 15,marginBottom:12,marginTop:12,justifyContent:"space-between"  }}>
                    <Text style={{ fontSize:17}}>Suitable for you</Text>
                    <Text style={{color: '#0095FF',fontSize:17,marginRight:10}} onPress={() => navigation.navigate('Profile')}>
                            View all >>
                    </Text>
    </View>

       <FlatList
       horizontal={true}
       showsHorizontalScrollIndicator ={false}
        data={data}
        renderItem={({ item }) =><RecommendCourse item={item} navigation={navigation}/>}
        keyExtractor={item => item.id}
      />
    </View> */}
    <View>  
    <View style={{ flexDirection:"row", marginLeft: 15,marginBottom:12,marginTop:12,justifyContent:"space-between"  }}>
                    <Text style={{ fontSize:17}}>Popular Courses</Text>
                    {/* <Text style={{color: '#0095FF',fontSize:17,marginRight:10}} onPress={() => navigation.navigate('Profile')}>
                            View all >>
                    </Text> */}
    </View>
    <ScrollView
    horizontal={true}
    showsHorizontalScrollIndicator={false}
  >
       <FlatList
       style={{marginBottom:60,marginRight:20}}
       numColumns={2}
       showsHorizontalScrollIndicator ={false}
        data={data}
        renderItem={({ item }) =><PopularCourse item={item} click={onPresss} onPress={onPress} />}
        keyExtractor={item => item.id}
      />
    </ScrollView>

    </View>
    
    </ScrollView>
    </View>
    }
    </>
  );
};

// const styles = StyleSheet.create(
//     {
//         inputsContainer: {
//             flex: 1
//           },
//           fullWidthButton: {
//             backgroundColor: 'blue',
//             height:70,
//             alignSelf: 'stretch'
//           },
//           fullWidthButtonText: {
//             fontSize:24,
//             color: 'white'
//           }
//     }
// )
const styles = StyleSheet.create({
  content: {
    // backgroundColor: 'white',
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

export default Discover;