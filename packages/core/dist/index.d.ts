type State = Record<string, any>;
declare function getSharedStore<T extends State>(name: string): any;

export { getSharedStore };
