import Editor from "../../components/editor/editor";

export default () => (
    <div className="container p-4 ">
        <Editor />
        <div className="mt-3 flex flex-row-reverse">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded shadow-md">글쓰기</button>
        </div>
    </div>
);