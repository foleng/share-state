// src/index.ts
import { ref, watchEffect, reactive } from "vue";
import { getSharedStore } from "@share-state/core";
import { defineSharedStore } from "@share-state/core";
function useSharedStore(storeConfig) {
  const name = storeConfig.name;
  const store = getSharedStore(name);
  const state = ref(null);
  const unsubscribe = store.subscribe((newState) => {
    state.value = newState;
  });
  const currentState = store.getState();
  state.value = currentState;
  watchEffect((onInvalidate) => {
    onInvalidate(() => {
      unsubscribe();
    });
  });
  const reactiveStore = reactive({
    get count() {
      return state.value?.count ?? 0;
    }
  });
  return new Proxy(reactiveStore, {
    get(target, prop) {
      if (prop in target) {
        return target[prop];
      }
      return store[prop];
    }
  });
}
export {
  defineSharedStore,
  useSharedStore
};
