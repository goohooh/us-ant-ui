import Router from 'next/router';
import { useQuery, useMutation } from '@apollo/react-hooks';
import dynamic from 'next/dynamic'
import Layout from '../../components/Layout';
import Loading from '../../components/Loading';
import { PRODUCTS } from "../../gql/queries";
import { CREATE_POST_MUTATION } from "../../gql/mutations";

const PostEditor = dynamic(
  () => import('../../components/PostEditor'),
  { ssr: false }
)

const Create = ({ stock, symbol }) => {
    const { data, loading, error } = useQuery(PRODUCTS, {
        variables: {
            term: symbol
        }
    });
    const skip = products === undefined;
    if (loading) return <Loading />
    const boardId = data && data.length ? data.products[0].board.id : "ck9sdu1wl00033i89kigeocd7";
    const [createPost] = useMutation(CREATE_POST_MUTATION);
    return (
        <Layout stock={stock}>
            <div className="container p-4 ">
                <PostEditor onSubmit={({ title, bodyRaw }) => {
                    createPost({
                        variables: { boardId, title, content: JSON.stringify(bodyRaw) }
                    }).then(({ data: { createPost: { id }}}) => {
                        Router.push(`/posts/${id}?symbol=${symbol}`);
                    })
                }} />
            </div>
        </Layout>
    );
};

Create.getInitialProps = async function({ query }) {
    const symbol = query.symbol ? query.symbol : "aapl"
    const stock = await fetch(`https://sandbox.iexapis.com/stable/stock/${symbol}/quote?token=Tsk_c0ece87aef0b4d0691dc3c4e97f49335`)
        .then(res => res.json())
  
    return {
        stock,
        symbol,
    };
};
export default Create;