import React from 'react';
import { useReffed } from './useReffed';
import { useSemanticMemo } from './useSemanticMemo';

export function useEvent(handler: () => void, deps: React.DependencyList) {
    const newestHandler = useReffed(handler);
    const identity = useSemanticMemo(() => newestHandler.current(), deps);
    return identity;
}