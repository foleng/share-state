// src/index.ts
import { ref, watchEffect } from "vue";
import { getSharedStore } from "@share-state/core";
import { defineSharedStore } from "@share-state/core";
function useSharedStore(storeConfig) {
  const name = storeConfig.name;
  const store = getSharedStore(name);
  const state = ref(store.getState());
  const unsubscribe = store.subscribe((newState) => {
    state.value = newState;
  });
  const currentState = store.getState();
  if (state.value !== currentState) {
    state.value = currentState;
  }
  watchEffect((onInvalidate) => {
    onInvalidate(() => {
      unsubscribe();
    });
  });
  return new Proxy(store, {
    get(target, prop) {
      if (state.value && prop in state.value) {
        return state.value[prop];
      }
      if (prop === "count" && !state.value) {
        return 0;
      }
      return target[prop];
    }
  });
}
export {
  defineSharedStore,
  useSharedStore
};
