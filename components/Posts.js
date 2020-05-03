import Link from 'next/link';
import Router from 'next/router';
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import PostItem from './PostItem';

const POSTS = gql`
  query Posts($symbol: String!) {
    posts(boardId: $symbol) {
      totalCount
      edges {
        node {
          id
          user {
            username
          }
          title
          commentsCount
          likesCount
          viewsCount
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
`;

const Posts = () => {
    const router = useRouter();
    const symbol = router.query.symbol || "spy";
    const { loading, error, data } = useQuery(POSTS, {
      variables: { symbol }
    });
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    return (
        <div className="container p-4">
            <div className="flex justify-between align-center py-2">
              <h4 className="text-sm">Posts</h4>
                <Link href={`/posts/create?symbol=${symbol}`}>
                  <a onClick={() => Router.push('/posts/create', { query: { symbol }})} className="bg-transparent hover:bg-blue-500 text-blue-700 text-xs font-semibold hover:text-white px-2 border border-blue-500 hover:border-transparent rounded">
                      글쓰기
                  </a>
                </Link>
            </div>
            <ul className="posts">
            {(data.posts || []).slice(0,10).map((item, idx) => (
                <PostItem key={idx} item={item} id={idx} />
            ))}
            </ul>
            <div className="mt-2 flex justify-center">
              <button className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-1 px-3 rounded-l">
                Prev
              </button>
              {[1,2,3,4,5].map(i => (
                <button className="bg-gray-100 hover:bg-gray-300 text-gray-600 py-1 px-3" key={i}>{i}</button>
              ))}
              <button className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-1 px-3 rounded-r">
                Next
              </button>
            </div>
        </div>
    );
}

export default Posts;