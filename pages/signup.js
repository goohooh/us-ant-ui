import gql from 'graphql-tag'
import { useMutation } from "react-apollo";
import { useForm } from 'react-hook-form';
import initialize from '../utils/initialize';
import StandAloneLayout from "../components/StandAloneLayout";
import Router from "next/router";

const SIGNUP_MUTATION = gql`
  mutation SignUp($email: String!, $password: String!, $name: String!, $username: String!) {
    signUp(email: $email, password: $password, name: $name, username: $username) {
        token
    }
  }
`;

const Signup = () => {
    const { handleSubmit, register, errors, watch } = useForm();
    const [signup] = useMutation(SIGNUP_MUTATION);
    const onSubmit = ({ name, email, username, password }) => {
        signup({ 
            variables: {
                name, email, username, password
            },
        }).then(({ data }) => {
            if (data.signUp) {
                return Router.push("/", {query: { symbol: "spy" }});
            }
        });
    };

    return (
        <StandAloneLayout>
            <form className="container p-4" onSubmit={handleSubmit(onSubmit)}>
                <h2 className="text-xl font-semibold text-center">회원가입</h2>
                <div className="my-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    이름
                    </label>
                    <input id="name"
                           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                           name="name"
                           type="text"
                           ref={register({
                               required: true,
                           })} />
                </div>
                <div className="my-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    이메일
                    </label>
                    <input id="email"
                           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                           name="email"
                           placeholder="Email" 
                           type="email"
                           ref={register({
                               required: true,
                               pattern: {
                                   value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                               }
                           })} />
                </div>
                <div className="my-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                    비밀번호
                    </label>
                    <input id="password"
                           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                           name="password"
                           type="password"
                           ref={register({
                               required: true,
                           })} />
                </div>
                <div className="my-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password2">
                    비밀번호 확인
                    </label>
                    <input id="password2"
                           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                           name="password2"
                           type="password"
                           ref={register({
                               required: true,
                               validate: value => {
                                   return value === watch("password") || "비밀번호가 일치하지 않습니다.";
                               }
                           })} />
                    {errors.password2 && <p className="mt- 1text-xs text-red-700">{errors.password2.message}</p>}
                </div>
                <div className="my-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                    닉네임
                    </label>
                    <input id="username"
                           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                           name="username"
                           type="text"
                           ref={register({
                               required: true
                           })} />
                </div>
                <div className="flex flex-row-reverse mb-6">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">회원가입</button>
                    {/* <button onClick={(e) => {
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
                    }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">회원가입</button> */}
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