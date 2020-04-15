export default ({ comment }) => (
    <div className="pb-2">
        <div className="rounded shadow-md bg-white">
            <div className="p-2">
            <div className="text-xs flex justify-between mb-2">
                <span className="text-gray-600">{comment.author}</span>
                <span className="text-gray-400">{new Date().toDateString()}</span>
            </div>
            <p className="text-md">{comment.comment}</p>
            </div>
        </div>
    </div>
);