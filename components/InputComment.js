import { useState } from "react";
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag'

const CREATE_COMMENT = gql`
  mutation CreateComment($postId: String!, $text: String!) {
    createComment(postId: $postId, text: $text) {
        id
    }
  }
`;

export default () => {
    const { query: { id: postId } } = useRouter();
    const [text, setText] = useState("");
    const [createComment] = useMutation(CREATE_COMMENT);

    return (
        <div className="container">
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
                        })
                    }}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded">
                    등록
                </button>
            </div>
        </div>
    );
};