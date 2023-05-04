import { createHandler } from ':/lib/mongo';
import { execute } from ':/lib/vm';
import { getPlaylistById } from ':/models/Playlists';

export default createHandler(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');

    if(req.method !== 'GET')
        return void res.status(405).send('Use GET');

    const id = req.query.id;
    if(typeof id !== 'string')
        return void res.status(400).send('Query string param "id" must be a string and is non-optional.');

    const document = await getPlaylistById(id);
    if(document === null)
        return void res.status(404).send(`Could not find any playlist with id "${id}"`);
    
    const yields = await execute(document);
    res.send(yields);
});