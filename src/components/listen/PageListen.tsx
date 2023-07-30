import React from 'react';
import { Page } from '../Page';
import { WorkspaceData } from ':/models/Workspaces';
import { useController } from './useController';
import { ListenListening } from './ListenListening';
import { Flex } from '@chakra-ui/react';

export function PageListen({ id }: WorkspaceData) {
    const controller = useController(id);

    return (
        <Page title="playback">
            <Flex p={8} flexDirection="column" minHeight="100vh">
                {controller.stage === 'pick' && (
                    controller.playlists?.map((playlist) => (
                        <div key={playlist} onClick={() => controller.setPlaylist(playlist)}>
                            {playlist ?? 'Default'}
                        </div>
                    ))
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