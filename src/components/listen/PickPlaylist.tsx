import { Button, Flex } from '@chakra-ui/react';
import React from 'react';

type Song = string | null;
export type PickPlaylistProps = {
    playlists: Song[]
    pick(playlist: Song): void
}
export function PickPlaylist({ playlists, pick }: PickPlaylistProps) {
    return (
        <Flex gap={2}>
            {playlists.map((song) => (
                <Button key={song} onClick={() => pick(song)}>
                    {song ?? 'Default'}
                </Button>
            ))}
        </Flex>
    );
}