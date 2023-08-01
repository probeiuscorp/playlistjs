import { handler } from ':/lib/handler';
// @ts-ignore
import testable from ':/lib/execute/testable';
// @ts-ignore
import worker from ':/lib/execute/worker.js.txt';
import { findWorkspaceById, workspaces } from ':/models/Workspaces';
import { bundle } from ':/lib/bundle';
import esbuild from 'esbuild';

const workerSource: string = testable.replace(/export /g, '') + worker.slice(worker.indexOf('\n'));
const minifiedWorker = esbuild.transformSync(workerSource, {
    loader: 'ts',
    minify: true,
}).code;
const [workerBefore, workerAfter] = minifiedWorker.split('/**@license*/');

export default handler(async (req, res, getUser) => {
    res.setHeader('Content-Security-Policy', 'sandbox');
    res.setHeader('Content-Type', 'text/javascript');

    const id = req.query.id;
    if(typeof id !== 'string')
        return void res.status(400).send('Must include :id');

    const user = await getUser();
    const workspace = await findWorkspaceById(id, user);
    if(workspace === null)
        return void res.status(404).send(`No workspace could be found by id="${id}"`);

    const code = workspace.code ?? await bundle(workspace.data.directory);
    res.send(workerBefore + code + workerAfter);
    
    if(workspace.code === undefined) {
        await workspaces.findOneAndUpdate({
            'data.id': id,
        }, {
            $set: {
                code,
            },
        });
    }
});