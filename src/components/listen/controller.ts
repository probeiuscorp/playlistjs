import { Playable } from './Playable';

export type Controller = ReturnType<typeof createController>;
export function createController(id: string) {
    const worker = new Worker(`/api/worker/${id}`);
    const listeners = new Set<(song: Playable) => void>();

    const pendingPlaylists = new Promise<(string | null)[]>((resolve) => {
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
            }
        };
    });

    return {
        getPlaylists: () => pendingPlaylists,
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