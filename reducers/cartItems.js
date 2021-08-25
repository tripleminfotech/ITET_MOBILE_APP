import Api from '../components/Api';
import AsyncStorage from '@react-native-community/async-storage';

const initialState = {
  product: [],
  total: 0,
};
const getPrice = (products) => {
  var count = 0;
  products.map((item, index) => {
    count = count + parseInt(item.price);
  });
  return count;
};

const cartItems = (state = initialState, action) => {
  switch (action.type) {
    case 'setInit':
      return {
        product: action.payload,
        total: getPrice(action.payload),
      };
    case 'ADD_TO_CART':
      AsyncStorage.setItem(
        'cart',
        JSON.stringify([...state.product, action.payload]),
      );
      return {
        product: [...state.product, action.payload],
        total: getPrice([...state.product, action.payload]),
      };

    case 'REMOVE_FROM_CART':
      AsyncStorage.setItem(
        'cart',
        JSON.stringify(
          state.product.filter((cartItem) => cartItem.id !== action.payload.id),
        ),
      );
      return {
        product: state.product.filter(
          (cartItem) => cartItem.id !== action.payload.id,
        ),
        total: getPrice(
          state.product.filter((cartItem) => cartItem.id !== action.payload.id),
        ),
      };
    case 'EMPTY_CART':
      AsyncStorage.removeItem('cart');
      return initialState;
  }

  return state;
};

export default cartItems;

export const notificationItems = (state = {}, action) => {
  switch (action.type) {
    case 'GET_NOTIFICATION':
      return {
        notification: action.payload.notification,
        read: action.payload.read,
        unread: action.payload.unread,
      };
    case 'UPDATE_READ':
      let count = state.unread;
      let arr = [];
      for (i = 0; i < state.notification.length; i++) {
        if (
          state.notification[i].id === action.payload &&
          !state.notification[i].read
        ) {
          state.notification[i].read = true;
          count = count - 1;
        }
        arr.push(state.notification[i]);
      }
      // let arr = state.notification.filter(notification => {
      //     if(notification.id === action.payload){
      //         notification.read = true
      //         count = count - 1
      //     }
      // })
      AsyncStorage.setItem('notification', JSON.stringify(arr));
      console.log('array', arr);
      return {
        notification: arr,
        read: true,
        unread: count,
      };
  }

  return state;
};

const setInit = (result) => {
  if (result !== null) {
    return {
      type: 'setInit',
      payload: result,
    };
  } else {
    return false;
  }
};

export const getAsyncStorage = () => {
  return (dispatch) => {
    AsyncStorage.getItem('cart').then((result) => {
      dispatch(setInit(JSON.parse(result)));
    });
  };
};

export const getNotification = () => {
  return async (dispatch) => {
    Api('/notifications', 'GET').then(async (result) => {
      var notiItems = await AsyncStorage.getItem('notification');
      let json = result;
      let local = JSON.parse(notiItems);
      let payload = {};
      let unread = 0;
      if (notiItems !== null) {
        console.log(JSON.parse(notiItems));
        if (JSON.parse(notiItems).length === json.length) {
          for (var i = 0; i < local.length; i++) {
            if (!local[i].read) {
              unread = unread + 1;
            }
          }
          payload.notification = local;
          payload.read = true;
          payload.unread = unread;
        } else {
          var result1 = json;
          var result2 = JSON.parse(notiItems);
          var filteredArray = result1.filter(function (o1) {
            // filter out (!) items in result2
            return !result2.some(function (o2) {
              return o1.id === o2.id; // assumes unique id
            });
          });
          console.log(filteredArray);
          for (var i = 0; i < filteredArray.length; i++) {
            var obj = filteredArray[i];
            obj['read'] = false;
            result2.push(obj);
          }
          for (var i = 0; i < result2.length; i++) {
            if (!result2[i].read) {
              unread = unread + 1;
            }
          }
          payload.read = false;
          payload.unread = unread;
          payload.notification = result2;
          AsyncStorage.setItem('notification', JSON.stringify(result2));
        }
      } else {
        var arr = [];
        for (var i = 0; i < result.length; i++) {
          var obj = result[i];
          obj['read'] = false;
          arr.push(obj);
        }
        payload.read = false;
        payload.unread = result.length;
        payload.notification = arr;
        AsyncStorage.setItem('notification', JSON.stringify(arr));
      }
      dispatch({
        type: 'GET_NOTIFICATION',
        payload: payload,
      });
    });
  };
};
