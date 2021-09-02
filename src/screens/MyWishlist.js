import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
  Image,
  Dimensions,
  ImageBackground,
  FlatList,
  LogBox,
  AsyncStorage,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useIsFocused} from '@react-navigation/native';
import Modal from 'react-native-modal';
import Api from '../../components/Api';
import CourseComponent from '../../components/CourseComponent';
import PopularCourse from '../../components/PopularCourse';
import {ActivityIndicator} from 'react-native-paper';
import {appColor} from '../../components/Style';
import {loaderData, MyLoader} from '../../components/MyLoaders';
import {StyleSheet} from 'react-native';
import Toast from 'react-native-simple-toast';
import Star from 'react-native-star-view';

// const data = [
//     {
//      image:'https://images.unsplash.com/photo-1567226475328-9d6baaf565cf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
//      desc: '3000 Most Popular English Vocabulary',
//      like:true,
//      id:'1'
//     },
//    {
//      image:'https://images.unsplash.com/photo-1455620611406-966ca6889d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1130&q=80',
//      desc:
//        'Python',
//        like:true,
//       id:'2'
//    },
//    {
//     image:'https://images.unsplash.com/photo-1455620611406-966ca6889d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1130&q=80',
//     desc:
//       'Java',
//       like:true,
//      id:'3'
//   },
//   {
//     image:'https://images.unsplash.com/photo-1567226475328-9d6baaf565cf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
//     desc: 'C++',
//     like:false,
//     id:'4'
//    }
//    ]

const {width} = Dimensions.get('window');

export default class MyWishlist extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    data: [],
    loading: true,
    login: false,
    open: false,
  };
  CourseComponent = ({item, onPress, click}) => {
    const rating = parseFloat(item.rating).toFixed(1);
    return (
      <TouchableOpacity
        onPress={() => onPress(item.id)}
        style={{
          marginLeft: 20,
          marginBottom: 15,
          backgroundColor: '#F4F4F4',
          borderRadius: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 20,
          marginRight: 20,
        }}>
        <Image source={{uri: item.thumbnail}} style={{width: 82, height: 82}} />
        <View style={{marginLeft: 10, width: 200}}>
          <Text style={{flexShrink: 1}}>{item.title}</Text>
          <Text style={{color: '#8F9BB3', fontSize: 15}}>
            {item.instructor_name}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Star
              score={isNaN(rating) ? 0 : rating}
              style={{height: 20, width: 90}}
            />
            <Text style={{color: '#8F9BB3', fontSize: 13}}>
              {isNaN(rating) ? 0 : rating}
            </Text>
            <Text style={{color: '#C5CEE0', fontSize: 13}}>
              ({item.number_of_ratings} reviews)
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => click(item.id)}>
          <Icon
            name={'heart'}
            color={'red'}
            size={20}
            style={{marginLeft: 10}}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };
  onPresss = async (id) => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken) {
      this.setState({open: true});
      await Api('/toggle_wishlist', 'POST', {courseId: id});
      Toast.show(`Removed successfully..!`, Toast.LONG);
      this.fetchData();
      this.setState({open: false});
    }
  };
  onPress = (id) => {
    this.props.navigation.navigate('Course', {id: id});
  };
  componentWillUnmount() {
    this._unsubscribe();
  }
  componentDidMount() {
    const {navigation} = this.props;

    this._unsubscribe = navigation.addListener('focus', () => {
      // do something
      this._bootstrapAsync();
    });
    this._bootstrapAsync();

    LogBox.ignoreAllLogs();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken) {
      this.fetchData();
    } else {
      this.setState({login: true});
    }
  };

  fetchData = async () => {
    let json = await Api(`/my_wishlist`, 'GET');
    this.setState({data: json, loading: false});
    // setLoading(false);
  };

  render() {
    return (
      <>
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
          <Modal testID={'modal'} isVisible={this.state.open}>
            <View style={styles.content}>
              <ActivityIndicator />
            </View>
          </Modal>
          <View style={{}}>
            <Text style={{fontSize: 20, textAlign: 'center', margin: 20}}>
              My Wishlist
            </Text>
          </View>
          {this.state.login ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
              }}>
              <Image
                source={require('../assets/notlogin.png')}
                style={{width: 210, height: 170}}
              />
              <View
                style={{
                  marginTop: 40,
                  marginRight: 20,
                  marginLeft: 20,
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                <Text style={{fontSize: 32, textAlign: 'center'}}>
                  WISH TO LEARN
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 16,
                    margin: 20,
                    lineHeight: 30,
                  }}>
                  Tag your favorite courses here and learn them when you are
                  ready
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('login')}
                style={{
                  paddingLeft: 20,
                  paddingRight: 20,
                  paddingTop: 10,
                  paddingBottom: 10,
                  backgroundColor: appColor,
                  borderRadius: 11,
                }}>
                <Text style={{color: 'white'}}>Login</Text>
              </TouchableOpacity>
            </View>
          ) : this.state.loading ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={loaderData}
              keyExtractor={(item) => item.toString()}
              renderItem={({item}) => <MyLoader />}
            />
          ) : (
            <FlatList
              // ListHeaderComponent= {

              // }
              data={this.state.data}
              renderItem={({item}) => (
                <this.CourseComponent
                  item={item}
                  onPress={this.onPress}
                  click={this.onPresss}
                />
              )}
              keyExtractor={(item) => item.id}
            />
          )}
        </SafeAreaView>
      </>
    );
  }
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
