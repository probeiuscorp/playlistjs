import { collection } from ':/lib/mongo';
import schema from './Workspace.json';
import { ajv } from ':/lib/ajv';
import { nanoid } from 'nanoid';

export type FileKind = 'file' | 'note';
export type WorkspaceFile = {
    id: string
    kind: FileKind
    path: string
    content: string
    isEntry: boolean
};
export type WorkspaceDirectory = {
    files: WorkspaceFile[]
    openFiles: string[]
    open?: string
};
const workspaceVisibility = ['public', 'private'] as const;
export type WorkspaceVisibility = (typeof workspaceVisibility)[number];
export const isWorkspaceVisibility = (value: unknown): value is WorkspaceVisibility => workspaceVisibility.includes(value as WorkspaceVisibility);

export type WorkspaceData = ({
    id: string
    name: string
    visibility?: WorkspaceVisibility
}) & ({
    type: 'git'
    repositoryUrl: string
} | {
    type: 'hosted'
    directory: WorkspaceDirectory
});
export type WorkspaceDataHosted = WorkspaceData & { type: 'hosted' };
export type Workspace = {
    user: string
    data: WorkspaceData
    code?: string
};

export const isWorkspaceDirectory = ajv.compile<WorkspaceDirectory>(schema.properties.directory);
export const workspaces = collection<Workspace>('workspaces');

export async function findWorkspaceById(id: string, user: string | null | undefined, access: 'readonly' | 'write' = 'write') {
    if(access === 'write') {
        if(user == null) return null;
        return workspaces.findOne({
            'data.id': id,
            user,
        });
    } else {
        if(user == null) {
            return workspaces.findOne({
                'data.id': id,
                'data.visibility': 'public',
            });
        } else {
            return workspaces.findOne({
                'data.id': id,
                $or: [{
                    user,
                }, {
                    'data.visibility': 'public',
                }],
            });
        }
    }
}

export async function findWorkspacesByUser(user: string) {
    return workspaces.find({
        user,
    }).toArray();
}

const initialWorkspaceContent = `\
// Get ID of the YouTube video, such as: youtube.com/watch?v=dQw4w9WgXcQ
const song = 'dQw4w9WgXcQ';

// Any iterable will do
Playlist.yield([song]);

// Provide a name to yield multiple playlists
Playlist.yield('forever', function*() {
    while(true) {
        yield song;
    }
});
`;
export function createWorkspaceDirectory(): WorkspaceDirectory {
    const main = nanoid();

    return {
        files: [{
            id: main,
            kind: 'file',
            path: './main',
            content: initialWorkspaceContent,
            isEntry: true,
        }],
        open: main,
        openFiles: [main],
    };
}