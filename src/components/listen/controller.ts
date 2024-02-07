import { Playable } from './Playable';

export type WorkspaceBuildFailure = {
    location?: {
        file: string
        line: number
        column: number
    }
    message: string
}[];
export type ControllerError =
    | { type: 'unexpected'; message?: string }
    | { type: 'expected'; errors: WorkspaceBuildFailure }

export type Controller = ReturnType<typeof createController>;
export function createController(id: string) {
    const worker = new Worker(`/api/worker/${id}`);
    const listeners = new Set<(song: Playable) => void>();

    const pendingPlaylists = new Promise<(string | null)[]>((resolve, reject) => {
        worker.onmessage = (message) => {
            const msg = JSON.parse(message.data);
            if(msg.type === 'ready') {
                const playlists: string[] = msg.playlists;
                resolve(playlists);
            } else if(msg.type === 'song') {
                for(const listener of listeners) {
                    listener(msg.song);
                }
                listeners.clear();
            } else if(msg.type === 'error') {
                reject({ type: 'expected', errors: msg.reason as WorkspaceBuildFailure } satisfies ControllerError);
            }
        };
    });
    const pendingWorkersFail = new Promise<never>((_resolve, reject) => {
        worker.addEventListener('error', ({ error, message }) => reject({ type: 'unexpected', message: message ?? (error ? String(error) : undefined) } satisfies ControllerError));
    });

    return {
        getPlaylists: () => Promise.race([pendingPlaylists, pendingWorkersFail]),
        setPlaylist(playlist: string | null) {
            worker.postMessage(JSON.stringify({
                type: 'play',
                playlist,
            }));
        },
        pull: () => new Promise<Playable>((resolve) => {
            worker.postMessage('{"type":"pull"}');
            listeners.add(resolve);
        }),
        close: () => worker.terminate(),
    };
}