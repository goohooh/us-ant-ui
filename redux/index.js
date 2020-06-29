import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducers';
import {createWrapper } from 'next-redux-wrapper';

const makeStore = context => createStore(reducer);

export const wrapper = createWrapper(makeStore, { debug: false });
