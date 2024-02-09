import { handler } from ':/lib/handler';
import { isWorkspaceVisibility, workspaces } from ':/models/Workspaces';
import { attempt } from ':/util';

export default handler(async (req, res, getUser) => {
    const user = await getUser();
    if(req.method !== 'POST')
        return void res.status(405).send('Method Not Allowed');

    const id = req.query.id;
    if(typeof id !== 'string')
        return void res.status(400).send('Bad Request');

    const [visibility] = attempt(() => JSON.parse(req.body));
    if(visibility === undefined || typeof visibility !== 'string')
        return void res.status(400).send('Must send a JSON body of a string');

    if(!isWorkspaceVisibility(visibility))
        return void res.status(400).send('Must be valid visibility');

    await workspaces.findOneAndUpdate({
        user,
        'data.id': id,
    }, {
        $set: {
            'data.visibility': visibility,
        },
    });
    res.status(200).send('OK');
});