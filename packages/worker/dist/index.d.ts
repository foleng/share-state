type State = Record<string, any>;
interface StoreConfig<T extends State> {
    name: string;
    state: T;
    actions: {
        [K: string]: (state: T, ...args: any[]) => void;
    };
}
declare function createSharedStore<T extends State>(config: StoreConfig<T>): StoreConfig<T>;

export { type State, type StoreConfig, createSharedStore };
