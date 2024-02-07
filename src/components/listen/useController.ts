import { useEffect, useRef, useState } from 'react';
import { Controller, ControllerError, createController } from './controller';
import { Playable } from './Playable';
import { attempt } from ':/util';

export type ControllerStage =
    | { type: 'spawning' | 'picked' }
    | { type: 'pick'; playlists: (string | null)[] }
    | { type: 'error'; reason: ControllerError }
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
            const [playlists, error] = await attempt(controller.getPlaylists);
            if(hasBeenCanceled) return;

            if(playlists) {
                setStage({
                    type: 'pick',
                    playlists,
                });
            } else {
                setStage({
                    type: 'error',
                    reason: error as ControllerError,
                });
            }
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