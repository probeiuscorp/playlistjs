import { merge, useAction } from ':/util';
import { useAtomValue } from 'jotai/react';
import React from 'react';
import { VscClose } from 'react-icons/vsc';
import { ID, workspace } from ':/state/workspace';
import styles from './FileOpenFile.module.css';
import { useHotkey } from ':/hooks/useHotkey';

export type FileOpenFileProps = {
    id: ID
    props: any
    handle: any
}

export function FileOpenFile({ id, props, handle }: FileOpenFileProps) {
    const file = useAtomValue(workspace.files(id));
    const name = useAtomValue(file.name);
    const isOpen = useAtomValue(workspace.activeFile) === id;
    const openFile = useAction(workspace.openFile);
    const closeFile = useAction(workspace.closeFile);
    const deleteFile = useAction(workspace.deleteFile);

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