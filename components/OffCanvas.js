import LoginForm from './LoginForm';
import Link from 'next/link';
import { useDispatch } from "react-redux";
import actions from "../redux/actions/authActions";

const { deauthenticate } = actions;

export default ({ isMenuOpened, setIsMenuOpened }) => {
    const dispatch = useDispatch();
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
                <LoginForm />
                <div className="mt-4">
                    <ul>
                        <li><Link href="/my/profile">프로필</Link></li>
                        <li className="border-t-2 border-gray-200">작성 글 보기</li>
                        <li className="border-t-2 border-gray-200">작성 댓글 보기</li>
                    </ul>
                </div>
                <div className="mt-4">
                    <button onClick={() => dispatch(deauthenticate())}>Logout</button>
                </div>
            </div>
        </div>
    );
};