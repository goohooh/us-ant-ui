import { useRouter } from 'next/router';
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks';

import { CurrentUserQuery } from './OffCanvas';

const TOGGLE_COMMENT_LIKE = gql`
  mutation ToggleCommentLike($commentId: String!) {
    toggleCommentLike(commentId: $commentId)
  }
`;

// const COMMENT = gql`
//   query Comment($id: String!) {
//     comment(id: $id) {
//       id
//       isComemntLiked
//       CommentlikesCount
//     }
//   }
// `;
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
      comments {
        edges {
          node {
            id
            text
            updatedAt
            CommentlikesCount
            isCommentLiked
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

export default ({ comment }) => {
    const router = useRouter();
    const { id } = router.query;
    const { data: currentUser } = useQuery(CurrentUserQuery);
    const [toggleLike] = useMutation(TOGGLE_COMMENT_LIKE, {
        update(cache, { data: { toggleCommentLike } }) {
            if (toggleCommentLike) {
                const { post } = cache.readQuery({ query: POST, variables: { id } });
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
            }
        }
    });

    return (
        <div className="pb-2">
            <div className={`rounded shadow-md ${comment.isNew ? "bg-blue-100" : "bg-white"}`}>
                <div className="p-2">
                <div className="text-xs flex justify-between mb-2">
                    <span className="text-gray-600">{comment.user.username}</span>
                    <span className="text-gray-400">{new Date(comment.updatedAt).toDateString()}</span>
                </div>
                <div className="flex justify-between">
                    <p className="text-md break-words">{comment.text}</p>
                    <button 
                        onClick={() => {
                            if (!currentUser) return;
                            toggleLike({
                                variables: {
                                    commentId: comment.id
                                }
                            });
                        } }
                    className={`text-xs py-1 px-2 mr-2 flex items-center`}>
                    <i className={`material-icons text-xs text-gray-500 ${comment.isCommentLiked ? "text-red-500" : ""}`}>thumb_up</i>
                    <span className={`ml-1 text-gray-500 ${comment.isCommentLiked ? "text-red-500" : ""}`}>{comment.CommentlikesCount}</span>
                    </button>
                </div>
                </div>
            </div>
        </div>
    );
}