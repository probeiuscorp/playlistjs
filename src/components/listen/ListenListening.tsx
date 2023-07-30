import { Box, IconButton } from '@chakra-ui/react';
import React from 'react';
import { VscDebugContinue } from 'react-icons/vsc';
import YouTube from 'react-youtube';
import styles from './ListenListening.module.css';
import { YouTubeThumbnail } from './YouTubeThumbnail';

export type ListenListeningProps = {
    tag: unknown
    video: string | undefined
    upcoming: string | undefined
    next(): void
    reject(): void
}
export function ListenListening({ tag, video, upcoming, next, reject }: ListenListeningProps) {
    return (
        <div className={styles.container}>
            <div className={styles.videoContainer}>
                <Box className={styles.video}>
                    <YouTube
                        style={{ height: '100%' }}
                        videoId={video}
                        onEnd={next}
                        opts={{
                            playerVars: {
                                autoplay: 1,
                            },
                        }}
                        key={String(tag)}
                    />
                </Box>
                <IconButton
                    aria-label="Next"
                    icon={<VscDebugContinue/>}
                    colorScheme="teal"
                    onClick={next}
                />
            </div>
            <div className={styles.aboutUpcoming}>
                <Box textAlign="center">
                    Next Up
                </Box>
                <div className={styles.upcomingContainer}>
                    <div className={styles.upcoming}>
                        <YouTubeThumbnail video={upcoming ?? ''}/>
                    </div>
                    <IconButton
                        aria-label="Skip upcoming"
                        icon={<VscDebugContinue/>}
                        colorScheme="teal"
                        onClick={reject}
                    />
                </div>
            </div>
        </div>
    );
}