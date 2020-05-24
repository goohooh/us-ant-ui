import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks';

import { CurrentUserQuery } from './OffCanvas';

const TOGGLE_COMMENT_LIKE = gql`
  mutation ToggleCommentLike($commentId: String!) {
    toggleCommentLike(commentId: $commentId)
  }
`;

const COMMENT = gql`
  query Comment($id: String!) {
    comment(id: $id) {
      id
      isComemntLiked
      CommentlikesCount
    }
  }
`;

export default ({ comment }) => {
    const { data: currentUser } = useQuery(CurrentUserQuery);
    const [toggleLike] = useMutation(TOGGLE_COMMENT_LIKE, {
        update(cache, { data: { toggleCommentLike } }) {
            if (toggleCommentLike) {
                // const { comment } = cache.readQuery({ query: COMMENT, variables: { id: comment.id } });
                // const isCommentLiked = !comment.isCommentLiked;
                // const likesCount = comment.CommentlikesCount + (isCommentLiked ? 1 : -1);
                // cache.writeQuery({
                //     query: POST,
                //     data: { comment: { ...comment, isPostLiked, likesCount, } },
                // });
            }
        }
    });

    return (
        <div className="pb-2">
            <div className="rounded shadow-md bg-white">
                <div className="p-2">
                <div className="text-xs flex justify-between mb-2">
                    <span className="text-gray-600">{comment.user.username}</span>
                    <span className="text-gray-400">{new Date(comment.updatedAt).toDateString()}</span>
                </div>
                <div className="flex justify-between">
                    <p className="text-md">{comment.text}</p>
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