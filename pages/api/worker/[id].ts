import { handler } from ':/lib/handler';
// @ts-ignore
import protocol from './protocol.js.txt';

export default handler((req, res) => {
    res.setHeader('Content-Security-Policy', 'sandbox');
    res.setHeader('Content-Type', 'text/javascript');

    const code = 'Playlist.yield(function*() {while(true){yield \'dQw4w9WgXcQ\'; yield \'FR7wOGyAzpw\';yield \'I-sH53vXP2A\';}})\n';
    res.send(protocol.replace('/*$$$*/', code));
});