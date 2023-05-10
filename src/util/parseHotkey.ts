export const ALTERNATION_REGEX = /\[(\w+\|?)*\]/;

export type HotkeyInformation = {
    shift: boolean | null
    ctrl: boolean | null
    alt: boolean | null
    keys: string[]
}
export function parseHotkey(hotkey: string): HotkeyInformation {
    const keys: string[] = [];
    let alt: boolean | null = false;
    let ctrl: boolean | null = false;
    let shift: boolean | null = false;

    const parts = hotkey.split(/ ?\+ ?/);
    for(const part of parts) {
        if(/alt\??/.test(part)) {
            alt = part.endsWith('?') ? null : true;
        } else if(/ctrl\??/.test(part)) {
            ctrl = part.endsWith('?') ? null : true;
        } else if(/shift\??/.test(part)) {
            shift = part.endsWith('?') ? null : true;
        } else if(ALTERNATION_REGEX.test(part)) {
            keys.push(...part.slice(1, -1).split('|'));
        } else {
            keys.push(part);
        }
    }

    return {
        alt,
        ctrl,
        shift,
        keys,
    };
}