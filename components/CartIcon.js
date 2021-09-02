import React from 'react';
import {View, Text, StyleSheet, Platform, TouchableOpacity} from 'react-native';

import {NavigationActions, withNavigation} from 'react-navigation';

import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

function ShoppingCartIcon(props) {
  console.log(props.navigation);
  return (
    <View style={[{padding: 5}, styles.iconContainer]}>
      <View
        style={{
          position: 'absolute',
          height: 30,
          width: 30,
          borderRadius: 15,
          backgroundColor: 'rgba(95,197,123,0.8)',
          right: 15,
          bottom: 15,
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
        }}>
        <Text style={{color: 'white', fontWeight: 'bold'}}>
          {props.cartItems.length}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => props.navigation.navigate('Cart')}
        style={{flexDirection: 'row-reverse'}}>
        <Icon name="ios-cart" size={30} />
      </TouchableOpacity>
    </View>
  );
}
const mapStateToProps = (state) => {
  return {
    cartItems: state.cartItems.product,
  };
};

export default connect(mapStateToProps)(ShoppingCartIcon);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    paddingLeft: 20,
    paddingTop: 10,
    marginRight: 5,
  },
});
