import Router from 'next/router';
import { REGISTER, AUTHENTICATE, DEAUTHENTICATE, USER } from '../types';
import { setCookie, removeCookie } from '../../utils/cookie';
// import axios from 'axios';
// import { API } from '../../config';

// register user
const register = ({ email, password, password2 }, type) => {
  if (type !== 'register') {
    throw new Error('Wrong API call!');
  }
  return (dispatch) => {
    axios.post(`${API}/${type}`, {email, password, password2 })
      .then((response) => {
        Router.push('/signin');
        console.log(response.data.meta.message);
      })
      .catch((err) => {
        switch (error.response.status) {
          case 422:
          alert(error.response.data.meta.message);
            break;
          case 401:
          alert(error.response.data.meta.message);
            break;
          case 500:
          alert('Interval server error! Try again!');
            break;
          default:
          alert(error.response.data.meta.message);
            break;
        }
      });
  };
};
// gets token from the api and stores it in the redux store and in cookie
const authenticate = ({ user, token }) => {
  return (dispatch) => {
    setCookie('token', token);
    dispatch({type: AUTHENTICATE, payload: token});
    dispatch({type: USER, payload: user});

    // console.log(email_id)
    // axios.post(`${API}/${type}`, { email_id, password })
    //   .then((response) => {
    //     console.log(response.data.data.user.token);
    //     setCookie('token', response.data.data.user.token);
    //     Router.push('/users');
    //     dispatch({type: AUTHENTICATE, payload: response.data.data.user.token});
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     switch (error.response.status) {
    //       case 422:
    //       alert(error.response.data.meta.message);
    //         break;
    //       case 401:
    //       alert(error.response.data.meta.message);
    //         break;
    //       case 500:
    //       alert('Interval server error! Try again!');
    //         break;
    //       default:
    //       alert(error.response.data.meta.message);
    //         break;
    //     }

    //   });
  };
};

const reauthenticate = (token) => 
  (dispatch) => {
    dispatch({type: AUTHENTICATE, payload: token});
  }

// removing the token
const deauthenticate = () => {
  return (dispatch) => {
    removeCookie('token');
    Router.push('/');
    dispatch({type: DEAUTHENTICATE});
  };
};

const getUser = ({ token }, type) => {
  console.log(token)
  return (dispatch) => {
    axios.get(`${API}/${type}`,{headers: {
      "Authorization" : "bearer " + token
    }
  })
      .then((response) => {
        dispatch({ type: USER, payload: response.data.data.user });
      })
      .catch((error) => {
        switch (error.response.status) {
          case 401:
            Router.push('/');
            break;
          case 422:
            alert(error.response.data.meta.message);
            break;
          case 500:
          alert('Interval server error! Try again!');
          case 503:
          alert(error.response.data.meta.message);
          Router.push('/');
            break;
          default:
          alert(error.response.data.meta.message);
            break;
        }
      });
  };
};

export default {
  register,
  authenticate,
  reauthenticate,
  deauthenticate,
  getUser,
};