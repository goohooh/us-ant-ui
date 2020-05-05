export default ({ comment }) => (
    <div className="pb-2">
        <div className="rounded shadow-md bg-white">
            <div className="p-2">
            <div className="text-xs flex justify-between mb-2">
                <span className="text-gray-600">{comment.user.username}</span>
                <span className="text-gray-400">{new Date(comment.updatedAt).toDateString()}</span>
            </div>
            <p className="text-md">{comment.text}</p>
            </div>
        </div>
    </div>
);