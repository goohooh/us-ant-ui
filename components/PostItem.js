import Link from 'next/link';
import { useRouter } from 'next/router';

export default ({ item }) => {
    const {
        id,
        title,
        commentsCount,
        likesCount,
        updatedAt,
        user: { username }
    } = item;
    const router = useRouter();
    const { id: _, ...query } = router.query;
    return (
        <li className="posts__item border-gray-300 p-2">
            <Link href={{ pathname: "/posts/[id]", query: { ...query }}} as={{pathname: `/posts/${id}`, query: { ...query }}} shallow={true} >
            {/* <Link href={`/posts/[id]?symbol=${query.symbol || "aapl"}&page=${query.page || 1}`} as={`/posts/${query.id}?symbol=${query.symbol || "aapl"}&page=${query.page || 1}`} > */}
                <a className="block">
                    <div className="flex justify-between">
                        <div className="flex items-center">
                            <h4 className="text-base truncate">{`${title}`}</h4>
                            <span className="ml-1 text-xs text-red-400">[{commentsCount}]</span>
                        </div>
                        <div>
                            <span className="text-xs text-gray-700 mr-2"><i className="text-xs text-gray-500 align-middle mr-1 material-icons">thumb_up_alt</i>{likesCount}</span>
                            {/* <span className="text-xs text-gray-700"><i className="text-xs text-gray-500 align-middle mr-1 material-icons">thumb_down_alt</i>{id}</span> */}
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-600">{`${username}`}</span>
                        <span className="text-xs text-gray-400">{new Date(updatedAt).toDateString()}</span>
                    </div>
                </a>
            </Link>
        </li>
    );
};