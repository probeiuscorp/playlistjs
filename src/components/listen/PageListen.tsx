import React from 'react';
import { Page } from '../Page';
import { WorkspaceData } from ':/models/Workspaces';
import { useController } from './useController';
import { ListenListening } from './ListenListening';
import { Flex } from '@chakra-ui/react';
import { PickPlaylist } from './PickPlaylist';

export function PageListen({ id }: WorkspaceData) {
    const controller = useController(id);

    return (
        <Page title="playback">
            <Flex p={8} flexDirection="column" minHeight="100vh">
                {controller.stage === 'pick' && (
                    controller.playlists ? (
                        <PickPlaylist
                            playlists={controller.playlists}
                            pick={controller.setPlaylist}
                        />
                    ) : 'Loading...'
                )}
                {controller.stage === 'picked' && (
                    <ListenListening
                        video={controller.song}
                        upcoming={controller.next}
                        next={controller.cycle}
                        reject={controller.rejectNext}
                        tag={controller.key}
                    />
                )}
            </Flex>
        </Page>
    );
}