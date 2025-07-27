import { useState, useEffect, useMemo } from 'react';
import { getSharedStore, defineSharedStore, type StoreConfig, type State } from '@share-state/core';

export function useSharedStore<T extends State>(storeConfig: StoreConfig<T>) {
  const name = storeConfig.name;
  const store = useMemo(() => getSharedStore<T>(name), [name]);
  const [state, setState] = useState<T | null>(() => store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribe((newState: T) => {
      setState(newState);
    });

    const currentState = store.getState();
    if (state !== currentState) {
      setState(currentState);
    }
    
    return () => unsubscribe();
  }, [store]);

  return store;
}

export { defineSharedStore };
export type { StoreConfig, State };