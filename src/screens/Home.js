import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import {ScrollView, TouchableHighlight} from 'react-native-gesture-handler';
import Category from '../components/Card';
import PopularCourse from '../components/PopularCourse';
import Api from '../components/Api';
import ShoppingCartIcon from '../components/CartIcon';
import AsyncStorage from '@react-native-community/async-storage';
const Discover = ({navigation}) => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height / 2;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [login, setLogin] = useState(false);
  const onPress = (id) => {
    navigation.navigate('Course', {id: id});
  };

  useEffect(() => {
    async function fetchData() {
      console.log('fetching');
      let json = await Api(`/categories`, 'GET');
      let json2 = await Api(`/popular_courses`, 'GET');
      await setCategories(json);
      await setData(json2);
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        setLogin(true);
      }
    }

    navigation.addListener('focus', () => {
      fetchData();
    });
    // return _unsubscribe();
  }, []);
  const onPresss = async (id) => {
    // const userToken = await AsyncStorage.getItem('userToken');
    if (login) {
      await Api('/toggle_wishlist', 'POST', {courseId: id});

      data.map((item, index) => {
        console.log(item);
        const ll = [...data];
        if (item.id === id) {
          item.is_wishlisted = !item.is_wishlisted;
          ll[index] = item;
          setData(ll);
        }
      });
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
  return (
    <>
      <View style={{backgroundColor: 'white'}}>
        {login ? (
          <ShoppingCartIcon navigation={navigation} />
        ) : (
          <TouchableOpacity
            style={{flexDirection: 'row-reverse', margin: 15}}
            onPress={() => navigation.navigate('login')}>
            <Text>SIGN IN</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView style={{backgroundColor: 'white'}}>
        <View
          style={{
            marginTop: 20,
            marginBottom: 10,
            backgroundColor: 'red',
            alignSelf: 'center',
          }}>
          <Image
            style={{width: windowWidth - 30, height: windowHeight - 60}}
            source={require('../components/assets/banner.jpg')}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginLeft: 15,
            marginBottom: 12,
            marginTop: 12,
            justifyContent: 'space-between',
          }}>
          <Text style={{fontSize: 17}}>Category</Text>
          {/* <Text style={{color: '#0095FF',fontSize:17,marginRight:10}} onPress={() => navigation.navigate('Profile')}>
                            View all &gt;>
                    </Text> */}
        </View>
        <View style={{marginTop: 10, marginBottom: 10}}>
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={categories}
            renderItem={({item}) => (
              <Category item={item} navigation={navigation} />
            )}
            keyExtractor={(item) => item.id}
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
          <View
            style={{
              flexDirection: 'row',
              marginLeft: 15,
              marginBottom: 12,
              marginTop: 12,
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: 17}}>Popular Courses</Text>
            {/* <Text style={{color: '#0095FF',fontSize:17,marginRight:10}} onPress={() => navigation.navigate('Profile')}>
                            View all >>
                    </Text> */}
          </View>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <FlatList
              numColumns={2}
              showsHorizontalScrollIndicator={false}
              data={data}
              renderItem={({item}) => (
                <PopularCourse item={item} click={onPresss} onPress={onPress} />
              )}
              keyExtractor={(item) => item.id}
            />
          </ScrollView>
        </View>
      </ScrollView>
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

export default Discover;
