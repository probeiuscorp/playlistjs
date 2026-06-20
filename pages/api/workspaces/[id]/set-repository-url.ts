import { handler } from ':/lib/handler';
import { workspaces } from ':/models/Workspaces';
import { attempt } from ':/util';
import z from 'zod';

const Body = z.object({
  repositoryUrl: z.string(),
  branch: z.string().optional(),
});
export default handler(async (req, res, getUser) => {
  const user = await getUser();
  if(req.method !== 'POST')
    return void res.status(405).send('Method Not Allowed');

  const id = req.query.id;
  if(typeof id !== 'string')
    return void res.status(400).send('Bad Request');

  const [result] = attempt(() => Body.parse(JSON.parse(req.body)));
  if(result === undefined)
    return void res.status(400).send('Must send a JSON body of a string');

  await workspaces.updateOne({
    user,
    'data.id': id,
  }, {
    $set: {
      'data.type': 'git',
      'data.repositoryUrl': result.repositoryUrl,
      'data.branch': result.branch ?? 'main',
    },
    $unset: {
      'data.directory': true,
    },
  });
  res.status(200).send('OK');
});