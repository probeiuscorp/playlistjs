import { useEffect, useRef, useState } from 'react';
import { Controller, createController } from './controller';
import { Playable } from './Playable';

export type ControllerStage =
    | { type: 'spawning' | 'picked' }
    | { type: 'pick'; playlists: (string | null)[] }
export function useController(id: string) {
    const [key, setKey] = useState(false);
    const [song, setSong] = useState<Playable | undefined>(undefined);
    const [next, setNext] = useState<Playable | undefined>(undefined);
    const [stage, setStage] = useState<ControllerStage>({ type: 'spawning' });
    const controller = useRef<Controller>();

    useEffect(() => {
        let hasBeenCanceled = false;
        (async function(ref) {
            const controller = createController(id);
            ref.current = controller;
            const playlists = await controller.getPlaylists();
            if(hasBeenCanceled) return;

            setStage({
                type: 'pick',
                playlists,
            });
        })(controller);

        return () => {
            hasBeenCanceled = true;
            controller.current?.close();
        };
    }, [id]);

    return {
        key,
        song,
        next,
        stage,
        async rejectNext() {
            const next = await controller.current!.pull();
            setNext(next);
        },
        async cycle() {
            setKey((key) => !key);
            setSong(next);
            const pulled = await controller.current!.pull();
            setNext(pulled);
        },
        async setPlaylist(playlist: string | null) {
            controller.current!.setPlaylist(playlist);
            setStage({ type: 'picked' });
            
            const first = await controller.current!.pull();
            setSong(first);

            const next = await controller.current!.pull();
            setNext(next);
        },
    };
}