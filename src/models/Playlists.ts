import { collection } from ':/lib/mongo';
import schema from './Playlist.json';
import { ajv } from ':/lib/ajv';

export type FileKind = 'file' | 'note';
export type PlaylistFile = {
    id: string
    kind: FileKind
    path: string
    content: string
    isEntry: boolean
};
export type PlaylistDirectory = {
    files: PlaylistFile[]
    openFiles: string[]
    open?: string
};
export type Playlist = {
    id: string
    directory: PlaylistDirectory
};

export const isPlaylist = ajv.compile<Playlist>(schema);
const pending = collection<Playlist>('playlists');

export async function getPlaylistById(id: string) {
    const playlists = await pending;
    return playlists.findOne({ id });
}

/**
 * @returns `true` if the `playlist.id` was successfully updated
 */
export async function updatePlaylist(playlist: Playlist) {
    const playlists = await pending;
    const result = await playlists.replaceOne({
        id: playlist.id,
    }, playlist);

    return result.modifiedCount === 1;
}