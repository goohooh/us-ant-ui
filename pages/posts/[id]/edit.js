import Router from 'next/router';
import { useRouter } from 'next/router';
// import { useQuery, useMutation } from '@apollo/react-hooks';
import { useQuery, useMutation } from "react-apollo";
import gql from 'graphql-tag'
import dynamic from 'next/dynamic'
import Layout from '../../../components/Layout';
import Loading from '../../../components/Loading';
import { UPDATE_POST_MUTATION } from "../../../gql/mutations";

const POST = gql`
  query Post($id: String!) {
    post(id: $id) {
      id
      title
      content
      likesCount
      updatedAt
      isPostLiked
      user {
        id
      }
    }
  }
`;

const PostEditor = dynamic(
  () => import('../../../components/PostEditor'),
  { ssr: false }
)

const Create = ({ stock, symbol }) => {
    const router = useRouter();
    const { id } = router.query;
    const { error, loading, data } = useQuery(POST, {
        variables: { id }
    });
    const [updatePost] = useMutation(UPDATE_POST_MUTATION);

    if (loading) return (
        <Layout stock={stock}>
            <Loading />
        </Layout>
    );
    if (error) return <p>Error :(</p>;

    return (
        <Layout stock={stock}>
            <div className="container p-4 ">
                <PostEditor title={data.post.title} content={JSON.parse(data.post.content)} onSubmit={({ title, bodyRaw }) => {
                    updatePost({
                        variables: { postId: id, title, content: JSON.stringify(bodyRaw) }
                    }).then(({ data: { updatePost: { id }}}) => {
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