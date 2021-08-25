import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ImageBackground,
  YellowBox,
  LogBox,
  AsyncStorage,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ScrollView, TouchableHighlight} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import PopularCourse from '../components/PopularCourse';
import Api from '../components/Api';
import {ActivityIndicator} from 'react-native-paper';
import {colors} from 'react-native-elements';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';
import CourseComponent from '../components/CourseComponent';
import Modal from 'react-native-modal';
import Toast from 'react-native-simple-toast';
import {loaderData, MyLoader, MyLoader1} from '../components/MyLoaders';

export default function Detail({route, navigation}) {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height / 2;
  const [data, setData] = useState([]);
  const [category, setCategory] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalloading] = useState(false);
  const [loadingMore, setLoadingmore] = useState(false);
  const [listEnd, setListend] = useState(false);
  const onPresss = async (id) => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken) {
      setModalloading(true);

      let json = await Api('/toggle_wishlist', 'POST', {courseId: id});

      data.map((item, index) => {
        console.log(item);
        const ll = [...data];
        if (item.id === id) {
          item.is_wishlisted = !item.is_wishlisted;
          ll[index] = item;
          setData(ll);
        }
      });
      setModalloading(false);
      Toast.show(`${json.wishlist} successfully..!`, Toast.LONG);
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

  useEffect(() => {
    fetchData();
  }, []);
  const _handleLoadMore = () => {
    if (!listEnd) {
      setPage(page + 1);
      setLoadingmore(true);
      fetchData();
    } else {
      setLoadingmore(false);
    }
  };

  const _renderFooter = () => {
    if (!loadingMore) return null;

    return <MyLoader />;
  };

  // async function fetchData(){
  //   // let json = await Api(`https://testing.itexpertsacademy.com/api/courses/10/${page}`,"GET");
  //   let json = await Api(`https://testing.itexpertsacademy.com/api/courses/${page}`,"GET");

  //   if(json.length > 0){
  //     if(page === 1){
  //       setData(json);
  //     }
  //     else{
  //       setData([...data,...json]);
  //     }
  //   }
  //   else{
  //     setListend(true);
  //     setLoadingmore(false);
  //   }

  //   setLoading(false);
  // }
  async function fetchData() {
    let cate = await Api(`/categories/${route.params.id}`, 'GET');
    let json = await Api(`/course_by_category/${route.params.id}`, 'GET');
    let arr = [];
    for (var i = 0; i < json.length; i++) {
      if (json[i].status === 'active') {
        arr.push(json[i]);
      }
    }
    setData(arr);
    // setData(json);
    setCategory(cate[0]);
    setLoading(false);
  }
  const onPress = (id) => {
    navigation.navigate('Course', {id: id});
  };
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        {
          loading ? (
            <View style={{marginTop: 10}}>
              <MyLoader1 />
              <FlatList
                data={loaderData}
                keyExtractor={(item) => item.toString()}
                renderItem={({item}) => <MyLoader />}
              />
            </View>
          ) : (
            // <ScrollView style={{backgroundColor:"white"}}>

            //   <ImageBackground source={{ uri: "https://reactjs.org/logo-og.png" }} style={{ height:250, resizeMode: 'cover',flexDirection:"column-reverse"}}>
            //       <Text style={{color:"white",marginLeft:10}}>124 courses</Text>
            //       <Text style={{color:"white",marginLeft:10,fontSize:30}}>Python</Text>

            //   </ImageBackground>

            <FlatList
              ListHeaderComponent={
                <ImageBackground
                  source={{uri: category.thumbnail}}
                  style={{
                    height: 250,
                    resizeMode: 'cover',
                    flexDirection: 'column-reverse',
                    marginBottom: 10,
                  }}>
                  <Text style={{color: 'white', marginLeft: 10}}>
                    {data.length} courses
                  </Text>
                  <Text style={{color: 'white', marginLeft: 10, fontSize: 30}}>
                    {category.name}
                  </Text>
                </ImageBackground>
              }
              // style={{marginBottom: 20}}
              data={data}
              renderItem={({item}) => (
                <CourseComponent
                  item={item}
                  onPress={onPress}
                  click={onPresss}
                />
              )}
              keyExtractor={(item) => item.id}
              // onEndReached={() => _handleLoadMore()}
              // onEndReachedThreshold={0.01}
              // // initialNumToRender={10}
              // ListFooterComponent={()=>_renderFooter()}
              // // refreshing={loading}
              // alwaysBounceVertical={false}
            />
          )

          //  </ScrollView>
        }
      </SafeAreaView>
      <Modal testID={'modal'} isVisible={modalLoading}>
        <View style={styles.content}>
          <ActivityIndicator />
        </View>
      </Modal>
    </>
  );
}

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
