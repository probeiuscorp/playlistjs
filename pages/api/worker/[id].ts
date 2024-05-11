import { handler } from ':/lib/handler';
// @ts-ignore
import testable from ':/lib/execute/testable';
// @ts-ignore
import worker from ':/lib/execute/worker.js.txt';
import { Workspace, findWorkspaceById, workspaces } from ':/models/Workspaces';
import { bundle, getDirectoryEntryPoints, getFilesFromInMemory } from ':/lib/bundle';
import esbuild, { BuildFailure } from 'esbuild';
import { WorkspaceBuildFailure } from ':/components/listen/controller';
import { NextApiResponse } from 'next';
import { shallowCloneRef, httpFetchUsing } from 'git-clone-client';

const workerSource: string = testable.replace(/export /g, '') + worker.slice(worker.indexOf('\n'));
const minifiedWorker = esbuild.transformSync(workerSource, {
    loader: 'ts',
    minify: true,
}).code;
const [workerBefore, workerAfter] = minifiedWorker.split('/**@license*/');
export const getWorkerCode = (code: string) => workerBefore + code + workerAfter;

export function applyWorkerHeaders(res: NextApiResponse) {
    res.setHeader('Content-Security-Policy', 'sandbox');
    res.setHeader('Content-Type', 'text/javascript');
}

const cloneRepository = httpFetchUsing(fetch);
async function buildWorkspaceCode(workspace: Workspace) {
    const isGitRepository = true;
    if(isGitRepository) {
        const ref = 'refs/heads/main';
        const repository = 'https://github.com/probeiuscorp/playlistjs-sample.git';
        const filesList = await shallowCloneRef(ref, {
            makeRequest: cloneRepository(repository),
            filter: (filepath) => filepath.startsWith('src/'),
        });
        const filesMap = new Map(filesList.map(({ filepath, content }) => [filepath, content]));
        return await bundle(['src/main.ts'], (filepath) => {
            const file = filesMap.get(filepath);
            if(file === undefined) {
                throw new Error(`No such file '${filepath}'`);
            } else {
                return file.toString();
            }
        });
    } else {
        const files = workspace.data.directory.files;
        return await bundle(getDirectoryEntryPoints(files), getFilesFromInMemory(files));
    }
}

export default handler(async (req, res, getUser) => {
    const id = req.query.id;
    if(typeof id !== 'string')
        return void res.status(400).send('Must include :id');

    const user = await getUser('optional');
    const workspace = await findWorkspaceById(id, user, 'readonly');
    if(workspace === null)
        return void res.status(404).send(`No workspace could be found by id="${id}"`);

    try {
        const code = workspace.code ?? await buildWorkspaceCode(workspace);
        res.send(getWorkerCode(code));

        if(workspace.code === undefined) {
            await workspaces.findOneAndUpdate({
                'data.id': id,
            }, {
                $set: {
                    code,
                },
            });
        }
    } catch(caught) {
        try {
            const failure = caught as BuildFailure;
            res.send(`postMessage(${JSON.stringify(JSON.stringify({
                type: 'error',
                reason: failure.errors.map(({ text, location }) => ({
                    location: location ? {
                        file: location.file.slice(location.file.indexOf(':') + 1),
                        line: location.line,
                        column: location.column,
                    } : undefined,
                    message: text,
                })) satisfies WorkspaceBuildFailure,
            }))})`);
        } catch {
            res.status(500).send('Internal Server Error');
        }
    }
});