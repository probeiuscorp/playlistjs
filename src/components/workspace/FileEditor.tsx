import { action, merge, useAction } from ':/util';
import Editor from '@monaco-editor/react';
import { type editor } from 'monaco-editor/esm/vs/editor/editor.api';
import { useAtom, useAtomValue } from 'jotai/react';
import React, { useEffect } from 'react';
import { workspace } from ':/state/workspace';
import styles from './FileEditor.module.css';
// @ts-ignore
import content from ':/lib/execute/std.d.ts.txt';
import { wireTmGrammars } from 'monaco-editor-textmate';
import { Registry } from 'monaco-textmate';
import { loadWASM } from 'onigasm';
import theme from 'public/theme.json';
import { atom } from 'jotai/vanilla';
import { noop } from 'swr/_internal';

type Editor = editor.IStandaloneCodeEditor;
type Monaco = typeof import('monaco-editor/esm/vs/editor/editor.api');

const loadingGrammarCacheAtom = atom<Promise<string> | null>(null);
const actionLoadGrammar = action((get, set) => {
    const cache = get(loadingGrammarCacheAtom);
    if(cache) {
        return cache;
    } else {
        const loader = fetch('/typescript.tmLanguage').then(res => res.text());
        set(loadingGrammarCacheAtom, loader);
        return loader;
    }
});

// Adapted from https://github.com/zikaari/monaco-editor-textmate
const actionLoadTextMate = action(async (get, set, editor: Editor, monaco: Monaco) => {
    const loadingGrammar = set(actionLoadGrammar);
    await loadWASM('/onigasm.wasm').catch(noop);

    const registry = new Registry({
        async getGrammarDefinition() {
            const content = await loadingGrammar;
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
    const directory = get(workspace.directory);
    for(const id of directory) {
        const file = get(workspace.files(id));
        const path = get(file.full);
        const uri = monaco.Uri.parse(path);
        if(monaco.editor.getModel(uri) === null) {
            const content = get(workspace.content(id));
            const language = file.kind === 'file'
                ? 'typescript'
                : 'markdown';
            monaco.editor.createModel(content, language, uri);
        }
    }
    
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        strict: true,
    });
    monaco.languages.typescript.typescriptDefaults.setExtraLibs([
        { content },
    ]);
});

export function FileEditor() {
    const file = useAtomValue(workspace.activeFile);
    const loadGrammar = useAction(actionLoadGrammar);

    useEffect(() => {
        // preload loaders
        loadGrammar();
    }, []);

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
    file: string
};
function FileEditorCode({ file }: FileEditorCodeProps) {
    const info = useAtomValue(workspace.files(file));
    const [value, setValue] = useAtom(workspace.content(file));
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