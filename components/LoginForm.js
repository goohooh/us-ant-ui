export default () => (
    <form className="mt-2">
        <div className="mb-4">
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" />
        </div>
        <div>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" type="password" />
        </div>
        <div className="flex flex-row-reverse">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded">Login</button>
        </div>
    </form>
);