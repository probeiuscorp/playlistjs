import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { log } from './log';

const app = express();
const resources = path.join(process.cwd(), 'resources');
const html = await fs.readFile(path.join(resources, 'index.html')).then(buffer => buffer.toString());

app.use('/dist', express.static(path.join(process.cwd(), 'dist')));
app.use('/public', express.static(path.join(resources, 'public')));
app.get('/', (req, res) => {
    res.send(html);
});

const PORT = 8080;
app.listen(PORT, () => {
    log.status('positive', 'server listening on port', PORT);
});