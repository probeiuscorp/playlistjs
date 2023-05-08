import { compile } from ':/lib/ajv';
import { collection } from ':/lib/mongo';

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
export const isPlaylist = compile<Playlist>({
    type: 'object',
    properties: {
        id: {
            type: 'string',
        },
        directory: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string',
                            },
                            kind: {
                                enum: ['file', 'note'],
                            },
                            path: {
                                type: 'string',
                            },
                            content: {
                                type: 'string',
                            },
                            isEntry: {
                                type: 'boolean',
                            }
                        },
                        required: [
                            'id',
                            'kind',
                            'path',
                            'content',
                            'isEntry',
                        ],
                    },
                },
                openFiles: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                },
                open: {
                    type: 'string',
                },
            },
            required: [
                'files',
                'openFiles',
            ],
        },
    },
    required: [
        'id',
        'directory'
    ],
});

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
        id: playlist.id
    }, playlist);

    return result.modifiedCount === 1;
}