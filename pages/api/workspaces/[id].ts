import { handler } from ':/lib/handler';
import { WorkspaceDirectory, isWorkspaceDirectory, workspaces } from ':/models/Workspaces';
import { attempt } from ':/util';

export default handler(async (req, res, getUser) => {
    const user = await getUser();
    const id = req.query.id;
    if(typeof id !== 'string')
        return void res.status(400).send('Bad Request');

    if(req.method === 'PUT') {
        const [directory] = attempt<WorkspaceDirectory>(() => JSON.parse(req.body));
        if(directory === undefined)
            return void res.status(400).send('Must send JSON body');
        
        if(!isWorkspaceDirectory(directory))
            return void res.status(400).send('JSON body is not a directory');

        const status = await workspaces.findOneAndUpdate({
            user,
            'data.id': id, 
        }, {
            $set: {
                'data.directory': directory,
            },
            $unset: {
                code: true,
            },
        });
        if(status.ok === 0)
            return void res.status(404).send('Could not find any workspace by that id');

        res.status(200).send('OK');
    } else if(req.method === 'DELETE') {
        await workspaces.deleteOne({
            user,
            'data.id': id,
        });
        res.status(200).send('OK');
    } else {
        res.status(405).send('Method Not Allowed');
    }
});