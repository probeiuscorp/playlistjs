import { atom } from 'jotai';
import { action, normalizedMap, out } from ':/util';
import { nanoid } from 'nanoid';
import { FileKind, WorkspaceDirectory } from ':/models/Workspaces';

export type ID = string;
export type FileInfo = {
    id: ID
    name: string
    full: string
    kind: FileKind
};

const isDirtyAtom = atom(false);
const openAtom = atom<ID[]>([]);
const directoryAtom = atom<ID[]>([]);
const activeFileAtom = atom<ID | null>(null);

type FileFactory = {
    name: string
    content: string
    kind: FileKind
}
const filesFamily = normalizedMap((id: string, { kind, content, name }: FileFactory) => {
    const nameAtom = atom(name);
    const extension = kind === 'file' ? '.ts' : '.md';
    
    return atom({
        id,
        kind,
        name: nameAtom,
        path: atom(get => {
            const name = get(nameAtom);
            return './' + name;
        }),
        full: atom(get => {
            const name = get(nameAtom);
            return name + extension;
        }),
        content: atom(content),
        extension,
    });
});

const addFile = action((get, set, { name, kind }: { name: string; kind: FileKind }) => {
    const id = nanoid();
    filesFamily.add(id, {
        name,
        content: '',
        kind,
    });
    set(directoryAtom, old => [...old, id]);
    return id;
});
const deleteFile = action((get, set, id: ID) => {
    set(closeFile, id);

    const rm = (old: ID[]) => old.filter(out(id));
    filesFamily.remove(id);
    set(directoryAtom, rm);
    set(openAtom, rm);
});
const openFile = action((get, set, id: ID) => {
    const open = get(openAtom);
    const i = open.indexOf(id);

    if(i === -1) {
        set(openAtom, [...open, id]);
    }
    set(activeFileAtom, id);
});
const closeFile = action((get, set, id: ID) => {
    const open = get(openAtom);
    if(open.length === 1) {
        set(activeFileAtom, null);
        set(openAtom, []);
    } else {
        const i = open.indexOf(id);
        const nextOpen = open.filter(out(id));
        set(openAtom, nextOpen);
        const activeFile = get(activeFileAtom);
        if(activeFile === id) {
            if(i !== null) {
                if(i === nextOpen.length) {
                    set(activeFileAtom, nextOpen[nextOpen.length - 1]);
                } else {
                    set(activeFileAtom, nextOpen[i]);
                }
            } else {
                console.warn('Couldn\'t find the file while closing the file');
            }
        }
    }
});

const serialize = action((get): WorkspaceDirectory => {
    const open = get(activeFileAtom);
    const openFiles = get(openAtom);
    const ids = get(directoryAtom);
    
    return {
        openFiles,
        open: open ?? undefined,
        files: ids.map((id) => {
            const file = get(filesFamily(id));
            const kind = file.kind;
            const path = get(file.path);
            const content = get(file.content);
            const isEntry = path === './main';

            return {
                id,
                kind,
                path,
                content,
                isEntry,
            };
        }),
    };
});

const deserialize = action((get, set, { open, openFiles, files }: WorkspaceDirectory) => {
    set(activeFileAtom, open ?? null);
    set(openAtom, openFiles);

    for(const file of files) {
        const name = file.path.slice(2);
        filesFamily.add(file.id, {
            name,
            content: file.content,
            kind: file.kind,
        });
    }
    set(directoryAtom, files.map((file) => file.id));
});

export const workspace = {
    open: openAtom,
    directory: directoryAtom,
    files: filesFamily,
    activeFile: activeFileAtom,
    isDirty: isDirtyAtom,
    openFile,
    closeFile,
    addFile,
    deleteFile,
    serialize,
    deserialize,
};