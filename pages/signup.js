import { useState } from "react";
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks';
import { connect } from 'react-redux';
import actions from '../redux/actions';
import initialize from '../utils/initialize';
import StandAloneLayout from "../components/StandAloneLayout";
import { Router } from "next/router";

const SIGNUP_MUTATION = gql`
  mutation SignUp($email: String!, $password: String!, $name: String!, $username: String!) {
    signUp(email: $email, password: $password, name: $name, username: $username) {
        token
    }
  }
`;

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [username, setUsername] = useState("");
    const [signup] = useMutation(SIGNUP_MUTATION);

    return (
        <StandAloneLayout>
            <form className="container p-4">
                <h2 className="text-xl font-semibold text-center">회원가입</h2>
                <div className="my-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    이름
                    </label>
                    <input value={name} onChange={e => setName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" />
                </div>
                <div className="my-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    이메일
                    </label>
                    <input value={email} onChange={e => setEmail(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" placeholder="Email" type="email" />
                </div>
                <div className="my-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                    비밀번호
                    </label>
                    <input value={password} onChange={e => setPassword(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" />
                </div>
                <div className="my-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password2">
                    비밀번호 확인
                    </label>
                    <input value={password2} onChange={e => setPassword2(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password2" type="password" />
                </div>
                <div className="my-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nickname">
                    닉네임
                    </label>
                    <input value={username} onChange={e => setUsername(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="nickname" type="text" />
                </div>
                <div className="flex flex-row-reverse mb-6">
                    <button onClick={(e) => {
                        e.preventDefault();
                        console.log({ name, email, username, password })
                        signup({ 
                            variables: {
                                name, email, username, password
                            },
                            onCompleted: ({ data }) => {
                                if (data.signup) {
                                    Router.push({ path: "/"});
                                }
                            }
                        });
                    }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">회원가입</button>
                </div>
                <div className="my-2 border-t-1 border-solid border-gray-400">
                    {/* <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-4 rounded">Kakao 로그인</button> */}
                    <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded">Facebook 회원가입</button>
                    <button className="w-full mt-2 bg-white hover:bg-gray-300 text-black font-bold py-1 px-4 rounded border-2 border-solid">Google 회원가입</button>
                </div>
            </form>
        </StandAloneLayout>
    );
};

Signup.getInitialProps = initialize;

export default Signup;