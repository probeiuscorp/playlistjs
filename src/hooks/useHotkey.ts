import { createEventListener } from ':/util';
import { HotkeyInformation, parseHotkey } from ':/util/parseHotkey';
import { useEffect, useMemo, useState } from 'react';

export type RealHotkeyInformation = {
    e: KeyboardEvent
    key: string
    alt: boolean
    ctrl: boolean
    shift: boolean
};

export function doesMatchHotkey(information: HotkeyInformation, e: KeyboardEvent, normalizedKey = e.key.toLowerCase()) {
    return (
        (information.alt !== !e.altKey) &&
        (information.ctrl !== !e.ctrlKey) &&
        (information.shift !== !e.shiftKey) &&
        (information.keys.some(key => key === normalizedKey))
    );
}

export function useHotkey(hotkey: string, callback: (description: RealHotkeyInformation) => void, deps: React.DependencyList = []) {
    const [element, setElement] = useState<HTMLElement | null>(null);
    const information = useMemo(() => parseHotkey(hotkey), deps);
    
    useEffect(() => {
        const unsubKeydown = createEventListener('keydown', (e) => {
            if(doesMatchHotkey(information, e)) {
                e.preventDefault();
            }
        }, element);

        const unsubKeyup = createEventListener('keyup', (e) => {
            const normalizedKey = e.key.toLowerCase();
            if(doesMatchHotkey(information, e, normalizedKey)) {
                callback({
                    e,
                    key: normalizedKey,
                    alt: e.altKey,
                    ctrl: e.ctrlKey,
                    shift: e.shiftKey,
                });
            }
        }, element);

        return () => {
            unsubKeydown();
            unsubKeyup();
        };
    }, [element]);

    return setElement;
}