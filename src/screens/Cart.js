import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  AsyncStorage,
  TextInput,
} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import RazorpayCheckout from 'react-native-razorpay';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import Api from '../components/Api';
import Products from '../components/Product';
import {appColor, appName} from '../components/Style';

class CartScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      price: '',
      discounted_price: '0',
      total_price: '0',
      coupon: false,
      loading: false,
    };
  }
  total_amt() {
    if (this.state.discounted_price == '0') {
      this.setState({price: this.props.total});
      console.log('no discount added', this.state.price);
    } else {
      this.setState({price: this.state.discounted_price});
      console.log('discount ', this.state.price);
    }
  }
  onPress = (id) => {
    this.props.navigation.navigate('Course', {id: id});
  };

  _renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => this.onPress(item.id)}
        style={{
          marginLeft: 20,
          marginBottom: 15,
          backgroundColor: 'white',
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
            <Text>₹{item.price}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => this._onPress(item)}>
          <Icon name="close" color={'red'} size={20} style={{marginLeft: 10}} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };
  _onPress(item) {
    this.props.removeItem(item);
    if (this.props.cartItems.length > 1) {
      this._coupon();
    }
  }
  total_cost() {
    if (this.state.discounted_price == '0')
      return (
        <Text style={{fontSize: 20, textAlign: 'right'}}>
          Total: ₹{this.props.total}
        </Text>
      );
    else
      return (
        <Text style={{fontSize: 20, textAlign: 'right'}}>
          Total: ₹{this.state.discounted_price}
        </Text>
      );
  }
  componentDidMount() {
    this.total_amt();
  }

  _coupon() {
    this.applyCoupon();
  }
  async applyCoupon() {
    this.setState({
      loading: true,
    });
    var courses = [];
    this.props.cartItems.map((item) => {
      console.log(item.id);
      courses.push({
        course_id: item.id,
        is_bundle_course: 0,
      });
    });

    let json = await Api('/coupon/apply/', 'POST', {
      coupon: this.state.value,
      courses: courses,
    });
    console.log(json);
    if (json.error) {
      alert(json.message[0]);
      this.setState({
        loading: false,
        value: '',
      });
    } else {
      this.setState({
        discounted_price: json.discounted_price,
        coupon: true,
      });
      this.setState({
        loading: false,
      });
    }
    return json;
  }
  async purchase_course(data) {
    var courses = [];
    this.props.cartItems.map((item) => {
      console.log(item.id);
      courses.push({
        course_id: item.id,
        is_bundle_course: 0,
      });
    });
    let json = await Api('/course_purchase/', 'POST', {
      method: 'razorpay',
      amount_paid: this.state.price,
      payment_id: data.razorpay_payment_id,
      order_id: '132546',
      courses: courses,
    });
    console.log(json);
    return json;
  }
  _onPressButton(emptyCart) {
    var options = {
      description: 'Online Course Payment',
      image:
        'https://itexperttraining.com/wp-content/uploads/2019/09/Website_logo_black.png',
      currency: 'INR',
      key: 'rzp_live_2zcxRkaz0fQuIT',
      amount: this.state.price * 100,
      name: appName,
      prefill: {
        email: '',
        contact: '',
        name: '',
      },
      theme: {color: '#F37254'},
    };
    RazorpayCheckout.open(options)
      .then((data) => {
        // handle success

        console.log(data);
        alert(`Success your payment`);

        this.purchase_course(data);
        emptyCart();
        this.props.navigation.navigate('MyCourses');
      })
      .catch((error) => {
        // handle failure
        console.log(error);
        alert(`your payment was not success`);
      });
  }
  render() {
    return (
      // <View style={styles.container}>
      //     {this.props.cartItems.length > 0 ?
      //         <Products
      //             onPress={this.props.removeItem}
      //             products={this.props.cartItems} />
      //         : <Text>No items in your cart</Text>
      //     }
      // </View>
      <>
        {this.props.cartItems.length > 0 ? (
          <View style={{flex: 1}}>
            <FlatList
              style={{marginTop: 10}}
              data={this.props.cartItems}
              renderItem={({item}) => this._renderItem({item})}
              keyExtractor={(item) => item.id}
            />
            {/* {this._renderItem()} */}
            <View
              style={{
                backgroundColor: 'white',
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
              }}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TextInput
                  style={{
                    height: 40,
                    width: '75%',
                    marginLeft: 10,
                    borderColor: 'gray',
                    borderBottomWidth: 0.5,
                    borderRadius: 15,
                  }}
                  onChangeText={(text) => this.setState({value: text})}
                  value={this.state.value}
                  placeholder="Enter Coupon Code"
                />
                {this.state.loading ? (
                  <View style={{marginRight: 20}}>
                    <ActivityIndicator />
                  </View>
                ) : (
                  <TouchableOpacity
                    disabled={this.state.value.length > 1 ? false : true}
                    onPress={() => this._coupon()}
                    style={{
                      backgroundColor:
                        this.state.value.length > 1 ? appColor : 'gray',
                      padding: 10,
                      marginRight: 10,
                      borderRadius: 15,
                    }}>
                    <Text style={{color: 'white'}}>Apply</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  margin: 15,
                }}>
                <Text style={{fontSize: 20}}>
                  Item ({this.props.cartItems.length})
                </Text>
                <Text style={{fontSize: 20}}>
                  Subtotal: ₹{this.props.total}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'space-between',
                  margin: 10,
                }}>
                {this.total_cost()}
              </View>

              <TouchableOpacity
                style={{
                  marginTop: 10,
                  paddingTop: 15,
                  paddingBottom: 15,
                  marginLeft: 30,
                  marginRight: 30,
                  backgroundColor: appColor,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#fff',
                  marginBottom: 10,
                }}
                activeOpacity={0.5}
                onPress={() => this._onPressButton(this.props.emptyCart)}
                // onPress={() => this.props.addItemToCart(this.state.data)}
              >
                <Text
                  style={{
                    color: '#fff',
                    textAlign: 'center',
                  }}>
                  Checkout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.container}>
            <Text>No items in your cart</Text>
          </View>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartItems.product,
    total: state.cartItems.total,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    removeItem: (product) =>
      dispatch({type: 'REMOVE_FROM_CART', payload: product}),
    emptyCart: () => dispatch({type: 'EMPTY_CART'}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CartScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
