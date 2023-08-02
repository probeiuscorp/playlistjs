import React from 'react';
import { useInitializedStore } from ':/hooks/useInitializedStore';
import { workspace } from ':/state/workspace';
import { Page } from '../Page';
import { FilesOpen } from './FilesOpen';
import { FileEditor } from './FileEditor';
import { Directory } from './Directory';
import styles from './PageWorkspace.module.css';
import { WorkspaceData } from ':/models/Workspaces';
import { useHotkey } from ':/hooks/useHotkey';

export function PageWorkspace({ id, directory }: WorkspaceData) {
    const store = useInitializedStore(store => {
        store.set(workspace.deserialize, directory);
    }, [directory]);

    useHotkey('ctrl + s', () => {
        const directory = store.set(workspace.serialize);
        fetch(`/api/workspaces/${id}`, {
            method: 'PUT',
            body: JSON.stringify(directory),
        });
    });

    return (
        <Page store={store} className={styles.app}>
            <FilesOpen/>
            <FileEditor/>
            <Directory/>
        </Page>
    );
}