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
export type WorkspaceData = {
    id: string
    name: string
    directory: WorkspaceDirectory
}
export type Workspace = {
    user: string
    data: WorkspaceData
    code?: string
};

export const isWorkspace = ajv.compile<Workspace>(schema);
export const isWorkspaceDirectory = ajv.compile<WorkspaceDirectory>(schema.properties.directory);
export const workspaces = collection<Workspace>('workspaces');

export async function findWorkspaceById(id: string, user: string | null | undefined) {
    if(user == null) return null;
    return workspaces.findOne({
        'data.id': id,
        user,
    });
}

export async function findWorkspacesByUser(user: string) {
    return workspaces.find({
        user,
    }).toArray();
}

export function createWorkspaceDirectory(): WorkspaceDirectory {
    const main = nanoid();

    return {
        files: [{
            id: main,
            kind: 'file',
            path: './main',
            content: 'Playlist.yield([]);',
            isEntry: true,
        }],
        open: main,
        openFiles: [main],
    };
}