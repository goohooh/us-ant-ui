import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks';
import PostItem from './PostItem';
import { POSTS, CURRENT_USER } from "../gql/queries";

const PostList = () => {
    const router = useRouter();
    const symbol = router.query.symbol || "spy";
    const page = router.query.page || 1;
    const { data: currentUser } = useQuery(CURRENT_USER);
    const { loading, error, data, fetchMore } = useQuery(POSTS, {
      variables: {
        boardId: "ck9sdu1wl00033i89kigeocd7",
      }
    });
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    const posts = data.posts.edges || [];
    const count = data.posts.totalCount;
    return (
        <div className="container p-4 pb-48">
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
            <div className="flex justify-center">
              <button className="text-purple-600 bg-transparent" onClick={() => {
                const { endCursor } = data.posts.pageInfo;
                fetchMore({
                  variables: {
                    boardId: "ck9sdu1wl00033i89kigeocd7",
                    cursor: endCursor
                  },
                  updateQuery: (previousResult, { fetchMoreResult }) => {
                    const newEdges = fetchMoreResult.posts.edges;
                    const pageInfo = fetchMoreResult.posts.pageInfo;
                    return newEdges.length
                      ? {
                          // Put the new comments at the end of the list and update `pageInfo`
                          // so we have the new `endCursor` and `hasNextPage` values
                          posts: {
                            __typename: previousResult.posts.__typename,
                            edges: [...previousResult.posts.edges, ...newEdges],
                            pageInfo
                          }
                        }
                      : previousResult;
                  }
                })
              }}>더보기</button>
            </div>
        </div>
    );
}

export default PostList;