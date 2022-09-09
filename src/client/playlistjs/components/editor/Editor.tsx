import React, { useEffect } from 'react';
import MonacoEditor, { useMonaco } from '@monaco-editor/react';
import { EditorLoading } from './EditorLoading';
import './Editor.scss';

const types =
`/// <reference no-default-lib="true"/>
/// <reference lib="es6"/>

declare class Playlist {
    static shuffle<T>(array: T[]): T[];
    static pick<T>(array: T[]): T
}`

export function Editor() {
    const monaco = useMonaco();
    
    useEffect(() => {
        if(monaco) {
            monaco.languages.typescript.typescriptDefaults.setExtraLibs([{
                content: types
            }])
        }
    }, [monaco]);

    return (
        <div className="playlistjs-editor">
            <MonacoEditor
                language="typescript"
                theme="vs-dark"
                loading={<EditorLoading/>}
                options={{
                    fontSize: 16,
                    padding: {
                        // top: 12,
                        // bottom: 12
                    }
                }}
            />
        </div>
    )
}