import gql from 'graphql-tag'

export const CURRENT_USER = gql`
  query CurrentUser {
      currentUser {
        id
        email
        name
        username
      }
  }
`;

export const PRODUCTS = gql`
  query Products($term: String!) {
    products(term: $term) {
      id
      symbol
      engName
      korName
      board {
        id
      }
    }
  }
`;

export const POSTS = gql`
  query Posts($boardId: String!, $cursor: DateTime) {
    posts(boardId: $boardId, cursor: $cursor) {
      totalCount
      edges {
        node {
          id
          title
          commentsCount
          likesCount
          viewsCount
          updatedAt
          user {
            id
            username
          }
        }
        cursor
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      } 
    }
  }
`;

export const POST = gql`
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
        totalCount
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

export const POST_AND_COMMENTS = gql`
  query PostAndComments($postId: String!) {
    post(id: $postId) {
      id
      title
      likesCount
      isPostLiked
    }
    comments(postId: $postId, offset: 50) {
      totalCount
      edges {
        node {
          id
          text
          CommentlikesCount
          isCommentLiked
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
`;

export const COMMENT = gql`
  query Comment($id: String!) {
    comment(commentId: $id) {
        id
        text
        post {
            id
        }
        user {
            id
            email
            name
            username
        }
    }
  }
`;
