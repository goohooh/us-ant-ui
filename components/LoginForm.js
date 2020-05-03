import Link from "next/link";
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { GoogleLogin } from 'react-google-login';

export default () => (
    <form className="mt-4">
        <div className="mb-4">
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="ID" type="text" />
        </div>
        <div>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" placeholder="Password" type="password" />
        </div>
        <div className="flex flex-row-reverse mb-6">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded">로그인</button>
        </div>
        <div>
            {/* <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-4 rounded">Kakao 로그인</button> */}
            <FacebookLogin
                appId="679383572879991"
                scope="public_profile, email, user_birthday"
                fields="name,email,picture"
                callback={res => console.log(res)}
                render={renderProps => (
                    <button onClick={renderProps.onClick} className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded">Facebook 로그인</button>
                )}
            >
            </FacebookLogin>
            <GoogleLogin
                clientId="1023454076344-hvsh97fa04joa1edkp3416qs50vhuqe9.apps.googleusercontent.com"
                render={renderProps => (
                    <button onClick={renderProps.onClick} disabled={renderProps.disabled} className="w-full mt-2 bg-white hover:bg-gray-300 text-black font-bold py-1 px-4 rounded border-2 border-solid">Google 로그인</button>
                )}
                buttonText="Login"
                onSuccess={res => console.log(res)}
                onFailure={res => console.error(res)}
                cookiePolicy={'single_host_origin'}
            />
        </div>
        <div className="border-t-1 border-solid border-gray-400 mt-3">
            <Link href={`/signup`}>
                <button className="w-full mt-3 bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-1 border border-green-500 hover:border-transparent rounded">
                회원가입 
                </button>
            </Link>
        </div>
    </form>
);