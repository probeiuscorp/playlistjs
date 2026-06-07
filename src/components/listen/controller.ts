import { Behavior } from ':/lib/execute/testable';
import { Playable } from './Playable';
import { ButtonDesc } from './useController';

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

export type ExpectedWorkerMessage =
    | { type: 'ready'; playlists: string[] }
    | { type: 'song'; song: Playable }
    | { type: 'error'; reason: WorkspaceBuildFailure }
    | { type: 'button'; label: string; id: number }
export type ToWorkerMessage =
    | { type: 'button-press'; id: number }

export type Controller = ReturnType<typeof createController>;
export function createController(id: string) {
    const worker = new Worker(`/api/worker/${id}`);
    const listeners = new Set<(song: Playable) => void>();
    const [bButtons, setButtons] = Behavior.exec<ButtonDesc[]>([]);

    const pendingPlaylists = new Promise<(string | null)[]>((resolve, reject) => {
        worker.onmessage = (message) => {
            const msg: ExpectedWorkerMessage = JSON.parse(message.data);
            if(msg.type === 'ready') {
                resolve(msg.playlists);
            } else if(msg.type === 'song') {
                for(const listener of listeners) {
                    listener(msg.song);
                }
                listeners.clear();
            } else if(msg.type === 'error') {
                reject({ type: 'expected', errors: msg.reason as WorkspaceBuildFailure } satisfies ControllerError);
            } else if (msg.type === 'button') {
                setButtons([...bButtons.current, msg]);
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
        bButtons,
        sendMessage: (message: ToWorkerMessage) => {
            worker.postMessage(JSON.stringify(message));
        },
    };
}