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
  AsyncStorage,
  FlatList,
  LogBox,
  SafeAreaView,
} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Api from '../../components/Api';
import CircularProgress from '../../components/CircularProgress';
import {loaderData, MyLoader} from '../../components/MyLoaders';
import {appColor} from '../../components/Style';

const {width, height} = Dimensions.get('window');

export default class MyCourses extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    active: 0,
    xTabOne: 0,
    xTabTwo: 0,
    translateX: new Animated.Value(0),
    translateXTabOne: new Animated.Value(0),
    translateXTabTwo: new Animated.Value(width),
    translateY: -1000,
    data: [],
    completed: [],
    not: [],
    loading: true,
    login: false,
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
    // this.setState({loading:true})
    let json = await Api(`/my_courses`, 'GET');
    const userId = await AsyncStorage.getItem('UserId');

    this.setState({data: json, loading: false});
    let arr1 = [];
    let arr2 = [];
    await json.map((item) => {
      if (item.completion === 100) {
        let d = item;
        d.review = false;
        for (var i = 0; i < d.reviews; i++) {
          if (d.reviews[i].uid === userId) {
            d.review = true;
            break;
          }
        }
        // item.reviews.map(i =>{
        //     if(i.uid === userId){
        //         d.review = true;
        //         break
        //     }
        // })
        // this.setState({
        //     completed:[...this.state.completed,d]
        // })
        arr1.push(d);
      } else {
        // this.setState({
        //     not:[...this.state.not,item]
        // })
        arr2.push(item);
      }
    });
    this.setState({
      not: arr2,
      completed: arr1,
    });
    // setLoading(false);
  };

  pastCourses = (item) => {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('StartCourse', {
            screen: 'StartCourse',
            params: {id: item.id},
          })
        }
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          margin: 10,
          padding: 10,
          height: 100,
          alignItems: 'center',
          borderRadius: 8,
          backgroundColor: 'white',
          shadowOffset: {
            width: 0,
            height: 11,
          },
          shadowOpacity: 0.57,
          shadowRadius: 15.19,
          elevation: 3,
        }}>
        <View>
          <Image
            source={{uri: item.thumbnail}}
            style={{width: 50, height: 50}}
          />
        </View>
        <View style={{marginLeft: 15, width: 150}}>
          <Text style={{fontSize: 15, marginBottom: 5}}>{item.title}</Text>
          <Text style={{fontSize: 12}}>{item.instructor_name}</Text>
        </View>
        <TouchableOpacity
          disabled={item.is_reviewed === 1}
          onPress={() =>
            this.props.navigation.navigate('review', {
              id: item.id,
              name: item.title,
              image: item.thumbnail,
            })
          }
          style={{
            backgroundColor: appColor,
            borderRadius: 10,
            padding: 10,
            marginRight: 10,
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{marginTop: 5, color: 'white', textAlign: 'center'}}>
            {item.is_reviewed === 1 ? 'Goto Course' : 'review'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };
  onGoingcourses = (item) => {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('StartCourse', {
            screen: 'StartCourse',
            params: {id: item.id},
          })
        }
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          margin: 10,
          padding: 10,
          height: 100,
          alignItems: 'center',
          borderRadius: 8,
          backgroundColor: 'white',
          shadowOffset: {
            width: 0,
            height: 11,
          },
          shadowOpacity: 0.57,
          shadowRadius: 15.19,
          elevation: 3,
        }}>
        <View>
          <Image
            source={{uri: item.thumbnail}}
            style={{width: 50, height: 50}}
          />
        </View>
        <View>
          <Text style={{width: 200, fontSize: 15, marginBottom: 10}}>
            {item.title}
          </Text>
          <Text style={{fontSize: 12}}>{item.instructor_name}</Text>
        </View>
        <View>
          <CircularProgress
            size={50}
            strokeWidth={5}
            pgColor={appColor}
            bgColor="#EEEEEE"
            textSize="13"
            text={item.completion}
            progressPercent={item.completion}
          />
        </View>
      </TouchableOpacity>
    );
  };
  handleSlide = (type) => {
    let {
      active,
      xTabOne,
      xTabTwo,
      translateX,
      translateXTabOne,
      translateXTabTwo,
    } = this.state;
    Animated.spring(translateX, {
      toValue: type,
      duration: 100,
      useNativeDriver: true,
    }).start();
    if (active === 0) {
      Animated.parallel([
        Animated.spring(translateXTabOne, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }).start(),
        Animated.spring(translateXTabTwo, {
          toValue: width,
          duration: 100,
          useNativeDriver: true,
        }).start(),
      ]);
    } else {
      Animated.parallel([
        Animated.spring(translateXTabOne, {
          toValue: -width,
          duration: 100,
          useNativeDriver: true,
        }).start(),
        Animated.spring(translateXTabTwo, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }).start(),
      ]);
    }
  };

  render() {
    let {
      xTabOne,
      xTabTwo,
      translateX,
      active,
      translateXTabOne,
      translateXTabTwo,
      translateY,
    } = this.state;
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <Text style={{textAlign: 'center', marginTop: 20, fontSize: 20}}>
          My Courses
        </Text>
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
                TIME TO LEARN
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  margin: 20,
                  lineHeight: 30,
                }}>
                Hey Pro Learner, It's not too late..!!! Let's start learning the
                niche technologies in IT industry from experts.
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
        ) : (
          <View
            style={{
              width: '90%',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 20,
                marginBottom: 20,
                height: 36,
                position: 'relative',
              }}>
              <Animated.View
                style={{
                  position: 'absolute',
                  width: '50%',
                  height: '100%',
                  top: 0,
                  left: 0,
                  backgroundColor: appColor,
                  borderRadius: 4,
                  transform: [
                    {
                      translateX,
                    },
                  ],
                }}
              />
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: appColor,
                  borderRadius: 4,
                  borderRightWidth: 0,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                }}
                onLayout={(event) =>
                  this.setState({
                    xTabOne: event.nativeEvent.layout.x,
                  })
                }
                onPress={() =>
                  this.setState({active: 0}, () => this.handleSlide(xTabOne))
                }>
                <Text
                  style={{
                    color: active === 0 ? '#fff' : appColor,
                  }}>
                  Ongoing
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: appColor,
                  borderRadius: 4,
                  borderLeftWidth: 0,
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                }}
                onLayout={(event) =>
                  this.setState({
                    xTabTwo: event.nativeEvent.layout.x,
                  })
                }
                onPress={() =>
                  this.setState({active: 1}, () => this.handleSlide(xTabTwo))
                }>
                <Text
                  style={{
                    color: active === 1 ? '#fff' : appColor,
                  }}>
                  Completed
                </Text>
              </TouchableOpacity>
            </View>

            <Animated.View
              style={{
                // justifyContent: "center",
                // alignItems: "center",
                height: height - 150,
                transform: [
                  {
                    translateX: translateXTabOne,
                  },
                ],
              }}
              onLayout={(event) =>
                this.setState({
                  translateY: event.nativeEvent.layout.height,
                })
              }>
              {/* ongoing courses */}
              {this.state.loading ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={loaderData}
                    keyExtractor={(item) => item.toString()}
                    renderItem={({item}) => <MyLoader />}
                  />
                </View>
              ) : (
                <SafeAreaView>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    style={{marginBottom: 40}}
                    data={this.state.not}
                    renderItem={({item}) => this.onGoingcourses(item)}
                    keyExtractor={(item) => item.id}
                  />
                </SafeAreaView>
              )}
            </Animated.View>

            <Animated.View
              style={{
                height: height - 150,
                // justifyContent: "center",
                // alignItems: "center",
                transform: [
                  {
                    translateX: translateXTabTwo,
                  },
                  {
                    translateY: -translateY,
                  },
                ],
              }}>
              {/* past courses */}
              {this.state.loading ? (
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={loaderData}
                  keyExtractor={(item) => item.toString()}
                  renderItem={({item}) => <MyLoader />}
                />
              ) : (
                <SafeAreaView>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    style={{marginBottom: 40}}
                    data={this.state.completed}
                    renderItem={({item}) => this.pastCourses(item)}
                    keyExtractor={(item) => item.id}
                  />
                </SafeAreaView>
              )}
            </Animated.View>
          </View>
        )}
      </View>
    );
  }
}
