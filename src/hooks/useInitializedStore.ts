import { Store } from ':/types';
import { createStore } from 'jotai/vanilla';
import React, { useMemo } from 'react';

export function useInitializedStore(initialize: (store: Store) => void, deps: React.DependencyList = []) {
    return useMemo(() => {
        const store = createStore();
        initialize(store);
        return store;
    }, deps);
}