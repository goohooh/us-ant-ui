import { useRouter } from 'next/router';
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks';
import Layout from '../../components/Layout';
import Posts from '../../components/Posts';
import Comment from '../../components/Comment';
import InputComment from '../../components/InputComment';
import draftToHtml from 'draftjs-to-html';

const POST = gql`
  query Post($id: String!) {
    post(id: $id) {
      id
      title
      content
      likesCount
      updatedAt
      comments {
        edges {
          node {
            id
            text
            updatedAt
            user {
              id
              email
              name
              username
            }
          }
        }
      }
    }
  }
`;

const comments = [
  {
    author: "phil",
    comment: "hi"
  },
  {
    author: "한울햄",
    comment: "Bye"
  }
];

const Post = ({ posts, stock }) => {
  const router = useRouter();
  const { id } = router.query;
  const { loading, error, data } = useQuery(POST, { variables: { id }})
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  const { post: { title, content, updatedAt, comments, likesCount } } = data;

  return (
    <Layout stock={stock}>
      <div className="container p-4">
        <div className="rounded shadow-md">
          <div className="p-2 rounded-t bg-gray-100">
            <h1 className="text-xl text-blue-300">{title}</h1>
          </div>
          <div className="p-2">
            <div className="text-xs flex justify-between mb-2">
              <span className="text-gray-600">Author</span>
              <span className="text-gray-400">{new Date(updatedAt).toDateString()}</span>
            </div>
            <div className="text-md" dangerouslySetInnerHTML={{__html: draftToHtml(JSON.parse(content))}}></div>
          </div>
        </div>
      </div>
      <div className="container p-4 flex justify-center">
        <button className="bg-red-500 hover:bg-red-700 text-white text-xs rounded-full py-1 px-2 mr-2 flex items-center">
          <i className="material-icons text-xs">thumb_up</i>
          <span className="mx-1">가즈아</span>
          <span>{likesCount}</span>
        </button>
      </div>
      <div className="container p-4">
        <h4 className="text-sm">Comments</h4>
        <div className="rounded bg-gray-200 p-2">
          {
            comments.edges.length
              ? comments.edges.map(({ node })=> (<Comment key={node.id} comment={node} />))
              : (<p className="text-center text-gray-600">처음 댓글을 작성해보세요!</p>)
          }
        </div>
        <InputComment />
      </div>
      <Posts posts={posts} />
    </Layout>
  );
};

Post.getInitialProps = async function({ query }) {
    const symbol = query.symbol ? query.symbol : "spy"
    const data = await fetch('https://api.tvmaze.com/search/shows?q=batman').then(res => res.json());
    const stock = await fetch(`https://sandbox.iexapis.com/stable/stock/${symbol}/quote?token=Tsk_c0ece87aef0b4d0691dc3c4e97f49335`)
        .then(res => res.json())
  
    return {
        posts: data.map(entry => entry.show),
        stock,
    };
};

export default Post;