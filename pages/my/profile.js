import { useState, useEffect } from "react";
import { useQuery, useMutation } from "react-apollo";
import StandAloneLayout from "../../components/StandAloneLayout";
import Loading from "../../components/Loading";
import Router, { useRouter } from "next/router";

import { CURRENT_USER } from "../../gql/queries";
import { SIGNUP_MUTATION } from "../../gql/mutations";

export default () => {
    const { query: { symbol = "aapl" } } = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [username, setUsername] = useState("");

    const [signup] = useMutation(SIGNUP_MUTATION);
    const { loading, error, data } = useQuery(CURRENT_USER);

    useEffect(() => {
        if (data && data.currentUser) {
            const { name, email, username } = data.currentUser;
            setName(name);
            setEmail(email);
            setUsername(username);
        }
    }, [data])

    if (loading) return (
        <StandAloneLayout>
            <Loading />
        </StandAloneLayout>
    )
    if (error) return Router.push(`/?symbol=${symbol}`);

    return (
        <StandAloneLayout>
            <form className="container p-4">
                <h2 className="text-xl font-semibold text-center">프로필</h2>
                <div className="my-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    이름
                    </label>
                    <input value={name} onChange={e => setName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" readOnly />
                </div>
                <div className="my-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    이메일
                    </label>
                    <input value={email} onChange={e => setEmail(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" placeholder="Email" type="email" readOnly />
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
                            onCompleted: data => {
                                console.log(data)
                            }
                        });
                    }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">변경</button>
                </div>
            </form>
        </StandAloneLayout>
    );
};