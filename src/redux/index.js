import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import cartItems, {
  getAsyncStorage,
  getNotification,
  notificationItems,
} from '../redux/modules/reducers/cartItems';
const rootReducer = combineReducers({cartItems, notificationItems});
const store = createStore(rootReducer, applyMiddleware(thunk));
export default store;

store.dispatch(getAsyncStorage());
store.dispatch(getNotification());
