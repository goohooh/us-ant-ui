import { useEffect, useMemo, useState } from "react";
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react'

export default () => {
    const editor = useMemo(() => withReact(createEditor()), [])
    const [value, setValue] = useState([])
    return (
        <Slate editor={editor} value={value} onChange={value => setValue(value)}>
            <Editable />
        </Slate>
    )
};
