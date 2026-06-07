import { useEffect, useRef, useState } from 'react';
import { Controller, ControllerError, createController, ToWorkerMessage } from './controller';
import { Playable } from './Playable';
import { invoke } from ':/util';

export type ControllerStage =
    | { type: 'spawning' }
    | { type: 'pick' | 'picked'; playlists: (string | null)[] }
    | { type: 'error'; reason: ControllerError }
export type ButtonDesc = { label: string; id: number };
export function useController(id: string) {
    const [key, setKey] = useState(false);
    const [song, setSong] = useState<Playable | undefined>(undefined);
    const [next, setNext] = useState<Playable | undefined>(undefined);
    const [buttons, setButtons] = useState<ButtonDesc[]>([]);
    const [{ sendMessage }, setSendMessage] = useState<{ sendMessage: (message: ToWorkerMessage) => void }>({ sendMessage: () => undefined });
    const [stage, setStage] = useState<ControllerStage>({ type: 'spawning' });
    const controllerRef = useRef<Controller>();

    useEffect(() => {
        let hasBeenCanceled = false;
        const controller = controllerRef.current = createController(id);
        setSendMessage({ sendMessage: controller.sendMessage });
        const unsubs = [
            controller.bButtons.onValue((buttons) => setButtons(buttons)),
        ];
        controller.getPlaylists().then((playlists): ControllerStage => ({
            type: 'pick',
            playlists,
        }), (err): ControllerStage => ({
            type: 'error',
            reason: err as ControllerError,
        })).then((stage) => {
            if (!hasBeenCanceled) setStage(stage);
        });
        return () => {
            hasBeenCanceled = true;
            unsubs.forEach(invoke);
            controller.close();
        };
    }, [id]);

    return {
        key,
        song,
        next,
        stage,
        buttons,
        sendMessage,
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
        async setPlaylist(playlist: string | null, playlists: (string | null)[]) {
            controllerRef.current!.setPlaylist(playlist);
            setStage({ type: 'picked', playlists });

            const first = await controllerRef.current!.pull();
            setSong(first);

            const next = await controllerRef.current!.pull();
            setNext(next);
        },
        async switchPlaylist(playlists: (string | null)[]) {
            setStage({
                type: 'pick',
                playlists,
            });
        },
    };
}