import Link from "next/link";
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { GoogleLogin } from 'react-google-login';
import { useState } from "react";
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks';
import { useDispatch } from "react-redux";
import Router, { useRouter } from "next/router";
import actions from "../redux/actions/authActions";

const { authenticate } = actions;

const SIGNIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
        token
        user {
            id
            email
            name
            username
        }
    }
  }
`;
const SIGNIN_GOOGLE_MUTATION = gql`
  mutation GoogleLogin($accessToken: String!) {
    loginByGoogle(accessToken: $accessToken) {
        token
        user {
            email
            name
            username
        }
    }
  }
`;
const SIGNIN_FACEBOOK_MUTATION = gql`
  mutation FacebookLogin($accessToken: String!) {
    loginByFacebook(accessToken: $accessToken) {
        token
        user {
            email
            name
            username
        }
    }
  }
`;

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [signin] = useMutation(SIGNIN_MUTATION)
    const [signinFacebook] = useMutation(SIGNIN_FACEBOOK_MUTATION);
    const [signinGoogle] = useMutation(SIGNIN_GOOGLE_MUTATION)
    const dispatch = useDispatch()
    const router = useRouter();

    return (
        <form className="mt-4" onSubmit={e => {
            e.preventDefault();
            signin({
                variables: {
                    email, password
                }
            }).then(({ data: { login } }) => {
                if (login) {
                    const { user, token } = login;
                    dispatch(authenticate({ user, token }));
                    location.reload()
                }
            });
        }}>
            <div className="mb-4">
                <input 
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="ID" type="text" />
            </div>
            <div>
                <input
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" placeholder="Password" type="password" />
            </div>
            <div className="flex flex-row-reverse mb-6">
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
                >
                    로그인
                </button>
            </div>
            <div onSubmit={e => e.stopPropagation()}>
                {/* <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-4 rounded">Kakao 로그인</button> */}
                <FacebookLogin
                    appId="679383572879991"
                    scope="public_profile, email, user_birthday"
                    fields="name,email,picture"
                    callback={res => {
                        signinFacebook({
                            variables: {
                                accessToken: res.accessToken,
                            }
                        }).then(({ data: { loginByFacebook } }) => {
                            if (loginByFacebook) {
                                const { user, token } = loginByFacebook;
                                console.log(user, token)
                                dispatch(authenticate({ user, token }));
                                setTimeout(() => {
                                    location.reload()
                                })
                            }
                        });
                    }}
                    render={renderProps => (
                        <button onClick={renderProps.onClick} className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded">Facebook 로그인</button>
                    )}
                >
                </FacebookLogin>
                <GoogleLogin
                    clientId="442746769520-g6n8moi3icorcndgd5b246c6d20g0sh7.apps.googleusercontent.com"
                    render={renderProps => (
                        <button onClick={renderProps.onClick} disabled={renderProps.disabled} className="w-full mt-2 bg-white hover:bg-gray-300 text-black font-bold py-1 px-4 rounded border-2 border-solid">Google 로그인</button>
                    )}
                    onSuccess={res => {
                        signinGoogle({
                            variables: {
                                accessToken: res.accessToken,
                            }
                        }).then(({ data: { loginByGoogle } }) => {
                            if (loginByGoogle) {
                                const { user, token } = loginByGoogle;
                                dispatch(authenticate({ user, token }));
                                setTimeout(() => {
                                    location.reload()
                                })
                            }
                        });
                    }}
                    onFailure={res => console.error(res)}
                    cookiePolicy={'single_host_origin'}
                />
            </div>
            <div className="border-t-1 border-solid border-gray-400 mt-3">
                <Link href={`/signup`}>
                    <a className="block w-full mt-3 bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white text-center py-1 border border-green-500 hover:border-transparent rounded">
                    회원가입 
                    </a>
                </Link>
            </div>
        </form>
    );
};

export default LoginForm;