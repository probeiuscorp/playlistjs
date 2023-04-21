import { atom } from 'jotai/vanilla';
import { atomFamily } from 'jotai/vanilla/utils';
import { action, normalizedMap, out } from ':/util';
import { nanoid } from 'nanoid';

export type ID = string;
export type FileKind = 'file' | 'note';
export type FileInfo = {
    id: ID,
    name: string,
    full: string,
    kind: FileKind
};

const openAtom = atom<ID[]>([]);
const directoryAtom = atom<ID[]>([]);
const activeFileAtom = atom<ID | null>(null);

type FileFactory = {
    name: string,
    kind: FileKind,
}
const filesFamily = normalizedMap((id, { kind, name }: FileFactory) => {
    const nameAtom = atom(name);
    
    return atom({
        id,
        kind,
        name: nameAtom,
        full: atom(get => {
            const name = get(nameAtom);
            const suffix = kind === 'file'
                ? '.ts'
                : '.md';
            return name + suffix;
        })
    });
});
const contentFamily = atomFamily((id: ID | null) => atom(''));

const addFile = action((get, set, { name, kind }: { name: string, kind: FileKind }) => {
    const id = nanoid();
    filesFamily.add(id, { name, kind });
    set(directoryAtom, old => [...old, id]);
    return id;
});
const deleteFile = action((get, set, id: ID) => {
    set(closeFile, id);

    const rm = (old: ID[]) => old.filter(out(id));
    filesFamily.remove(id);
    contentFamily.remove(id);
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

export const playlist = {
    open: openAtom,
    directory: directoryAtom,
    files: filesFamily,
    content: contentFamily,
    activeFile: activeFileAtom,
    openFile,
    closeFile,
    addFile,
    deleteFile
};