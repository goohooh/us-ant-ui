import Link from 'next/link';
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks';
import { useRouter } from 'next/router';

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
    const { loading, error, data } = useQuery(EXCHANGE_RATES);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    return (
        <div className="container p-4">
            <h4 className="text-sm">Posts</h4>
            <ul className="posts">
            {data.rates.map(({currency, rate }, idx) => (
                <li key={idx} className="posts__item border-gray-300 p-2">
                    <Link href={{ pathname: "/posts/[id]", query: { ...router.query }}} as={{pathname: `/posts/${idx}`, query: { ...router.query }}} >
                        <a className="block">
                            <h4 className="text-base">{`${currency}, ${rate}`}</h4>
                            <div className="flex justify-between">
                            <span className="text-sm text-gray-600">{`${currency}`}</span>
                            <span className="text-xs text-gray-400">{new Date().toDateString()}</span>
                            </div>
                        </a>
                    </Link>
                </li>
            ))}
            </ul>
        </div>
    );
}

export default Posts;