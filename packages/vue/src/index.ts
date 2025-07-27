import { ref, watchEffect, reactive, type Ref } from 'vue';
import { getSharedStore, type StoreConfig, type State } from '@share-state/core';

export function useSharedStore<T extends State>(storeConfig: StoreConfig<T>) {
  const name = storeConfig.name;
  const store = getSharedStore<T>(name);
  const state: Ref<T | null> = ref(null);

  const unsubscribe = store.subscribe((newState: T) => {
    state.value = newState;
  });

  // 立即同步一次状态
  const currentState = store.getState();
  state.value = currentState;

  // 在组件卸载时取消订阅
  watchEffect((onInvalidate) => {
    onInvalidate(() => {
      unsubscribe();
    });
  });

  // Create a reactive object that combines the state with the store methods
  const reactiveStore: any = reactive({
    get count() {
      return state.value?.count ?? 0;
    }
  });

  // Add all store methods by creating a Proxy
  return new Proxy(reactiveStore, {
    get(target, prop: string) {
      // First check if it's a property we've defined
      if (prop in target) {
        return target[prop];
      }
      // Otherwise, forward to the original store (for actions)
      return store[prop];
    }
  });
}

export { defineSharedStore } from '@share-state/core';
export type { StoreConfig, State } from '@share-state/core';