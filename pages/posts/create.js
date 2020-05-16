import Router from 'next/router';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag'
import dynamic from 'next/dynamic'
import Layout from '../../components/Layout';

const CREATE_POST_MUTATION = gql`
  mutation CreatePost($boardId: String!, $title: String!, $content: String!) {
    createPost(boardId: $boardId, title: $title, content: $content) {
        id
    }
  }
`;

const PostEditor = dynamic(
  () => import('../../components/PostEditor'),
  { ssr: false }
)

const Create = ({ stock, symbol }) => {
    const [createPost] = useMutation(CREATE_POST_MUTATION);
    return (
        <Layout stock={stock}>
            <div className="container p-4 ">
                <PostEditor onSubmit={({ title, bodyRaw }) => {
                    createPost({
                        variables: { boardId: "ck9sdu1wl00033i89kigeocd7", title, content: JSON.stringify(bodyRaw) }
                    }).then(({ data: { createPost: { id }}}) => {
                        Router.push(`/posts/${id}?symbol=${symbol}`);
                    })
                }} />
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
        symbol,
    };
};
export default Create;