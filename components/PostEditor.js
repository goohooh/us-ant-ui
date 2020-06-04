import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { convertFromRaw, convertToRaw } from 'draft-js';


class PostEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: props.title || "",
            editorState: props.content ? EditorState.createWithContent(convertFromRaw(props.content)) : EditorState.createEmpty(),
        };
        this.onTitleChange = this.onTitleChange.bind(this);
        this.onEditorStateChange = this.onEditorStateChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit() {
        const { editorState, title } = this.state;

        this.props.onSubmit({
            title,
            bodyRaw: convertToRaw(editorState.getCurrentContent()),
        })
    }

    onTitleChange(e) {
        this.setState({
            title: e.target.value
        });
    }
  
    onEditorStateChange(editorState) {
        this.setState({
            editorState,
        });
    };
  
    render() {
        const { editorState, title } = this.state;
        return (
            <>
                <input
                    value={title}
                    onChange={this.onTitleChange}
                    className="mb-4 p-2 w-full border rounded focus:outline-none focus:shadow-outline"
                    placeholder="제목을 입력해 주세요"
                />
                <Editor
                    editorState={editorState}
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor"
                    onEditorStateChange={this.onEditorStateChange}
                />
                <div className="mt-3 flex flex-row-reverse">
                    <button onClick={this.onSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded shadow-md">글쓰기</button>
                </div>
            </>
        )
    }
}

export default PostEditor;
