import { merge, useAction } from ':/util';
import { useAtomValue } from 'jotai/react';
import React from 'react';
import { VscClose } from 'react-icons/vsc';
import { ID, playlist } from ':/state/playlist';
import styles from './FileOpenFile.module.css';
import { useHotkey } from ':/hooks/useHotkey';

export type FileOpenFileProps = {
    id: ID
    props: any
    handle: any
}

export function FileOpenFile({ id, props, handle }: FileOpenFileProps) {
    const file = useAtomValue(playlist.files(id));
    const name = useAtomValue(file.name);
    const isOpen = useAtomValue(playlist.activeFile) === id;
    const openFile = useAction(playlist.openFile);
    const closeFile = useAction(playlist.closeFile);
    const deleteFile = useAction(playlist.deleteFile);

    const ref = useHotkey('delete', () => {
        console.log(id);
        deleteFile(id);
    });

    return (
        <div
            className={merge({ [styles.active]: isOpen }, styles.file)}
            onClick={() => openFile(id)}
            ref={ref}
            {...props}
            {...handle}
        >
            <span className={styles.close} onClick={() => closeFile(id)}>
                <VscClose/>
            </span>
            <span className={styles.name}>
                {name}
            </span>
        </div>
    );
}