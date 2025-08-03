import React, { useState } from 'react';
import { Page } from '../Page';
import { WorkspaceData } from ':/models/Workspaces';
import { useController } from './useController';
import { ListenListening } from './ListenListening';
import { Button, Flex, Text } from '@chakra-ui/react';
import { PickPlaylist } from './PickPlaylist';
import { ControllerError } from './controller';

function LoadingError({ error }: { error: ControllerError}) {
    return (
        <Flex bg="#66000060" p={4} rounded="sm" borderBottom="1px" borderBottomColor="red.200" flexDirection="column" gap={3}>
            {error.type === 'unexpected' ? (
                <div>
                    <Text fontFamily="Manrope">
                        Unexpected error while trying to build:
                    </Text>
                    {error.message ?? 'Could not reach server'}
                </div>
            ) : (
                error.errors.map(({ message, location }, i) => (
                    <div key={i}>
                        <Text fontFamily="Manrope">
                            {location ? (
                                <>Error at {location.file}, line {location.line} col {location.column}:</>
                            ) : (
                                <>Error:</>
                            )}
                        </Text>
                        <pre>
                            {message}
                        </pre>
                    </div>
                ))
            )}
        </Flex>
    );
}

export function PageListen({ id }: WorkspaceData) {
    const controller = useController(id);
    const stage = controller.stage;
    const [autoplay, setAutoplay] = useState(true);

    return (
        <Page title="playback">
            <Flex p={8} flexDirection="column" minHeight="100vh">
                {stage.type === 'spawning' && (
                    'Loading...'
                )}
                {stage.type === 'error' && (
                    <LoadingError error={stage.reason}/>
                )}
                {stage.type === 'pick' && (
                    <PickPlaylist
                        playlists={stage.playlists}
                        pick={(playlist) => controller.setPlaylist(playlist, stage.playlists)}
                    />
                )}
                {stage.type === 'picked' && (
                    <>
                        <Flex pb={2} gap={2}>
                            <Button variant="outline" colorScheme={autoplay ? 'green' : 'blue'} onClick={() => {
                                setAutoplay(!autoplay);
                            }}>
                                Autoplay {autoplay ? 'on' : 'off'}
                            </Button>
                            <Button onClick={() => {
                                controller.switchPlaylist(stage.playlists);
                            }}>
                                Switch playlist
                            </Button>
                        </Flex>
                        {controller.song !== undefined ? (
                            <ListenListening
                                autoplay={autoplay}
                                playable={controller.song}
                                upcoming={controller.next}
                                next={controller.cycle}
                                reject={controller.rejectNext}
                            />
                        ) : (
                            'Playlist ended'
                        )}
                    </>
                )}
            </Flex>
        </Page>
    );
}