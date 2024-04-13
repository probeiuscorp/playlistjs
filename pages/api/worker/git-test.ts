import { bundle } from ':/lib/bundle';
import { handler } from ':/lib/handler';
import { mkdir, readFile, rm } from 'fs/promises';
import os from 'os';
import { join } from 'path';
import { applyWorkerHeaders, getWorkerCode } from './[id]';
import { exec } from 'child_process';

async function readFileString(path: string) {
    const buffer = await readFile(path);
    return buffer.toString();
}

export function urlToDirectoryName(url: string) {
    return url
        // This doesn't work as "//" maps to the same as "_"
        // .replaceAll(/([^_])_/, '$1__')
        .replaceAll('/', '_');
}

export default handler(async (req, res, getUser) => {
    applyWorkerHeaders(res);
    const url = 'https://github.com/probeiuscorp/playlistjs-sample.git';
    // const branchName = 'main';
    const path = join(os.tmpdir(), urlToDirectoryName(url));
    try {
        // const repository = await Git.Clone(url, path, {
        //     fetchOpts: {
        //         callbacks: {
        //             certificateCheck: () => -1,
        //         },
        //     },
        // });
        // await repository.checkoutBranch(branchName);
        await new Promise((resolve) => {
            exec(`git clone -n --depth=1 --filter=tree:0 "${url}" "${path}" && cd "${path}" && git sparse-checkout set --no-cone src && git checkout`, resolve);
        });
        const code = await bundle([join(path, 'src/main.ts')], readFileString);
        res.send(getWorkerCode(code));
    } finally {
        await rm(path, { force: true, recursive: true })
            .catch(() => undefined);
    }
});
