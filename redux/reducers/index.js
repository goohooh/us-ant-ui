import { combineReducers } from 'redux';
import authReducer from './authReducer';
import {HYDRATE} from 'next-redux-wrapper';

export default combineReducers({
  authentication: authReducer,
  HYDRATE,
});
