import React from 'react';
import { Editor } from './Editor';
import { EditorFiles } from './EditorFiles';
import { EditorTerminal } from './EditorTerminal';
import './PageEditor.scss';

export function PageEditor() {
    return (
        <div className="page-editor">
            <div className="editor-sidebar">

            </div>
            <EditorFiles/>
            <Editor/>
            <EditorTerminal/>
        </div>
    )
}