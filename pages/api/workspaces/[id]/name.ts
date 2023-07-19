import { handler } from ':/lib/handler';
import { workspaces } from ':/models/Workspaces';
import { attempt } from ':/util';

export default handler(async (req, res, getUser) => {
    const user = await getUser();
    const id = req.query.id;
    if(typeof id !== 'string')
        return void res.status(400).send('Bad Request');

    const [name] = attempt(() => JSON.parse(req.body));
    if(name === undefined || typeof name !== 'string')
        return void res.status(400).send('Must send a JSON body of a string');

    await workspaces.findOneAndUpdate({
        user,
        'data.id': id,
    }, {
        $set: {
            'data.name': name,
        },
    });
});