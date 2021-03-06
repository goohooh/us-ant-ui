import { useRouter } from 'next/router';
import { useQuery, useMutation } from "react-apollo";
import Link from "next/link";
import Loading from "./Loading";
import { CURRENT_USER, POST } from '../gql/queries';
import { TOGGLE_COMMENT_LIKE } from '../gql/mutations';

export default ({ comment, updateLike }) => {
    const router = useRouter();
    const { id } = router.query;
    const { data: currentUser, loading, error } = useQuery(CURRENT_USER);
    const [toggleLike] = useMutation(TOGGLE_COMMENT_LIKE, {
        update(cache, { data: { toggleCommentLike } }) {
            if (toggleCommentLike) {
                updateLike(cache, comment);
            }
        }
    });

    if (loading) return <Loading />;
    if (error) return <p>Error :(</p>;

    return (
        <div className="pb-2">
            <div className={`rounded shadow-md ${comment.isNew ? "bg-blue-100" : "bg-white"}`}>
                <div className="p-2">
                  <div className="text-xs flex justify-start mb-2">
                      <span className="text-gray-600">{comment.user.username}</span>
                      <span className="ml-2 flex-grow text-gray-400">{new Date(comment.updatedAt).toDateString()}</span>
                      {
                        currentUser && currentUser.currentUser.id === comment.user.id
                          ? (<Link href={`/comments/${comment.id}/edit`}>
                              <a className="mr-2 btn text-gray-500">
                              수정
                              </a>
                            </Link>)
                          : null
                      }
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