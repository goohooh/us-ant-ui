import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks';
import PostItem from './PostItem';
import Paginator from './Paginator';
import { CurrentUserQuery } from './OffCanvas';

const POSTS = gql`
  query Posts($boardId: String!) {
    posts(boardId: $boardId) {
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

const PRODUCTS = gql`
  query Products($symbol: String!) {
    products(term: $symbol) {
      id
      symbol
      engName
      korName
      board {
        id
        posts {
          totalCount
          edges {
            node {
              id
              title
              commentsCount
              likesCount
              updatedAt
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
    }
  }
`;

const PostList = () => {
    const router = useRouter();
    const symbol = router.query.symbol || "spy";
    const page = router.query.page || 1;
    const offset = (page - 1) * 10;
    const { data: currentUser } = useQuery(CurrentUserQuery);
    const { loading, error, data } = useQuery(POSTS, {
      variables: {
        boardId: "ck9sdu1wl00033i89kigeocd7",
        // offset,
      }
    });
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    const posts = data.posts.edges || [];
    const count = data.posts.totalCount;
    return (
        <div className="container p-4">
            <div className="flex justify-between align-center py-2">
              <h4 className="text-sm">Posts</h4>
                {
                  currentUser && <Link href={`/posts/create?symbol=${symbol}`}>
                    <a onClick={() => Router.push('/posts/create', { query: { symbol }})} className="bg-transparent hover:bg-blue-500 text-blue-700 text-xs font-semibold hover:text-white px-2 border border-blue-500 hover:border-transparent rounded">
                        글쓰기
                    </a>
                  </Link>
                }
            </div>
            <ul className="posts">
            {posts.map(({ node }) => (
                <PostItem key={node.id} item={node} />
            ))}
            </ul>
          <Paginator count={count} page={page} />
        </div>
    );
}

export default PostList;