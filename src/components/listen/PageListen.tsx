import React from 'react';
import { Page } from '../Page';
import { WorkspaceData } from ':/models/Workspaces';
import { useController } from './useController';
import { ListenListening } from './ListenListening';
import { Flex } from '@chakra-ui/react';
import { PickPlaylist } from './PickPlaylist';

export function PageListen({ id }: WorkspaceData) {
    const controller = useController(id);
    const stage = controller.stage;

    return (
        <Page title="playback">
            <Flex p={8} flexDirection="column" minHeight="100vh">
                {stage.type === 'spawning' && (
                    'Loading...'
                )}
                {stage.type === 'pick' && (
                    <PickPlaylist
                        playlists={stage.playlists}
                        pick={controller.setPlaylist}
                    />
                )}
                {stage.type === 'picked' && (
                    controller.song !== undefined ? (
                        <ListenListening
                            playable={controller.song}
                            upcoming={controller.next}
                            next={controller.cycle}
                            reject={controller.rejectNext}
                        />
                    ) : (
                        'Playlist ended'
                    )
                )}
            </Flex>
        </Page>
    );
}