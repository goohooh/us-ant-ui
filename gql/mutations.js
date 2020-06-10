import gql from 'graphql-tag';

export const SIGNUP_MUTATION = gql`
  mutation SignUp($email: String!, $password: String!, $name: String!, $username: String!) {
    signUp(email: $email, password: $password, name: $name, username: $username) {
        token
    }
  }
`;

export const SIGNIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
        token
        user {
            id
            email
            name
            username
        }
    }
  }
`;

export const SIGNIN_GOOGLE_MUTATION = gql`
  mutation GoogleLogin($accessToken: String!) {
    loginByGoogle(accessToken: $accessToken) {
        token
        user {
            email
            name
            username
        }
    }
  }
`;

export const SIGNIN_FACEBOOK_MUTATION = gql`
  mutation FacebookLogin($accessToken: String!) {
    loginByFacebook(accessToken: $accessToken) {
        token
        user {
            email
            name
            username
        }
    }
  }
`;

export const TOGGLE_POST_LIKE = gql`
  mutation TogglePostLike($postId: String!) {
    togglePostLike(postId: $postId)
  }
`;

export const CREATE_POST_MUTATION = gql`
  mutation CreatePost($boardId: String!, $title: String!, $content: String!) {
    createPost(boardId: $boardId, title: $title, content: $content) {
        id
    }
  }
`;

export const UPDATE_POST_MUTATION = gql`
  mutation UpdatePost($postId: String!, $title: String!, $content: String!) {
    updatePost(postId: $postId, title: $title, content: $content) {
        id
    }
  }
`;

export const CREATE_COMMENT = gql`
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

export const UPDATE_COMMENT = gql`
  mutation updateComment($id: String!, $text: String!) {
    updateComment(commentId: $id, text: $text) {
        id
        post {
            id
        }
    }
  }
`;

export const TOGGLE_COMMENT_LIKE = gql`
  mutation ToggleCommentLike($commentId: String!) {
    toggleCommentLike(commentId: $commentId)
  }
`;
