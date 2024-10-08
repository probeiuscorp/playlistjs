import { handler } from ':/lib/handler';
// @ts-ignore
import testable from ':/lib/execute/testable';
// @ts-ignore
import worker from ':/lib/execute/worker.js.txt';
import { Workspace, findWorkspaceById } from ':/models/Workspaces';
import { bundle, getDirectoryEntryPoints, getFilesFromInMemory, transformTypeScriptSync, simpleResolveFileImports } from ':/lib/bundle';
import { BuildFailure } from 'esbuild';
import { WorkspaceBuildFailure } from ':/components/listen/controller';
import { NextApiResponse } from 'next';
import { shallowCloneRef, httpFetchUsing } from 'git-clone-client';

const minifiedWorker = transformTypeScriptSync(simpleResolveFileImports(testable, worker));
const [workerBefore, workerAfter] = minifiedWorker.split('/**@license*/');
export const getWorkerCode = (code: string) => workerBefore + code + workerAfter;

export function applyWorkerHeaders(res: NextApiResponse) {
    res.setHeader('Content-Security-Policy', 'sandbox');
    res.setHeader('Content-Type', 'text/javascript');
}

const extensions = ['', '.ts'];
const cloneRepository = httpFetchUsing(fetch);
async function buildWorkspaceCode(workspace: Workspace) {
    const { data } = workspace;
    if(data.type === 'git') {
        const ref = 'refs/heads/main';
        const repository = data.repositoryUrl;
        const filesList = await shallowCloneRef(ref, {
            makeRequest: cloneRepository(repository),
            filter: (filepath) => filepath.startsWith('src/'),
        });
        const filesMap = new Map(filesList.map(({ filepath, content }) => [filepath, content]));
        return await bundle(['src/main'], (filepath) => {
            for(const extension of extensions) {
                const file = filesMap.get(filepath + extension);
                if(file !== undefined) {
                    return file.toString();
                }
            }
            throw new Error(`No such file '${filepath}'`);
        });
    } else {
        const files = data.directory.files;
        return await bundle(getDirectoryEntryPoints(files), getFilesFromInMemory(files));
    }
}

export default handler(async (req, res, getUser) => {
    const id = req.query.id;
    applyWorkerHeaders(res);
    if(typeof id !== 'string')
        return void res.status(400).send('Must include :id');

    const user = await getUser('optional');
    const workspace = await findWorkspaceById(id, user, 'readonly');
    if(workspace === null)
        return void res.status(404).send(`No workspace could be found by id="${id}"`);

    try {
        const code = await buildWorkspaceCode(workspace);
        res.send(getWorkerCode(code));
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
        } catch(e) {
            console.error('Failed to make worker');
            console.error('Failed to build source', caught);
            console.error('Failed to build error script', e);
            res.status(500).send('Internal Server Error');
        }
    }
});