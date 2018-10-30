import { combineReducers } from 'redux';
import auth from './auth';
import products from './products';
import GoogleMap from './GoogleMap';
import ShoppingCart from './ShoppingCart';

export default combineReducers({
  auth,
  products,
  GoogleMap,
  ShoppingCart,
});
