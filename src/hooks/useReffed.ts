import { useEffect, useRef } from 'react';

export function useReffed<T>(v: T): { readonly current: T } {
    const ref = useRef<T>();
    useEffect(() => {
        ref.current = v;
    });
    return ref as any;
}