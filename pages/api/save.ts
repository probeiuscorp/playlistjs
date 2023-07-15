import { createHandler } from ':/lib/mongo';
import { isPlaylist, updatePlaylist } from ':/models/Playlists';
import { attempt } from ':/util';

export const config = {
    runtime: 'edge',
};

export default createHandler(async (req, res) => {
    if(req.method !== 'POST')
        return void res.status(405).send('Use POST');
    
    const [body] = attempt(() => JSON.parse(req.body));
    if(body === undefined)
        return void res.status(400).send('A JSON body must be sent');

    if(!isPlaylist(body))
        return void res.status(400).send('You are an idiot');
    
    const wasSuccessful = await updatePlaylist(body);
    if(!wasSuccessful)
        return void res.status(404).send(`Could not find any playlist with ID "${body.id}"`);

    res.status(200).send('');
});