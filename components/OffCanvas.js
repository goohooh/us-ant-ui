import LoginForm from './LoginForm';
import Link from 'next/link';
import Router from "next/router";
import { useDispatch, useSelector } from "react-redux";
// import { useQuery } from '@apollo/react-hooks';
import { useQuery } from "react-apollo";
import actions from "../redux/actions/authActions";
const { deauthenticate, setUser } = actions;
import gql from 'graphql-tag'
import { CURRENT_USER } from "../gql/queries";

export default ({ isMenuOpened, setIsMenuOpened }) => {
    const dispatch = useDispatch();
    const { loading, error, data } = useQuery(CURRENT_USER);
    // if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error :(</p>;
    let user;
    if (data) {
        user = data.currentUser;
        // dispatch(setUser(user));
    }
    return (
        <div className="fixed top-0 w-screen h-screen box-border flex flex-row-reverse" style={{
            left: isMenuOpened ? "0%" : "100%",
            zIndex: 10000,
            backgroundColor: "rgba(0 ,0 ,0, 0.6)"
        }}>
            <div className="fixed top-0 w-4/5 h-screen bg-white p-4 box-border transition duration-300" style={{
                transform: isMenuOpened ? "translateX(0)" : "translateX(100%)",
                zIndex: 10001,
            }}>
                <div className="flex justify-between">
                    <h3>My</h3>
                    <button onClick={() => setIsMenuOpened(false)}><i className="material-icons">close</i></button>
                </div>
                {
                    user
                        ? (
                            <div className="mt-4">
                                <h4 className="text-lg"><span className="font-semibold">{user.username || user.name} 님!</span> 반갑습니다!</h4>
                                <ul className="mt-2">
                                    <li><Link href="/my/profile"><a>프로필</a></Link></li>
                                    <li className="border-t-2 border-gray-200">작성 글 보기</li>
                                    <li className="border-t-2 border-gray-200">작성 댓글 보기</li>
                                </ul>
                                <div className="mt-4">
                                    <button onClick={() => {
                                        dispatch(deauthenticate());
                                        location.href = "/" + location.search;
                                    }}>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )
                        : <LoginForm />
                }
            </div>
        </div>
    );
};