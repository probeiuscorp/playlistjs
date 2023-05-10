import { Playlist } from ':/models/Playlists';
import { all, createTransaction, map } from ':/util';
import { Isolate } from 'isolated-vm';
// @ts-ignore
import stdlibrary from './std.js.txt';

export type PlaylistYield = {
    name: string
    videos: string[]
}
export type Executed = PlaylistYield[];

export async function execute({ directory }: Playlist) {
    const yields: Executed = [];
    const isolate = new Isolate();
    const context = await isolate.createContext();

    await createTransaction((add) => {
        const jail = context.global;
        add(jail.set('global', jail.derefInto()));
        add(jail.set('$$submit', (description: unknown) => {
            if(typeof description === 'string') {
                const [name, ...videos] = description.split('\0');
                yields.push({
                    name,
                    videos,
                });
            }
        }));
        
        add(context.eval(stdlibrary));
    });

    const lookup = Object.fromEntries(
        directory.files
            .filter(file => file.kind === 'file')
            .map(file => [file.path, file.content]),
    );
    const modules = await all(map(lookup, (content) => isolate.compileModule(content)));
    const entries = directory.files.filter(file => file.isEntry).map(file => file.path);
    
    await createTransaction((add) => {
        for(const entry of entries) {
            add(modules[entry].instantiate(context, (specifier) => modules[specifier]));
        }
    });

    await createTransaction((add) => {
        for(const entry of entries) {
            add(modules[entry].evaluate());
        }
    });

    isolate.dispose();
    return yields;
}