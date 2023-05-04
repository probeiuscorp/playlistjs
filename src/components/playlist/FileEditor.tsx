import { merge } from ':/util';
import Editor from '@monaco-editor/react';
import { useAtom, useAtomValue } from 'jotai/react';
import React from 'react';
import { playlist } from ':/state/playlist';
import styles from './FileEditor.module.css';
// @ts-ignore
import content from ':/playlistjs.ts.txt';

function handleEditorWillMount(monaco: typeof import('/home/caleb/playlistjs/node_modules/monaco-editor/esm/vs/editor/editor.api')) {
    monaco.languages.typescript.typescriptDefaults.setExtraLibs([
        { content }
    ]);
}

export function FileEditor() {
    const file = useAtomValue(playlist.activeFile);

    return (
        file === null
            ? <div className={merge(styles.container, styles.noFile)}/>
            : (
                <div className={styles.container}>
                    <FileEditorCode file={file}/>
                </div>
            )
    );
}

type FileEditorCodeProps = {
    file: string,
};
function FileEditorCode({ file }: FileEditorCodeProps) {
    const info = useAtomValue(playlist.files(file));
    const [value, setValue] = useAtom(playlist.content(file));
    const full = useAtomValue(info.full);

    return (
        <Editor
            theme="vs-dark"
            path={full}
            value={value}
            defaultLanguage={info.kind === 'file' ? 'typescript' : 'markdown'}
            options={{ fontSize: 16, padding: { top: 8 }}}
            beforeMount={handleEditorWillMount}
            onChange={e => e && setValue(e)}
        />
    );
}