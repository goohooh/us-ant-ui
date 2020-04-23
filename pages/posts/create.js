import Editor from "../../components/editor/editor";
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

const Create = ({ stock }) => {
    const router = useRouter();
    return (
        <Layout stock={stock}>
            <div className="container p-4 ">
                <Editor />
                <div className="mt-3 flex flex-row-reverse">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded shadow-md">글쓰기</button>
                </div>
            </div>
        </Layout>
    );
};

Create.getInitialProps = async function({ query }) {
    const symbol = query.symbol ? query.symbol : "spy"
    const stock = await fetch(`https://sandbox.iexapis.com/stable/stock/${symbol}/quote?token=Tsk_c0ece87aef0b4d0691dc3c4e97f49335`)
        .then(res => res.json())
  
    return {
        stock,
    };
};
export default Create;