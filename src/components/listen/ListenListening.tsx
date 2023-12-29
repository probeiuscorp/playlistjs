import { Box, Center, IconButton } from '@chakra-ui/react';
import React from 'react';
import { VscDebugContinue } from 'react-icons/vsc';
import styles from './ListenListening.module.css';
import { YouTubeThumbnail } from './YouTubeThumbnail';
import { Play, Playable } from './Playable';

export function formatDuration(seconds: number) {
    if(seconds === 0) {
        return '0s';
    } else if(seconds < 10) {
        return seconds.toFixed(1) + 's';
    } else if(seconds < 60) {
        return seconds.toFixed(0) + 's';
    } else {
        const minutes = Math.floor(seconds / 60);
        return `${minutes}m ${Math.floor(seconds % 60)}s`;
    }
}

export type ListenListeningProps = React.PropsWithChildren<{
    playable: Playable
    upcoming: Playable | undefined
    next(): void
    reject(): void
}>;
export function ListenListening({ playable, upcoming, next, reject }: ListenListeningProps) {
    return (
        <div className={styles.container}>
            <div className={styles.videoContainer}>
                <Box className={styles.video}>
                    <Play
                        playable={playable}
                        onDone={next}
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
                {upcoming && (
                    <div className={styles.upcomingContainer}>
                        <div className={styles.upcoming}>
                            {(true && upcoming.kind === 'youtube-video') ? (
                                <YouTubeThumbnail video={upcoming.id}/>
                            ) : (
                                <Center aspectRatio="16 / 11" minH="100%" h={180} fontSize="lg" bg="gray.700" rounded="md">
                                    {formatDuration(upcoming.duration / 1e3)}
                                </Center>
                            )}
                        </div>
                        <IconButton
                            aria-label="Skip upcoming"
                            icon={<VscDebugContinue/>}
                            colorScheme="teal"
                            onClick={reject}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}