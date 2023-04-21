import { click, merge, useAction } from ':/util';
import { useAtomValue } from 'jotai/react';
import React from 'react';
import { VscClose } from 'react-icons/vsc';
import { ID, playlist } from ':/state/playlist';
import styles from './FileOpenFile.module.css';

export interface FileOpenFileProps {
    id: ID,
    props: any,
    handle: any
}

export function FileOpenFile({ id, props, handle }: FileOpenFileProps) {
    const file = useAtomValue(playlist.files(id));
    const name = useAtomValue(file.name);
    const isOpen = useAtomValue(playlist.activeFile) === id;
    const openFile = useAction(playlist.openFile);
    const closeFile = useAction(playlist.closeFile);
    
    return (
        <div
            className={merge({ [styles.active]: isOpen }, styles.file)}
            {...click(() => openFile(id))}
            {...props}
            {...handle}
        >
            <span className={styles.close} onClick={e => (e.stopPropagation(), closeFile(id))}>
                <VscClose/>
            </span>
            <span className={styles.name}>
                {name}
            </span>
        </div>
    );
}