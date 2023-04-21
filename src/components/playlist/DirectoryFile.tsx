import { click, Clicker, merge, useAction } from ':/util';
import { Modals } from ':/components/modal';
import { useAtom } from 'jotai/react';
import React from 'react';
import { VscEdit, VscGripper } from 'react-icons/vsc';
import { ID, playlist } from ':/state/playlist';
import styles from './DirectoryFile.module.css';
import { ModalChangeName } from './ModalChangeName';

interface DirectoryFileProps {
    id: ID,
    props: any,
    handle: any
}

export function DirectoryFile({ id, props, handle }: DirectoryFileProps) {
    const [file] = useAtom(playlist.files(id));
    const [name, setName] = useAtom(file.name);
    const openFile = useAction(playlist.openFile);
    const deleteFile = useAction(playlist.deleteFile);

    const handleKeyUp: React.KeyboardEventHandler = e => {
        // console.log(handleKey);
        if(e.key === 'Delete') {
            deleteFile(id);
        } else if(e.key === 'Enter') {
            openFile(id);
        } else {
            props.handleKeyUp?.(e);
        }
    };

    const handleEdit: Clicker = async e => {
        e.stopPropagation();
        const name = await Modals.open(ModalChangeName);
        if(name) setName(name);
    };

    return (
        <div
            {...props}
            tabIndex={0}
            className={file.kind === 'note' ? styles.note : styles.file}
            onClick={() => openFile(id)}
            onKeyUp={handleKeyUp}
        >
            <span className={styles.fileHandle} {...handle}>
                <VscGripper/>
            </span>
            <span className={styles.fileName}>
                {name}
            </span>
            <span
                className={merge(styles.fileAction, 'action')}
                {...click(handleEdit)}
            >
                <VscEdit/>
            </span>
        </div>
    );
}