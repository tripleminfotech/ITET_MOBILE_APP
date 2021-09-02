import React, {Component, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
  Button,
  TouchableOpacity,
  AsyncStorage,
  Alert,
} from 'react-native';
import ReadMore from '@fawazahmed/react-native-read-more';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Api from '../../components/Api';
import {ActivityIndicator} from 'react-native-paper';
import {connect} from 'react-redux';
import Modal from 'react-native-modal';
import Toast from 'react-native-simple-toast';
import {appColor} from '../../components/Style';
import {loaderData, MyLoader, MyLoader1} from '../../components/MyLoaders';
import Star from 'react-native-star-view/lib/Star';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height / 2;

class Course extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    data: [],
    loading: true,
    modify: '',
    cart: false,
    free: false,
    purchased: false,
    modalLoading: false,
  };
  fetchData = async () => {
    this.setState({cart: false});
    let json = await Api(`/course/${this.props.route.params.id}`, 'GET');
    // setData(json[0])
    for (var i = 0; i < this.props.cartItems.length; i++) {
      if (this.props.cartItems[i].id === this.props.route.params.id) {
        this.setState({
          cart: true,
        });
        console.log(this.props.cartItems[i].id);
        break;
      }
    }
    this.setState({
      data: json[0],
    });
    var today = new Date(json[0].last_modified * 1000);
    this.setState({
      modify: today.toDateString(),
      loading: false,
    });
    // setModify(today.toDateString());
    // setLoading(false);
    if (json[0].is_purchased) {
      this.setState({purchased: true});
      // this.props.navigation.navigate('StartCourse',{screen:"StartCourse",params:{id:json[0].id}})
    }
    if (json[0].is_free_course === '1' || json[0].price === '0') {
      this.setState({
        free: true,
      });
    }
  };

  componentDidMount() {
    this.setState({
      loading: true,
    });
    this.props.navigation.addListener('focus', () => {
      this.setState({
        loading: true,
      });
      this.fetchData();
    });
    this.fetchData();
  }
  freeCourse = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken) {
      let json = await Api('/course_purchase/', 'POST', {
        method: 'razorpay',
        amount_paid: '0',
        payment_id: 'data.razorpay_payment_id',
        order_id: '132546',
        courses: [
          {
            course_id: this.props.route.params.id.toString(),
            is_bundle_course: 0,
          },
        ],
      });
      this.props.navigation.navigate('StartCourse', {
        screen: 'StartCourse',
        params: {id: this.props.route.params.id},
      });
      return json;
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
          {
            text: 'Sign in',
            onPress: () => this.props.navigation.navigate('login'),
          },
        ],
        {cancelable: false},
      );
    }
  };
  onPresss = async (product) => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken) {
      this.props.addItemToCart(product);
      this.setState({
        cart: true,
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
          {
            text: 'Sign in',
            onPress: () => this.props.navigation.navigate('login'),
          },
        ],
        {cancelable: false},
      );
    }
  };
  // onPress = (id) =>{
  //       this.props.navigation.navigate('Course',{'id':id})
  //   }
  onPress = async (id) => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken) {
      this.setState({
        modalLoading: true,
      });
      let json = await Api('/toggle_wishlist', 'POST', {courseId: id});
      this.fetchData();
      this.setState({
        modalLoading: false,
      });
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
          {
            text: 'Sign in',
            onPress: () => this.props.navigation.navigate('login'),
          },
        ],
        {cancelable: false},
      );
    }
  };
  render() {
    const {data, modify} = this.state;
    return (
      <>
        {this.state.loading ? (
          <View style={{marginTop: 10}}>
            <MyLoader1 />
            <FlatList
              data={loaderData}
              keyExtractor={(item) => item.toString()}
              renderItem={({item}) => <MyLoader />}
            />
          </View>
        ) : (
          <>
            <Modal testID={'modal'} isVisible={this.state.modalLoading}>
              <View style={styles.content}>
                <ActivityIndicator />
              </View>
            </Modal>
            <ScrollView
              style={{backgroundColor: 'white'}}
              nestedScrollEnabled={true}>
              <Image
                source={{uri: this.state.data.thumbnail}}
                style={{height: 250, width: null, resizeMode: 'cover'}}
              />
              <View style={{padding: 20, backgroundColor: '#312F2F'}}>
                <Text
                  style={{
                    fontSize: 22,
                    color: '#fff',
                    lineHeight: 35,
                  }}>
                  {data.title}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: '#fff',
                    width: 312,
                    textAlign: 'justify',
                  }}>
                  {data.short_description}
                </Text>
                <Text style={{fontSize: 15, color: '#fff', lineHeight: 30}}>
                  Created by{' '}
                  <Text style={{fontWeight: '700'}}>
                    {data.instructor_name}
                  </Text>
                </Text>
                <Text style={{fontSize: 15, color: '#fff', lineHeight: 30}}>
                  {data.total_enrollment} Students enrolled
                </Text>
                <Text style={{fontSize: 15, color: '#fff', lineHeight: 30}}>
                  {data.language}
                </Text>
                <Text style={{fontSize: 15, color: '#fff', lineHeight: 30}}>
                  Last Updated: {modify}
                </Text>
                <Text style={{fontSize: 22, color: '#F7B500', lineHeight: 30}}>
                  Price {data.price !== 'Free' ? `₹${data.price}` : data.price}
                </Text>
              </View>
              <View style={{padding: 20}}>
                <Text style={{fontSize: 22}}>Description</Text>
                <ReadMore
                  style={{
                    textAlign: 'justify',
                  }}>{`${data.description_formatted}`}</ReadMore>
                <View style={{paddingTop: 10}}>
                  <Text style={{fontSize: 15, color: '#8F9BB3', marginTop: 10}}>
                    This course includes
                  </Text>
                  <FlatList
                    data={data.includes}
                    renderItem={({item}) => (
                      <Text
                        style={{
                          fontSize: 15,
                          color: '#8F9BB3',
                          marginTop: 10,
                          textAlign: 'justify',
                        }}>
                        {item}
                      </Text>
                    )}
                    keyExtractor={(item) => item}
                  />
                </View>
              </View>
              {/* <Text style={{marginLeft:20,marginBottom:10,fontSize:20}}>You'll Get</Text>
        <View style={{marginLeft:15}}>
          
          <FlatList
          data={JSON.parse(data.requirements)}
          renderItem={({ item }) =><View style={{flexDirection:"row",alignItems:"center",marginBottom:10}}>
                                      <Icon name="text-box-plus-outline" size={30} color={appColor}/>
                                    
                                      <Text style={{fontSize:15,marginLeft:10,width:"85%"}}>{item}</Text>
                                  </View>}
          keyExtractor={item => item}
        />
          
          </View> */}

              <Text style={{marginBottom: 10, marginLeft: 20, fontSize: 20}}>
                Who this course is for:
              </Text>
              <View style={{marginLeft: 15}}>
                <FlatList
                  data={this.state.data.who_can_learn}
                  renderItem={({item}) => (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                      }}>
                      <Icon name="teach" size={30} color={appColor} />

                      <Text
                        style={{
                          fontSize: 15,
                          marginLeft: 10,
                          width: '85%',
                          textAlign: 'justify',
                        }}>
                        {item}
                      </Text>
                    </View>
                  )}
                  keyExtractor={(item) => item}
                />
              </View>

              <Text style={{marginBottom: 10, marginLeft: 20, fontSize: 20}}>
                You'll Learn
              </Text>
              <View style={{marginLeft: 15}}>
                <FlatList
                  data={data.what_you_learn}
                  renderItem={({item}) => (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                      }}>
                      <Icon
                        name="head-check-outline"
                        size={30}
                        color={appColor}
                      />

                      <Text
                        style={{
                          fontSize: 15,
                          marginLeft: 10,
                          width: '85%',
                          textAlign: 'justify',
                        }}>
                        {item}
                      </Text>
                    </View>
                  )}
                  keyExtractor={(item) => item}
                />
              </View>
              <View style={{margin: 20}}>
                <Text style={{fontSize: 20}}>Review & Ratings</Text>
                <Text
                  style={{
                    fontSize: 30,
                    marginHorizontal: 10,
                    marginTop: 10,
                    textAlign: 'justify',
                  }}>
                  {parseFloat(data.rating).toFixed(1)}
                </Text>
                <Star
                  score={parseFloat(data.rating).toFixed(1)}
                  style={{marginHorizontal: 10}}
                />
              </View>
              <ScrollView style={{height: 300}} nestedScrollEnabled={true}>
                <View>
                  <FlatList
                    data={data.reviews}
                    renderItem={({item}) => (
                      <View
                        style={{
                          flexDirection: 'row',
                          backgroundColor: '#F4F4F4',
                          padding: 15,
                          borderRadius: 15,
                          marginLeft: 20,
                          marginRight: 20,
                          marginBottom: 10,
                          alignItems: 'center',
                        }}>
                        {/* <View>
                              <Image source={require('../Rectangle.png')} width={32} height={32} />
                              </View> */}
                        <View style={{marginLeft: 10}}>
                          <Text>{item.first_name}</Text>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            {/* <Image source={require('../star.png')} /> */}
                            <Text
                              style={{
                                color: '#8F9BB3',
                                fontSize: 13,
                                marginRight: 5,
                                textAlign: 'justify',
                              }}>
                              {parseFloat(item.rating).toFixed(1)}
                            </Text>
                            <Star
                              score={
                                isNaN(parseFloat(item.rating).toFixed(1))
                                  ? 0
                                  : parseFloat(item.rating).toFixed(1)
                              }
                              style={{height: 18, width: 70}}
                            />
                          </View>
                          <Text
                            style={{
                              color: '#8F9BB3',
                              fontSize: 15,
                              textAlign: 'justify',
                            }}>
                            {item.review}
                          </Text>
                        </View>
                      </View>
                    )}
                    keyExtractor={(item) => item.id}
                  />
                </View>
              </ScrollView>

              {/* <View style={{flexDirection:"row",justifyContent:"space-between",margin:20,alignItems:"center"}}>
          <Text style={{fontSize:20}}>Similar Courses</Text>
          <Text style={{color:appColor}}>show all >></Text>
        </View> */}
              {/* <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
    >
        <FlatList
        numColumns={2}
        showsHorizontalScrollIndicator ={false}
          data={data1}
          renderItem={({ item }) =><PopularCourse item={item} onPress={this.onPress} />}
          keyExtractor={item => item.id}
        />
      </ScrollView> */}
            </ScrollView>
            <View
              style={{
                backgroundColor: 'white',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              {this.state.purchased ? (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('StartCourse', {
                      screen: 'StartCourse',
                      params: {id: this.state.data.id},
                    })
                  }
                  style={{
                    padding: 15,
                    backgroundColor: appColor,
                    margin: 10,
                    borderRadius: 15,
                    flex: 1,
                  }}>
                  <Text
                    style={{color: 'white', fontSize: 20, textAlign: 'center'}}>
                    Go To Course
                  </Text>
                </TouchableOpacity>
              ) : this.state.cart ? (
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Cart')}
                  style={{
                    padding: 15,
                    backgroundColor: appColor,
                    margin: 10,
                    borderRadius: 15,
                    flex: 1,
                  }}>
                  <Text
                    style={{color: 'white', fontSize: 20, textAlign: 'center'}}>
                    Go To Cart
                  </Text>
                </TouchableOpacity>
              ) : this.state.free ? (
                <TouchableOpacity
                  onPress={() => this.freeCourse()}
                  style={{
                    padding: 15,
                    backgroundColor: appColor,
                    margin: 10,
                    borderRadius: 15,
                    flex: 1,
                  }}>
                  <Text
                    style={{color: 'white', fontSize: 20, textAlign: 'center'}}>
                    Join This Course
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => this.onPresss(this.state.data)}
                  style={{
                    padding: 15,
                    backgroundColor: appColor,
                    margin: 10,
                    borderRadius: 15,
                    flex: 1,
                  }}>
                  <Text
                    style={{color: 'white', fontSize: 20, textAlign: 'center'}}>
                    Add To Cart
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => this.onPress(this.state.data.id)}
                style={{padding: 10}}>
                <Icon
                  name={
                    this.state.data.is_wishlisted ? 'heart' : 'heart-outline'
                  }
                  size={50}
                  color="red"
                />
              </TouchableOpacity>
              {/* <TouchableOpacity
            style={styles.SubmitButtonStyle}
            activeOpacity = { .5 }
            // onPress={ _onPressButton }
            onPress={() => this.props.addItemToCart(this.state.data)}
        >
              <Text style={styles.TextStyle}> Buy Now </Text>
              
        </TouchableOpacity>
        <TouchableOpacity
            style={styles.SubmitButtonStyle}
            activeOpacity = { .5 }
            // onPress={ _onPressButton }
            onPress={() => this.props.addItemToCart(this.state.data)}
        >
              <Text style={styles.TextStyle}> add to cart </Text>
              
        </TouchableOpacity> */}
            </View>
          </>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartItems.product,
    total: state.total,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    addItemToCart: (product) =>
      dispatch({type: 'ADD_TO_CART', payload: product}),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Course);
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },

  SubmitButtonStyle: {
    marginTop: 10,
    paddingTop: 15,
    paddingBottom: 15,
    marginLeft: 30,
    marginRight: 30,
    backgroundColor: '#0095FF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },

  TextStyle: {
    color: '#fff',
    textAlign: 'center',
  },
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
