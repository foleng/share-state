// src/index.ts
import { writable } from "svelte/store";
import { getSharedStore, defineSharedStore } from "@share-state/core";
function useSharedStore(storeConfig) {
  const name = storeConfig.name;
  const store = getSharedStore(name);
  const { subscribe, set } = writable(null);
  const unsubscribe = store.subscribe((newState) => {
    set(newState);
  });
  const currentState = store.getState();
  set(currentState);
  return new Proxy(store, {
    get(target, prop) {
      if (prop === "subscribe") {
        return subscribe;
      }
      if (prop === "destroy") {
        return unsubscribe;
      }
      return target[prop];
    }
  });
}
export {
  defineSharedStore,
  useSharedStore
};
