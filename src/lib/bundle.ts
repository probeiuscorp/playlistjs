import { WorkspaceDirectory } from ':/models/Workspaces';
import esbuild from 'esbuild';

export async function bundle(directory: WorkspaceDirectory) {
    const entries: { in: string; out: string }[] = [];
    const map = new Map<string, string>();
    for(const file of directory.files) {
        map.set(file.path, file.content);
        if(file.isEntry) {
            entries.push({
                in: file.path,
                out: '',
            });
        }
    }

    const name = 'Playlist.js';
    const build = await esbuild.build({
        write: false,
        entryPoints: entries,
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
                    }, (args) => ({
                        contents: map.get(args.path),
                        loader: 'ts',
                    }));
                },
            },
        ],
    });
    return build.outputFiles[0].text;
}