import { createEventListener } from ':/util';
import { HotkeyInformation, parseHotkey } from ':/util/parseHotkey';
import { useEffect, useMemo } from 'react';

function doesMatchHotkey(information: HotkeyInformation, e: KeyboardEvent, normalizedKey: string) {
    return (
        (information.alt !== !e.altKey) &&
        (information.ctrl !== !e.ctrlKey) &&
        (information.shift !== !e.shiftKey) &&
        (information.keys.some(key => normalizedKey === key))
    );
}

export type RealHotkeyInformation = {
    key: string,
    alt: boolean,
    ctrl: boolean,
    shift: boolean,
    e: KeyboardEvent
};
export function useHotkeys(description: Record<string, (information: RealHotkeyInformation) => void>) {
    const hotkeys = useMemo(() => {
        return Object.entries(description).map(([hotkey, callback]) => {
            const information = parseHotkey(hotkey);
            return {
                information,
                callback,
            };
        });
    }, []);

    useEffect(() => createEventListener('keydown', e => {
        const normalizedKey = e.key.toLowerCase();
        for(const { information } of hotkeys) {
            if(doesMatchHotkey(information, e, normalizedKey)) {
                e.preventDefault();
            }
        }
    }), []);

    useEffect(() => createEventListener('keyup', e => {
        const normalizedKey = e.key.toLowerCase();
        for(const { information, callback } of hotkeys) {
            if(doesMatchHotkey(information, e, normalizedKey)) {
                callback({
                    alt: e.altKey,
                    ctrl: e.ctrlKey,
                    shift: e.shiftKey,
                    key: normalizedKey,
                    e,
                });
                e.preventDefault();
            }
        }
    }), []);
}