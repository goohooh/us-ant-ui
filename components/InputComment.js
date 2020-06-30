import { useState } from "react";
import { useRouter } from 'next/router';
import { useMutation } from "react-apollo";
import gql from 'graphql-tag'

const CREATE_COMMENT = gql`
  mutation CreateComment($postId: String!, $text: String!) {
    createComment(postId: $postId, text: $text) {
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
`;

const POST = gql`
  query Post($id: String!) {
    post(id: $id) {
      id
      title
      content
      likesCount
      updatedAt
      isPostLiked
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

export default () => {
    const { query: { id: postId } } = useRouter();
    const [text, setText] = useState("");
    const [createComment] = useMutation(CREATE_COMMENT, {
        update(cache, { data: { createComment }}) {
            const data = cache.readQuery({ query: POST, variables: { id: postId }});
            const comment = { ...createComment, };
            const post = JSON.parse(JSON.stringify(data.post));
            post.comments.edges.push({
                node: comment,
                __typename: "CommentEdge"
            });
            cache.writeQuery({
                query: POST,
                data: { post }
            });
            setText("");
        }
    });

    return (
        <div className="container fixed bottom-0 left-0 w-100 p-4 bg-white rounded-lg shadow-upper">
            <h4 className="text-sm">댓글</h4>
            <textarea 
                value={text}
                onChange={e => {setText(e.target.value)}}
                className="mt-4 mb-1 p-2 w-full resize-none border rounded focus:outline-none focus:shadow-outline" />
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
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded">
                    등록
                </button>
            </div>
        </div>
    );
};