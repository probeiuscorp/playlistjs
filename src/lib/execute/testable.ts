import { Playable } from ':/components/listen/Playable';

export function pick<T>(array: T[], a?: any, b?: any) {
    if(typeof a === 'number') {
        let sum = 0;
        const arr: { original: T; weight: number }[] = typeof b === 'function'
            ? array.map((item, i, array) => {
                const weight = b(item, i, array);
                sum += weight;
                return {
                    original: item,
                    weight,
                };
            })
            : array.map((item) => ({
                original: item,
                weight: (sum += 1, 1),
            }));

        const picked = new Array<T>(a);
        for(let n=0;n<a;n++) {
            let walk = 0;
            const target = Math.random() * sum;
            for(let i=0;i<arr.length;i++) {
                const { weight, original } = arr[i];
                walk += weight;
                if(target < walk) {
                    picked[n] = original;
                    arr.splice(i, 1);
                    sum -= weight;
                    break;
                }
            }
        }
        return picked;
    } else {
        const len = array.length;
        if(len === 0) return undefined;

        if(a === undefined) {
            return array[Math.floor(Math.random() * len)];
        } else {
            let sum = 0;
            const mapped = new Array(len);
            for(let i=0;i<len;i++) {
                const weight: number = a(array[i], i, array);
                sum += weight;
                mapped[i] = weight;
            }

            let walk = 0;
            const target = Math.random() * sum;
            for(let i=0;i<len;i++) {
                walk += mapped[i];
                if(target < walk) {
                    return array[i];
                }
            }
        }
    }
}

export function shuffle<T>(array: T[]): T[] {
    const copy = array.slice();
    let currentIndex = copy.length, randomIndex: number;
    
    while(currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [copy[currentIndex], copy[randomIndex]] = [copy[randomIndex], copy[currentIndex]];
    }
    
    return copy;
}

export function split<T>(array: T[], index: number): [T[], T[]] {
    return [
        array.slice(0, index),
        array.slice(index),
    ];
}

export function rehead<T>(array: T[], index: number): T[] {
    const [before, after] = split(array, index);
    return [...after, ...before];
}

export function mapsort<T, R>(
    array: T[],
    map: (item: T, index: number, array: T[]) => R,
    compare?: (a: R, b: R) => number,
): T[] {
    let final: { original: any }[];
    const mapped = final = array.map((value, index, array) => ({
        original: value,
        mapped: map(value, index, array),
    }));
    
    if(compare) {
        final = mapped.sort((a, b) => {
            const comparison = compare(a.mapped, b.mapped);
            return typeof comparison === 'number'
                ? comparison
                : comparison
                    ? 1
                    : -1;
        });
    } else {
        final = mapped.sort((a, b) => a.mapped as number - (b.mapped as number));
    }

    return final.map((item) => item.original);
}

export function fromSongLike(songLike: unknown): Playable | undefined {
    // @ts-ignore
    if(songLike === undefined) return undefined;
    let playable: Playable;
    if(typeof songLike === 'string') {
        const [id, paramString = ''] = songLike.split('?', 2);
        const params = new URLSearchParams(paramString);
        const getNumber = (key: string) => {
            const value = params.get(key);
            if(value === null) return undefined;
            const asNumber = Number(value);
            if(isNaN(asNumber)) throw new Error(`fromSongLike("${songLike}"): url param "${key}" is not a valid number`);
            return asNumber;
        };
        playable = {
            kind: 'youtube-video',
            id,
            start: getNumber('start'),
            end: getNumber('end'),
        };
    } else if(typeof songLike === 'object' && songLike !== null) {
        if(fromSongLike.ALREADY_SONG in songLike) return songLike as any;
        const id = (songLike as any)['id'];
        if(typeof id === 'string') {
            const getNumber = (key: string) => {
                const value = (songLike as any)[key];
                if(typeof value === 'undefined') return undefined;
                if(typeof value !== 'number') throw new Error(`fromSongLike(songLike): songLike.${key} should be a number`);
                return value;
            };
            playable = {
                kind: 'youtube-video',
                id,
                start: getNumber('start'),
                end: getNumber('end'),  
            };
        } else {
            throw new Error('fromSongLike(songLike): "id" in songLike is not optional');
        }
    } else {
        throw new Error(`fromSongLike(${songLike}) is not valid: call with a string or an object`);
    }
    // @ts-ignore
    playable[fromSongLike.ALREADY_SONG] = true;
    return playable;
}
fromSongLike.ALREADY_SONG = Symbol('fromSongLike.ALREADY_SONG');