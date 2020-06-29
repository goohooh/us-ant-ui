import { useState } from "react";
import Router from 'next/router';
import Link from 'next/link';
import { useRouter } from 'next/router';
// import { useQuery, useMutation } from '@apollo/react-hooks';
import { useQuery, useMutation } from "react-apollo";
import gql from 'graphql-tag'
import Layout from '../../../components/Layout';
import Comment from '../../../components/Comment';
import { COMMENT } from "../../../gql/queries";
import { UPDATE_COMMENT } from "../../../gql/mutations";


const Comments = () => {
    const [text, setText] = useState("");
    const router = useRouter();
    const { id, symbol = "aapl" } = router.query;
    const { error, loading, data } = useQuery(COMMENT, {
        variables: { id }
    });
    const [createComment] = useMutation(UPDATE_COMMENT, {
      update(cache, { data: { updateComment }}) {
          if (updateComment) {
              const postId = updateComment.post.id;
              Router.push(`/posts/${postId}/comments?symbol=${symbol}`);
          }
        }
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    const { comment } = data;


    return (
      <Layout hideHeader={true}>
        <div className="bg-blue-300 text-white p-4 relative text-center font-bold">
          <Link href="/posts/[id]" as={`/posts/${comment.post.id}?symbol=${symbol}`}>
            <a className="absolute" style={{ left: 20, top: 15}}><i className="material-icons">close</i></a>
          </Link>
          댓글
        </div>
        <div className="container p-4 ">
          <div className="p-2 bg-blue-100 rounded">
              <textarea 
                  value={comment.text}
                  onChange={e => {setText(e.target.value)}}
                  placeholder="댓글을 입력해 주세요"
                  className="mb-1 p-2 w-full resize-none border rounded focus:outline-none focus:shadow-outline" />
              <div className="flex flex-row-reverse">
                  <button
                      onClick={() => {
                          updateComment({
                              variables: {
                                  id,
                                  text
                              }
                          });
                      }}
                      className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-1 px-4 rounded">
                      수정
                  </button>
              </div>
          </div>
        </div>
      </Layout>
    );
};

export default Comments;