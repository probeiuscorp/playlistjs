import { handler } from ':/lib/handler';
import { Workspace, createWorkspaceDirectory, findWorkspacesByUser, workspaces } from ':/models/Workspaces';
import { nanoid } from 'nanoid';

export default handler(async (req, res, getUser) => {
    const user = await getUser();
    if(req.method === 'GET') {
        const workspaces = await findWorkspacesByUser(user);
        res.json(workspaces.map((workspace) => workspace.data));
    } else if(req.method === 'POST') {
        const id = nanoid();
        const name = 'Workspace';
        const newWorkspace: Workspace = {
            user,
            data: {
                id,
                name,
                directory: createWorkspaceDirectory(),
            },
        };
        await workspaces.insertOne(newWorkspace);
        res.json(newWorkspace.data);
    } else if(req.method === 'DELETE') {
        await workspaces.deleteMany({
            user,
        });
        res.send(200);
    } else {
        res.status(505).send('Method Not Allowed');
    }
});