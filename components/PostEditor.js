import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import editor from './editor/editor';

class PostEditor extends React.Component {
    constructor() {
        super();

        this.state = {
            title: "",
            editorState: EditorState.createEmpty(),
        };
        this.onTitleChange = this.onTitleChange.bind(this);
        this.onEditorStateChange = this.onEditorStateChange.bind(this);
    }

    onTitleChange(value) {
        this.setState({
            title: value
        });
    }
  
    onEditorStateChange(editorState) {
        this.setState({
            editorState,
        });
        console.log(editorState)
        //   this.props.setValue(editorState)
    };
  
    render() {
        const { editorState } = this.state;
        return (
            <>
                <input
                    className="mb-4 p-2 w-full border rounded focus:outline-none focus:shadow-outline"
                    placeholder="제목을 입력해 주세요"
                />
                <Editor
                    editorState={editorState}
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor"
                    onEditorStateChange={this.onEditorStateChange}
                />
            </>
        )
    }
}

export default PostEditor;
