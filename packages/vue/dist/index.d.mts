import { State, StoreConfig } from '@share-state/core';
export { State, StoreConfig, defineSharedStore } from '@share-state/core';

declare function useSharedStore<T extends State>(storeConfig: StoreConfig<T>): any;

export { useSharedStore };
