import { merge, stopPropagation, useAction } from ':/util';
import { Modals } from ':/components/modal';
import { useAtom } from 'jotai/react';
import React, { forwardRef } from 'react';
import { VscEdit, VscGripper, VscTrash } from 'react-icons/vsc';
import { ID, workspace } from ':/state/workspace';
import styles from './DirectoryFile.module.css';
import { ModalChangeName } from './ModalChangeName';
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';

type DirectoryFileProps = {
    id: ID
    props: any
    handle: any
}

export function DirectoryFile({ id, props, handle }: DirectoryFileProps) {
    const [file] = useAtom(workspace.files(id));
    const [name, setName] = useAtom(file.name);
    const openFile = useAction(workspace.openFile);
    const deleteFile = useAction(workspace.deleteFile);

    const deleteSelf = () => {
        deleteFile(id);
    };

    const handleKeyUp: React.KeyboardEventHandler = e => {
        if(e.key === 'Delete') {
            deleteSelf();
        } else if(e.key === 'Enter') {
            openFile(id);
        } else {
            props.handleKeyUp?.(e);
        }
    };

    const handleRename = async () => {
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
            <Menu>
                <MenuButton
                    as={ActionableMenuButton}
                    icon={<VscEdit/>}
                    onClick={stopPropagation}
                />
                <MenuList onClick={stopPropagation}>
                    <MenuItem icon={<VscEdit size="1.5em"/>} onClick={handleRename}>
                        Rename
                    </MenuItem>
                    <MenuItem icon={<VscTrash size="1.5em"/>} onClick={deleteSelf}>
                        Delete
                    </MenuItem>
                </MenuList>
            </Menu>
        </div>
    );
}

const ActionableMenuButton = forwardRef(function Something({ icon, ...props }: any, ref) {
    return (
        <span {...props} className={merge(styles.fileAction, 'action')} tabIndex={0} ref={ref}>
            {icon}
        </span>
    );
});