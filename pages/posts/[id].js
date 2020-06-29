import { useRouter } from 'next/router';
// import { useQuery, useMutation } from '@apollo/react-hooks';
import { useQuery, useMutation } from "react-apollo";
import Layout from '../../components/Layout';
import PostList from '../../components/PostList';
import Comment from '../../components/Comment';
import Loading from '../../components/Loading';
import draftToHtml from 'draftjs-to-html';
import Link from "next/link";

import { CURRENT_USER, POST } from "../../gql/queries";
import { TOGGLE_POST_LIKE } from "../../gql/mutations";

const updateLike = (query, variables) => (cache, comment) => {
  const { post } = cache.readQuery({ query, variables })
  const comments = { ...post.comments };
  const edges = [...post.comments.edges];
  const targetComment = edges.find(({ node: { id }}) => id === comment.id);
  const targetCommentIndex = edges.findIndex(({ node: { id }}) => id === comment.id);
  const isCommentLiked = !targetComment.node.isCommentLiked;
  const CommentlikesCount = targetComment.node.CommentlikesCount + (isCommentLiked ? 1 : -1);
  const newComment = {
      ...targetComment,
      node: {
          ...targetComment.node,
          isCommentLiked,
          CommentlikesCount,
      }
  }
  edges.splice(targetCommentIndex, 1, newComment)
  
  cache.writeQuery({
      query: POST,
      data: { post: { ...post, comments: { ...comments, edges } } },
  });
};

const Post = ({ stock, symbol }) => {
  const router = useRouter();
  const { id } = router.query;
  const variables = { id };
  const { loading, error, data } = useQuery(POST, { variables})
  const { cloading, cerror, data: currentUser } = useQuery(CURRENT_USER);
  const [toggleLike] = useMutation(TOGGLE_POST_LIKE, {
    update(cache, { data: { togglePostLike } }) {
      if (togglePostLike) {
        const { post } = cache.readQuery({ query: POST, variables: { id } });
        const isPostLiked = !post.isPostLiked;
        const likesCount = post.likesCount + (isPostLiked ? 1 : -1);
        cache.writeQuery({
          query: POST,
          data: { post: { ...post, isPostLiked, likesCount, } },
        });
      }
    }
  })
  if (loading || cloading) return (
    <Layout stock={stock}>
      <Loading />;
    </Layout>
  );

  if (error || cerror) return <p>Error :(</p>;
  const { post: { title, content, updatedAt, comments, likesCount, isPostLiked, user } } = data;

  return (
    <Layout stock={stock}>
      <div className="container p-4">
        <div className="rounded shadow-md">
          <div className="flex justify-between p-2 rounded-t bg-gray-100">
            <h1 className="text-xl text-blue-300">{title}</h1>
            {
              currentUser && currentUser.currentUser.id === user.id
                ? (
                  <Link href="/posts/[id]/edit" as={`/posts/${id}/edit?symbol=${symbol}`}>
                    <a className="bg-transparent text-gray-500 text-xs">글 수정</a>
                  </Link>
                  )
                : null
            }
            
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
        <button 
          onClick={() => {
            if (!currentUser) return;
            toggleLike({
              variables: {
                postId: id
              }
            });
          } }
          className={`bg-red-500 hover:bg-red-700 text-white text-xs rounded-full py-1 px-2 mr-2 flex items-center ${isPostLiked ? "bg-red-700" : ""}`}>
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
              ? comments.edges.map(({ node })=> (<Comment key={node.id} comment={node} updateLike={updateLike(POST, variables)} />))
              : (<p className="text-center text-gray-600">처음 댓글을 작성해보세요!</p>)
          }
        </div>
        {
          currentUser && (
             <div className="flex justify-center p-4 text-gray-500 bg-gray-200 rounded-b">
                <Link href="/posts/[id]/comments" as={`/posts/${id}/comments?symbol=${symbol}`}>
                  <a>댓글 등록하기</a>
                </Link>
            </div>
          )
        }
      </div>
      <div className="pb-8">
        <PostList />
        {
          currentUser && (
            <div className="container fixed bottom-0 left-0 flex justify-end w-100 py-2 px-4 bg-white rounded-t-lg shadow-upper">
              <Link href="/posts/[id]/comments" as={`/posts/${id}/comments?symbol=${symbol}`}>
                <a className="flex align-center">
                  <i className="material-icons">comment</i>
                  <span className="ml-1 text-red-400">{comments.totalCount}</span>
                </a>
              </Link>
            </div>
          )
        }
      </div>
    </Layout>
  );
};

Post.getInitialProps = async function({ query }) {
    const symbol = query.symbol ? query.symbol : "aapl"
    const stock = await fetch(`https://sandbox.iexapis.com/stable/stock/${symbol}/quote?token=Tsk_c0ece87aef0b4d0691dc3c4e97f49335`)
        .then(res => res.json())
  
    return {
        stock,
        symbol,
    };
};

export default Post;