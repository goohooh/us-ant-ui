import Router, { useRouter } from 'next/router';
import Link from "next/Link";

export default ({ count = 0, page = 1}) => {
    const router = useRouter();
    const { id, ...query } = router.query;

    const pages = [];
    const maxPage = Math.ceil(count / 10);
    const startPage = Math.floor((page - 1) / 10) * 10 + 1;
    const endPage = Math.min(
        startPage + 10,
        maxPage + 1
    );
    let i = startPage;
    while (i < endPage) {
        pages.push(i);
        i++;
    }
    return (
        <div className="mt-2 flex justify-center">
            <div className="flex bg-gray-100 rounded-full">
                <button className="bg-gray-300 hover:bg-gray-400 text-gray-700 mr-1 py-1 px-1 rounded-full material-icons">
                    keyboard_arrow_left
                </button>
                {pages.map(i => (
                    <Link key={i} href={{ pathname: router.pathanme, query: { ...query, page: i }}} shallow={true}>
                        <a className={`mx-1 bg-gray-100 hover:bg-gray-300 text-center py-1 px-1 rounded-full ${i === page ? "bg-blue-300 text-white" : "text-gray-600"}`}
                           style={{ minWidth: "2rem"}}>{i}</a>
                    </Link>
                ))}
                <button className="bg-gray-300 hover:bg-gray-400 text-gray-700 ml-1 py-1 px-1 rounded-full material-icons">
                    keyboard_arrow_right
                </button>
            </div>
        </div>
    );
};