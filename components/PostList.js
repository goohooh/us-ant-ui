import Link from 'next/link';
import Router, { useRouter } from 'next/router';
// import { useQuery } from '@apollo/react-hooks';
import { useQuery } from "react-apollo";
import PostItem from './PostItem';
import { PRODUCTS, POSTS, CURRENT_USER } from "../gql/queries";
import Loading from "./Loading";

const PostList = () => {
    const router = useRouter();
    const symbol = router.query.symbol || "aapl";
    const { data: products } = useQuery(PRODUCTS, {
      variables: {
        term: symbol,
      }
    })
    const { data: currentUser } = useQuery(CURRENT_USER);
    const skip = products === undefined;
    const boardId = products && products.products.length ? products.products[0].board.id : "ck9sdu1wl00033i89kigeocd7";
    const { loading, error, data, fetchMore } = useQuery(POSTS, {
      skip,
      variables: {
        boardId,
      }
    });
    if (loading) return <Loading />;
    if (error) return <p>Error :(</p>;
    const posts = data ? data.posts.edges : [];
    return (
        <div className="container p-4 pb-8">
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
              <button className="mt-2 px-4 text-purple-600 bg-transparent border border-purple-600 rounded" onClick={() => {
                const { endCursor } = data.posts.pageInfo;
                fetchMore({
                  variables: {
                    boardId,
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