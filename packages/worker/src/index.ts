// packages/worker/src/index.ts
/// <reference lib="webworker" />

export type State = Record<string, any>;

export interface StoreConfig<T extends State> {
  name: string;
  state: T;
  actions: {
    [K: string]: (state: T, ...args: any[]) => void;
  };
}

const stores = new Map<string, StoreConfig<any>>();
const ports: MessagePort[] = [];

export function createSharedStore<T extends State>(config: StoreConfig<T>) {
  stores.set(config.name, config);
  return config;
}

function broadcastState(name: string, state: State) {
  ports.forEach(port => {
    port.postMessage({
      type: 'STATE_UPDATE',
      name,
      state,
    });
  });
}

// Type assertion for WorkerGlobalScope
declare const self: SharedWorkerGlobalScope;

self.onconnect = (e: MessageEvent) => {
  const port = e.ports[0];
  ports.push(port);

  port.onmessage = (event: MessageEvent) => {
    const { type, name, actionName, payload } = event.data;

    const store = stores.get(name);
    if (!store) {
      console.warn(`Store "${name}" not found`);
      return;
    }

    if (type === 'ACTION_CALL') {
      const action = store.actions[actionName];
      if (typeof action === 'function') {
        action(store.state, ...payload);
        
        // 广播状态更新给所有连接的客户端
        broadcastState(name, store.state);
      }
    }
  };

  // Use port close event instead of non-existent onclose
  port.addEventListener('close', () => {
    const index = ports.indexOf(port);
    if (index > -1) {
      ports.splice(index, 1);
    }
  });

  port.start();
};