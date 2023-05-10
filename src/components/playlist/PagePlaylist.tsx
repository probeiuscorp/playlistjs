import React from 'react';
import { useInitializedStore } from ':/hooks/useInitializedStore';
import { playlist } from ':/state/playlist';
import { Page } from '../Page';
import { Nav } from '../Nav';
import { FilesOpen } from './FilesOpen';
import { FileEditor } from './FileEditor';
import { Directory } from './Directory';
import styles from './PagePlaylist.module.css';
import { Playlist } from ':/models/Playlists';
import { useHotkey } from ':/hooks/useHotkey';

export function PagePlaylist({ id, directory }: Playlist) {
    const store = useInitializedStore(store => {
        store.set(playlist.deserialize, directory);
    }, [directory]);

    useHotkey('ctrl + s', () => {
        const directory = store.set(playlist.serialize);
        const body: Playlist = {
            id,
            directory,
        };
        
        fetch('/api/save', {
            method: 'POST',
            body: JSON.stringify(body),
        });
    });

    return (
        <Page store={store} className={styles.app}>
            <Nav/>
            <FilesOpen/>
            <FileEditor/>
            <Directory/>
        </Page>
    );
}