// packages/worker/src/index.ts
type State = Record<string, any>;
type Listener = (state: State) => void;

// 单例，管理 Worker 连接和所有 store 的状态
let worker: SharedWorker | undefined;
const subscribers = new Map<string, Set<Listener>>();
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
      return localStateCache.get(name) as T || null;
    },
    subscribe: (listener: Listener): (() => void) => {
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
        worker.port.postMessage({
          type: 'ACTION_CALL',
          name,
          actionName: prop,
          payload: args,
        });
      };
    }
  });

  storeProxyCache.set(name, proxy);
  return proxy;
}

const stores = new Map<string, any>();

stores.set('counter', {
  state: {
    count: 0
  },
  actions: {
    increment(state: { count: number }) {
      state.count++;
    },
    decrement(state: { count: number }) {
      state.count--;
    }
  }
});

self.onconnect = (e: MessageEvent) => {
  const port = e.ports[0];

  port.onmessage = (event: MessageEvent) => {
    const { type, name, actionName, payload } = event.data;

    if (!stores.has(name)) {
      stores.set(name, { state: {}, actions: {} });
    }

    const store = stores.get(name);

    if (type === 'ACTION_CALL') {
      if (store.actions && typeof store.actions[actionName] === 'function') {
        store.actions[actionName](store.state, ...payload);
        // 广播状态更新
        port.postMessage({
          type: 'STATE_UPDATE',
          name,
          state: store.state,
        });
      }
    }
  };

  port.start();
};