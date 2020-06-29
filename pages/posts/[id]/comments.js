import { useState } from "react";
import Link from 'next/link';
import { useRouter } from 'next/router';
// import { useQuery, useMutation } from '@apollo/react-hooks';
import { useQuery, useMutation } from "react-apollo";
import Layout from '../../../components/Layout';
import Comment from '../../../components/Comment';
import Loading from '../../../components/Loading';
import { POST_AND_COMMENTS, POST } from "../../../gql/queries";
import { CREATE_COMMENT } from "../../../gql/mutations";

const updateLike = (query, variables) => (cache, comment) => {
  const { post, comments } = cache.readQuery({ query, variables })
  const edges = [...comments.edges];
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
      query,
      data: { ...post, comments: { ...comments, edges } },
  });
};

const Comments = () => {
    const [text, setText] = useState("");
    const router = useRouter();
    const { id: postId, symbol = "aapl" } = router.query;
    const variables = { postId };
    const { error, loading, data } = useQuery(POST_AND_COMMENTS, { variables });
    const [createComment] = useMutation(CREATE_COMMENT, {
      update(cache, { data: { createComment }}) {
          const { comments, post } = cache.readQuery({ query: POST_AND_COMMENTS, variables: { postId }});
          const newComment = { ...createComment };
          const commentEdges = [...comments.edges, {
            node: newComment,
            __typename: "CommentEdge"
          }];
          cache.writeQuery({
            query: POST_AND_COMMENTS,
            variables: { postId },
            data: {
              post: { ...post },
              comments: { 
                totalCount: commentEdges.length,
                edges: commentEdges,
                __typename: "CommentsConnection",
              }
            }
          });
          setText("");
        }
    });

    if (loading) return (
      <Layout hideHeader={true}>
        <Loading />
      </Layout>
    );
    if (error) return <p>Error :(</p>;

    const { post, comments } = data;


    return (
      <Layout hideHeader={true}>
        <div className="bg-blue-300 text-white p-4 relative text-center font-bold">
          <Link href="/posts/[id]" as={`/posts/${postId}?symbol=${symbol}`}>
            <a className="absolute" style={{ left: 20, top: 15}}><i className="material-icons">close</i></a>
          </Link>
          댓글
        </div>
        <div className="container p-4 ">
          <h1 className="pb-4 text-2xl font-bold break-words">{post.title}</h1>

          <div className="p-2 bg-blue-100 rounded">
              <textarea 
                  value={text}
                  onChange={e => {setText(e.target.value)}}
                  placeholder="댓글을 입력해 주세요"
                  className="mb-1 p-2 w-full resize-none border rounded focus:outline-none focus:shadow-outline" />
              <div className="flex flex-row-reverse">
                  <button
                      onClick={() => {
                          createComment({
                              variables: {
                                  postId,
                                  text
                              }
                          });
                      }}
                      className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-1 px-4 rounded">
                      등록
                  </button>
              </div>
          </div>

          <div className="rounded bg-gray-200 mt-2 p-2">
            {comments.edges.length}
            {
              comments.edges.length
                ? comments.edges.map(({ node })=> (<Comment key={node.id} comment={node} updateLike={updateLike(POST_AND_COMMENTS, variables)} />))
                : (<p className="text-center text-gray-600">처음 댓글을 작성해보세요!</p>)
            }
          </div>
        </div>
      </Layout>
    );
};

export default Comments;