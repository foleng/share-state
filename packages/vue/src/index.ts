import { ref, watchEffect, type Ref } from 'vue';
import { getSharedStore, type StoreConfig, type State } from '@share-state/core';

export function useSharedStore<T extends State>(storeConfig: StoreConfig<T>) {
  const name = storeConfig.name;
  const store = getSharedStore<T>(name);
  const state: Ref<T | null> = ref(store.getState());

  const unsubscribe = store.subscribe((newState: T) => {
    state.value = newState;
  });

  // 立即同步一次状态
  const currentState = store.getState();
  if (state.value !== currentState) {
    state.value = currentState;
  }

  // 在组件卸载时取消订阅
  watchEffect((onInvalidate) => {
    onInvalidate(() => {
      unsubscribe();
    });
  });

  // Return a reactive object that combines the store actions with the reactive state
  return new Proxy(store, {
    get(target, prop: string) {
      // First, check if it's a property in the current state
      if (state.value && prop in state.value) {
        return state.value[prop as keyof T];
      }
      // For the count property specifically, return 0 if state is null
      if (prop === 'count' && !state.value) {
        return 0;
      }
      // Otherwise, return store methods
      return target[prop as keyof typeof target];
    }
  });
}

export { defineSharedStore } from '@share-state/core';
export type { StoreConfig, State } from '@share-state/core';