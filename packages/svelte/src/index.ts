import { writable } from 'svelte/store';
import { getSharedStore, defineSharedStore, type StoreConfig, type State } from '@share-state/core';

export function useSharedStore<T extends State>(storeConfig: StoreConfig<T>) {
  const name = storeConfig.name;
  const store = getSharedStore<T>(name);
  
  const { subscribe, set } = writable<T | null>(store.getState());

  const unsubscribe = store.subscribe((newState: T) => {
    set(newState);
  });

  // 立即同步一次状态
  const currentState = store.getState();
  set(currentState);

  // 返回一个结合了Svelte store和原始store功能的对象
  // 使用Proxy来确保我们可以访问store的所有属性和方法
  return new Proxy(store, {
    get(target, prop: string) {
      // 如果是subscribe属性，返回Svelte store的subscribe方法
      if (prop === 'subscribe') {
        return subscribe;
      }
      // 如果是destroy属性，返回unsubscribe函数
      if (prop === 'destroy') {
        return unsubscribe;
      }
      // 否则返回原始store的属性
      return target[prop as keyof typeof target];
    }
  });
}

export { defineSharedStore };
export type { StoreConfig, State } from '@share-state/core';