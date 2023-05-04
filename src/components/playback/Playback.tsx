import React from 'react';
import { Page } from '../Page';
import styles from './Playback.module.css';

export function PagePlayback() {
    return (
        <Page className={styles.container}>
            <div className={styles.nowPlaying}>
                <div className={styles.videoDescription}>
                    <div className={styles.title}>
                        &quot;Never Gonna Give You Up&quot;
                    </div>
                    <div className={styles.subtitle}>
                        by Rick Astley
                    </div>
                </div>
                <div className={styles.video}>
                    video
                </div>
            </div>
            <div className={styles.upNext}>
                <div className={styles.videoDescription}>
                    <div className={styles.upNextLabel}>
                        up next:
                    </div>
                    <div className={styles.title}>
                        Terran Theme 3
                    </div>
                    <div className={styles.subtitle}>
                        by Blizzard
                    </div>
                </div>
                <img
                    src={`img.youtube.com/vi/${'dQw4w9WgXcQ'}/0.jpg`}
                />
                {/* <div className={styles.video}>
                    thumbnail
                </div> */}
            </div>
        </Page>
    );
}