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
    const controllerRef = useRef<Controller>();

    useEffect(() => {
        let hasBeenCanceled = false;
        const controller = controllerRef.current = createController(id);
        void async function() {
            const playlists = await controller.getPlaylists();
            if(hasBeenCanceled) return;

            setStage({
                type: 'pick',
                playlists,
            });
        }();
        return () => {
            hasBeenCanceled = true;
            controller.close();
        };
    }, [id]);

    return {
        key,
        song,
        next,
        stage,
        async rejectNext() {
            const next = await controllerRef.current!.pull();
            setNext(next);
        },
        async cycle() {
            setKey((key) => !key);
            setSong(next);
            const pulled = await controllerRef.current!.pull();
            setNext(pulled);
        },
        async setPlaylist(playlist: string | null) {
            controllerRef.current!.setPlaylist(playlist);
            setStage({ type: 'picked' });
            
            const first = await controllerRef.current!.pull();
            setSong(first);

            const next = await controllerRef.current!.pull();
            setNext(next);
        },
    };
}