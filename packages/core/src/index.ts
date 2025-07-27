export type State = Record<string, any>;

export interface StoreConfig<T extends State> {
  name: string;
  state: T;
  actions: {
    [K: string]: (state: T, ...args: any[]) => void;
  };
}

type Listener<S extends State> = (state: S) => void;

// 单例，管理 Worker 连接和所有 store 的状态
let worker: SharedWorker | undefined;
const subscribers = new Map<string, Set<Listener<any>>>();
const localStateCache = new Map<string, State>();
const storeProxyCache = new Map<string, any>();

function connect() {
  if (worker) return;

  // 在现代浏览器和 Vite 中，`{ type: 'module' }` 是关键
  worker = new SharedWorker('/shared-worker.js', { type: 'module' });

  worker.port.onmessage = (e: MessageEvent) => {
    const { type, name, state } = e.data;
    if (type === 'STATE_UPDATE') {
      localStateCache.set(name, state);
      if (subscribers.has(name)) {
        subscribers.get(name)!.forEach(listener => listener(state));
      }
    }
  };
  worker.port.start();
}

export function getSharedStore<T extends State>(name: string) {
  connect();

  if (storeProxyCache.has(name)) {
    return storeProxyCache.get(name);
  }

  const store = {
    getState: (): T | null => {
      const state = localStateCache.get(name) as T || null;
      console.log('getState called, returning:', state);
      return state;
    },
    subscribe: (listener: Listener<T>): (() => void) => {
      if (!subscribers.has(name)) {
        subscribers.set(name, new Set());
      }
      subscribers.get(name)!.add(listener);
      // 返回一个取消订阅的函数
      return () => {
        subscribers.get(name)?.delete(listener);
      };
    },
    // actions 将通过 Proxy 提供
  };

  const proxy = new Proxy(store, {
    get(target, prop: string) {
      const currentState = store.getState();
      // 优先返回 state 上的属性
      if (currentState && prop in currentState) {
        return currentState[prop as keyof T];
      }
      // 对于计数器示例，如果状态尚未加载，返回默认值
      if (prop === 'count' && !currentState) {
        return 0;
      }
      // 其次返回 store 自己的方法 (getState, subscribe)
      if (prop in target) {
        return target[prop as keyof typeof store];
      }
      // 最后，认为它是一个 action 调用
      return (...args: any[]) => {
        if (!worker) {
          console.error("ShareState worker is not available.");
          return;
        }
        // Filter out non-serializable arguments like event objects
        const serializableArgs = args.map(arg => {
          // Allow primitive types, plain objects, and arrays
          if (arg === null || arg === undefined) return arg;
          if (typeof arg === 'string' || typeof arg === 'number' || typeof arg === 'boolean') return arg;
          if (Array.isArray(arg)) return arg;
          // Check if it's a plain object (not an event or other non-serializable object)
          if (typeof arg === 'object' && arg.constructor === Object) return arg;
          // For all other cases (including event objects), return undefined
          return undefined;
        }).filter(arg => arg !== undefined);
        worker.port.postMessage({
          type: 'ACTION_CALL',
          name,
          actionName: prop,
          payload: serializableArgs,
        });
      };
    }
  });

  storeProxyCache.set(name, proxy);
  return proxy;
}

export function defineSharedStore<T extends State>(config: StoreConfig<T>) {
  return config;
}