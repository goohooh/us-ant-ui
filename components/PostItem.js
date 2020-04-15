import Link from 'next/link';
import { useRouter } from 'next/router';

export default ({ item: { currency, rate }, id }) => {
    const router = useRouter();
    return (
        <li className="posts__item border-gray-300 p-2">
            <Link href={{ pathname: "/posts/[id]", query: { ...router.query }}} as={{pathname: `/posts/${id}`, query: { ...router.query }}} >
                <a className="block">
                    <h4 className="text-base">{`${currency}, ${rate}`}</h4>
                    <div className="flex justify-between">
                    <span className="text-sm text-gray-600">{`${currency}`}</span>
                    <span className="text-xs text-gray-400">{new Date().toDateString()}</span>
                    </div>
                </a>
            </Link>
        </li>
    );
};