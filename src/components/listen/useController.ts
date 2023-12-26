import { useEffect, useRef, useState } from 'react';
import { Controller, createController } from './controller';
import { Playable } from './Playable';

export function useController(id: string) {
    const [key, setKey] = useState(false);
    const [song, setSong] = useState<Playable | undefined>(undefined);
    const [next, setNext] = useState<Playable | undefined>(undefined);
    const [stage, setStage] = useState<'spawning' | 'pick' | 'picked'>('spawning');
    const controller = useRef<Controller>();
    const [playlists, setPlaylists] = useState<(string | null)[] | undefined>(undefined);

    useEffect(() => {
        let hasBeenCanceled = false;
        (async function(ref) {
            const controller = createController(id);
            ref.current = controller;
            const playlists = await controller.getPlaylists();
            if(hasBeenCanceled) return;

            setStage('pick');
            setPlaylists(playlists);
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
        playlists,
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
            setStage('picked');
            
            const first = await controller.current!.pull();
            setSong(first);

            const next = await controller.current!.pull();
            setNext(next);
        },
    };
}