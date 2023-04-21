import { atom, WritableAtom } from 'jotai/vanilla';
import { useSetAtom } from 'jotai/react';
import { falsy, Write } from './types';
import React, { KeyboardEventHandler } from 'react';

export const DROP = Symbol('map()#DROP');
type DROP = typeof DROP;
export const map: {
    <K extends string, V>(keys: K[], transformer: (key: K) => V): Record<K, V>,
    <K extends string, T, V>(record: Record<K, T>, transformer: (value: T, key: K) => V | DROP): Record<K, V>,
    <K, T, V>(map: Map<K, T>, transformer: (value: T, key: K) => V | DROP): Map<K, V>,
    readonly DROP: DROP
} = Object.assign(
    (keys: any, transformer: any): any => {
        let transformed: [string, any][] = [];
        if(Array.isArray(keys)) {
            transformed = keys.map(key => [key, transformer(key)]);
        } else if(keys instanceof Map) {
            const transformed = new Map();
            for(const [k, v] of keys.entries()) {
                if(v !== DROP) transformed.set(k, transformer(v, k));
            }
            return transformed;
        } else {
            transformed = Object
                .entries(transformer)
                .filter(([, value]) => value !== DROP)
                .map(([k, v]) => [k, transformer(v, k)]);
        }
        return Object.fromEntries(transformed.filter(([, value]) => value !== DROP));
    }, { DROP: DROP as DROP }
);

export function merge(className: falsy | string | Record<string, unknown>, ...classNames: (falsy | string)[]): string {
    return [
        typeof className === 'string' || !className
            ? className
            : Object.entries(className).filter(([, v]) => v).map(([k]) => k).join(' '),
        ...classNames
    ].filter(Boolean).join(' ');
}

export const min2max = (a: number, b: number) => a - b;
export const max2min = (a: number, b: number) => b - a;

export async function all<T extends Record<string, any>>(record: T): Promise<{
    [K in keyof T]: Awaited<T[K]>
}> {
    const entries = Object.entries(record);
    const values = await Promise.all(entries.map(([, promise]) => promise));
    const resolved: any = {};

    for(let i=0;i<entries.length;i++) {
        resolved[entries[i][0]] = values[i];
    }

    return resolved as any;
}

export function attempt<T>(executor: () => T): T extends Promise<any> ? Promise<[unknown, Awaited<T> | undefined]> : [unknown, T | undefined] {
    try {
        const r = executor();
        if(r instanceof Promise) {
            // @ts-ignore
            return new Promise(async resolve => {
                try {
                    const v = await r;
                    resolve([undefined, v]);
                } catch(e) {
                    resolve([e, undefined]);
                }
            });
        } else {
            // @ts-ignore
            return [undefined, r];
        }
    } catch(e) {
        // @ts-ignore
        return [e, undefined];
    }
}

export function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const out = <T>(a: T) => (b: T) => a !== b;
export const mod = (a: number, b: number) => ((a % b) + b) % b;
export const isBrowser = () => typeof window !== 'undefined';

export const action = <Args extends unknown[], Result>(
    write: Write<Args, Result>
): WritableAtom<never, Args, Result> => atom(null as never, write);
export const useAction = useSetAtom;

export function createEventListener<T extends keyof WindowEventMap>(event: T, handler: (e: WindowEventMap[T]) => void): () => void {
    window.addEventListener(event, handler);
    return () => window.removeEventListener(event, handler);
}

export const clickSelfOnEnter: KeyboardEventHandler<HTMLElement> = (e) => {
    if(e.key === 'Enter')
        e.currentTarget.click();
};
export type Clicker = (e: React.SyntheticEvent) => void;
export const click = (handle: Clicker): Partial<React.HTMLAttributes<HTMLElement>> => ({
    tabIndex: 0,
    onClick: handle,
    onKeyUp: clickSelfOnEnter
});

export function normalizedMap<TKey, TValue, TArgs extends readonly any[]>(factory: (id: TKey, ...args: TArgs) => TValue) {
    const map = new Map<TKey, TValue>();

    return Object.assign(
        (id: TKey): TValue => {
            const value = map.get(id);
            if(!value) {
                throw new Error(`normalizedMap: no entry for ${id}`);
            }

            return value;
        },
        {
            add(id: TKey, ...args: TArgs) {
                const value = factory(id, ...args);
                map.set(id, value);
            },
            remove(id: TKey) {
                map.delete(id);
            },
        }
    );
}