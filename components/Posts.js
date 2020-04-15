import Link from 'next/link';
import Router from 'next/router';
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import PostItem from './PostItem';

const EXCHANGE_RATES = gql`
  {
    rates(currency: "USD") {
      currency
      rate
    }
  }
`;

const Posts = () => {
    const router = useRouter();
    const symbol = router.query.symbol || "spy";
    const { loading, error, data } = useQuery(EXCHANGE_RATES);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    return (
        <div className="container p-4">
            <div className="flex justify-between align-center py-2">
                <h4 className="text-sm">Posts</h4>
                    <button onClick={() => Router.push('/posts/create', { query: { symbol }})} className="bg-transparent hover:bg-blue-500 text-blue-700 text-xs font-semibold hover:text-white px-2 border border-blue-500 hover:border-transparent rounded">
                        글쓰기
                    </button>
            </div>
            <ul className="posts">
            {data.rates.map((item, idx) => (
                <PostItem key={idx} item={item} id={idx} />
            ))}
            </ul>
        </div>
    );
}

export default Posts;