// src/index.ts
import { useState, useEffect, useMemo } from "react";
import { getSharedStore, defineSharedStore } from "@share-state/core";
function useSharedStore(storeConfig) {
  const name = storeConfig.name;
  const store = useMemo(() => getSharedStore(name), [name]);
  const [state, setState] = useState(() => store.getState());
  useEffect(() => {
    const unsubscribe = store.subscribe((newState) => {
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
export {
  defineSharedStore,
  useSharedStore
};
