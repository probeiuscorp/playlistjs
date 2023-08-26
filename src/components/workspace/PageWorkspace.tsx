import React from 'react';
import { useInitializedStore } from ':/hooks/useInitializedStore';
import { workspace } from ':/state/workspace';
import { Page } from '../Page';
import { FilesOpen } from './FilesOpen';
import { FileEditor } from './FileEditor';
import { Directory } from './Directory';
import styles from './PageWorkspace.module.css';
import { WorkspaceData } from ':/models/Workspaces';
import { atom } from 'jotai';

export const workspaceIdAtom = atom(null as any as string);
export function PageWorkspace({ id, directory }: WorkspaceData) {
    const store = useInitializedStore(store => {
        store.set(workspaceIdAtom, id);
        store.set(workspace.deserialize, directory);
    }, [id, directory]);

    return (
        <Page store={store} className={styles.app}>
            <Directory/>
            <FilesOpen/>
            <FileEditor/>
        </Page>
    );
}