import { useRouter } from 'next/router';
import dynamic from 'next/dynamic'
import Layout from '../../components/Layout';

const PostEditor = dynamic(
  () => import('../../components/PostEditor'),
  { ssr: false }
)

const Create = ({ stock }) => {
    const router = useRouter();
    return (
        <Layout stock={stock}>
            <div className="container p-4 ">
                <PostEditor onSubmit={({ title, body }) => {console.log({ title, body })}} />
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