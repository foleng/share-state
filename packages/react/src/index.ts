import { useState, useEffect, useMemo } from 'react';
import { getSharedStore } from '../../core/src';

export function useSharedStore<T extends Record<string, any>>(name: string) {
  const store = useMemo(() => getSharedStore<T>(name), [name]);
  const [state, setState] = useState<T | null>(() => store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribe(newState => {
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