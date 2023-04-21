import { useRef } from 'react';

export function useFocus() {
    const ref = useRef<HTMLDivElement>(null);
    
    return {
        ref,
        focus: () => ref.current?.focus(),
    };
}