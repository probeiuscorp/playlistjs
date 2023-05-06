import { action, merge, useAction } from ':/util';
import Editor from '@monaco-editor/react';
import { type editor } from 'monaco-editor/esm/vs/editor/editor.api';
import { useAtom, useAtomValue } from 'jotai/react';
import React from 'react';
import { playlist } from ':/state/playlist';
import styles from './FileEditor.module.css';
// @ts-ignore
import content from ':/lib/vm/std.d.ts.txt';
import { wireTmGrammars } from 'monaco-editor-textmate';
import { Registry } from 'monaco-textmate';
import { loadWASM } from 'onigasm';
import theme from 'public/theme.json';

type Editor = editor.IStandaloneCodeEditor;
type Monaco = typeof import('/home/caleb/playlistjs/node_modules/monaco-editor/esm/vs/editor/editor.api');

// Adapted from https://github.com/zikaari/monaco-editor-textmate
const actionLoadTextMate = action(async (get, set, editor: Editor, monaco: Monaco) => {
    await loadWASM('/onigasm.wasm');

    const registry = new Registry({
        async getGrammarDefinition() {
            const content = await fetch('/typescript.tmLanguage').then(res => res.text());
            return {
                content,
                format: 'plist',
            };
        },
    });

    const grammars = new Map<string, string>();
    grammars.set('typescript', 'source.ts');

    monaco.editor.defineTheme('dark-plus', theme as any);
    monaco.editor.setTheme('dark-plus');
    await wireTmGrammars(monaco, registry, grammars, editor);
});

const actionHandleEditorWillMount = action((get, set, monaco: Monaco) => {
    const directory = get(playlist.directory);
    for(const id of directory) {
        const file = get(playlist.files(id));
        const path = get(file.full);
        const uri = monaco.Uri.parse(path);
        if(monaco.editor.getModel(uri) === null) {
            const content = get(playlist.content(id));
            const language = file.kind === 'file'
                ? 'typescript'
                : 'markdown';
            monaco.editor.createModel(content, language, uri);
        }
    }

    monaco.languages.typescript.typescriptDefaults.setExtraLibs([
        { content }
    ]);
});

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
    const loadTextMate = useAction(actionLoadTextMate);
    const handleEditorWillMount = useAction(actionHandleEditorWillMount);

    return (
        <Editor
            saveViewState
            theme="vs-dark"
            path={full}
            value={value}
            defaultLanguage={info.kind === 'file' ? 'typescript' : 'markdown'}
            options={{ fontSize: 16, padding: { top: 8 }}}
            beforeMount={handleEditorWillMount}
            onMount={loadTextMate}
            onChange={e => e && setValue(e)}
        />
    );
}