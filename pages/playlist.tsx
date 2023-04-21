import React from 'react';
import styles from './playlist.module.css';
import { FileInfo, playlist } from ':/state/playlist';
import { nanoid } from 'nanoid';
import { GetStaticProps } from 'next';
import { Directory, FilesOpen, FileEditor } from ':/components/playlist';
import { Nav } from ':/components/Nav';
import { useInitializedStore } from ':/hooks/useInitializedStore';
import { Page } from ':/components/Page';

interface PlaylistProps {
    files: FileInfo[]
}

export default function Playlist({ files }: PlaylistProps) {
    const store = useInitializedStore(store => {
        for(const file of files) {
            store.set(playlist.addFile, file);
        }
    }, [files]);

    return (
        <Page store={store} className={styles.app}>
            <Nav/>
            <FilesOpen/>
            <FileEditor/>
            <Directory/>
        </Page>
    );
}

export const getStaticProps: GetStaticProps<PlaylistProps> = () => {
    return {
        props: {
            files: ([
                { id: nanoid(), name: 'main', kind: 'file' },
            ] as Pick<FileInfo, 'name' | 'id' | 'kind'>[]).map<FileInfo>(info => ({ ...info, full: info.name + '.ts' }))
        }
    };
};