import { handler } from ':/lib/handler';
import { FileKind, WorkspaceData, findWorkspaceById } from ':/models/Workspaces';
import { mkdir, readFile, rm, writeFile } from 'fs/promises';
import { join } from 'path';
import { create } from 'tar';

export function getExtension(kind: FileKind) {
    if(kind === 'file') {
        return '.ts';
    } else {
        return '.md';
    }
}

export async function makeTarFile({ id, directory }: Pick<WorkspaceData, 'id' | 'directory'>) {
    const rootdir = `/tmp/${id}`;
    const srcdir = `${rootdir}/src`;
    try {
        await mkdir(srcdir, { recursive: true });
        const pendingWrites = directory.files.map(({ content, path, kind }) => {
            const extension = getExtension(kind);
            const fullpath = join(srcdir, path) + extension;
            return {
                relative: path + extension,
                fullpath,
                progress: writeFile(fullpath, content),
            };
        });
        await Promise.all(pendingWrites.map(({ progress }) => progress));
        const tarFilePath = `${rootdir}/${id}.tgz`;
        await create({
            cwd: rootdir,
            file: tarFilePath,
            gzip: true,
        }, pendingWrites.map(({ relative }) => `src/${relative}`));
        return readFile(tarFilePath);
    } finally {
        rm(srcdir, { recursive: true }).catch(() => undefined);
    }
}

export default handler(async (req, res, getUser) => {
    const user = await getUser();
    const workspace = await findWorkspaceById(String(req.query.id!), user, 'readonly');
    if(workspace === null)
        return void res.status(404).send('Playlist Not Found');

    const buffer = await makeTarFile(workspace.data);
    res.setHeader('Content-Type', 'application/x-tar');
    res.setHeader('Content-Disposition', `attachment; filename="${workspace.data.name}.tgz"`);
    res.send(buffer);
});
