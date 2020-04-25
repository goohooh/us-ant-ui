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
            <button className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded">Facebook 로그인</button>
            <button className="w-full mt-2 bg-white hover:bg-gray-300 text-black font-bold py-1 px-4 rounded border-2 border-solid">Google 로그인</button>
        </div>
    </form>
);