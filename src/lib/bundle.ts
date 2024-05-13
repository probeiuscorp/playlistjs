import { WorkspaceFile } from ':/models/Workspaces';
import esbuild from 'esbuild';

export function getDirectoryEntryPoints(files: WorkspaceFile[]) {
    return files.flatMap(({ path, isEntry }) => {
        if(isEntry) {
            return path;
        } else {
            return [];
        }
    });
}

export function getFilesFromInMemory(files: WorkspaceFile[]) {
    const lookup = new Map<string, string>();
    for(const file of files) {
        lookup.set(file.path, file.content);
    }
    return (path: string) => {
        const file = lookup.get(path);
        if(file === undefined) {
            return Promise.reject(`${path} does not exist`);
        } else {
            return file;
        }
    };
}

export async function bundle(entryPoints: string[], getFile: (path: string) => string | Promise<string>) {
    const name = 'Playlist.js';
    const build = await esbuild.build({
        write: false,
        entryPoints,
        bundle: true,
        minify: true,
        plugins: [
            {
                name,
                setup(build) {
                    build.onResolve({
                        filter: /$/,
                    }, (args) => ({
                        path: args.path,
                        namespace: name,
                        sideEffects: false,
                    }));

                    build.onLoad({
                        filter: /$/,
                        namespace: name,
                    }, (args) => Promise.resolve(getFile(args.path)).then((contents) => ({
                        contents,
                        loader: 'ts',
                    })));
                },
            },
        ],
    });
    return build.outputFiles[0].text;
}