import React from 'react';

type Song = string | null;
export type PickPlaylistProps = {
    playlists: Song[]
    pick(playlist: Song): void
}
export function PickPlaylist({ playlists, pick }: PickPlaylistProps) {
    return (
        <div>
            {playlists.map((song) => (
                <div key={song} onClick={() => pick(song)}>
                    {song ?? 'Default'}
                </div>
            ))}
        </div>
    );
}