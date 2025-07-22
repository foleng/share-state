// src/index.ts
import { useState, useEffect, useMemo } from "react";

// ../core/src/index.ts
var worker;
var subscribers = /* @__PURE__ */ new Map();
var localStateCache = /* @__PURE__ */ new Map();
var storeProxyCache = /* @__PURE__ */ new Map();
function connect() {
  if (worker)
    return;
  worker = new SharedWorker("/shared-worker.js", { type: "module" });
  worker.port.onmessage = (e) => {
    const { type, name, state } = e.data;
    if (type === "STATE_UPDATE") {
      localStateCache.set(name, state);
      if (subscribers.has(name)) {
        subscribers.get(name).forEach((listener) => listener(state));
      }
    }
  };
  worker.port.start();
}
function getSharedStore(name) {
  connect();
  if (storeProxyCache.has(name)) {
    return storeProxyCache.get(name);
  }
  const store = {
    getState: () => {
      return localStateCache.get(name) || null;
    },
    subscribe: (listener) => {
      if (!subscribers.has(name)) {
        subscribers.set(name, /* @__PURE__ */ new Set());
      }
      subscribers.get(name).add(listener);
      return () => {
        subscribers.get(name)?.delete(listener);
      };
    }
    // actions 将通过 Proxy 提供
  };
  const proxy = new Proxy(store, {
    get(target, prop) {
      const currentState = store.getState();
      if (currentState && prop in currentState) {
        return currentState[prop];
      }
      if (prop in target) {
        return target[prop];
      }
      return (...args) => {
        if (!worker) {
          console.error("ShareState worker is not available.");
          return;
        }
        worker.port.postMessage({
          type: "ACTION_CALL",
          name,
          actionName: prop,
          payload: args
        });
      };
    }
  });
  storeProxyCache.set(name, proxy);
  return proxy;
}

// src/index.ts
function useSharedStore(name) {
  const store = useMemo(() => getSharedStore(name), [name]);
  const [state, setState] = useState(() => store.getState());
  useEffect(() => {
    const unsubscribe = store.subscribe((newState) => {
      setState(newState);
    });
    const currentState = store.getState();
    if (state !== currentState) {
      setState(currentState);
    }
    return () => unsubscribe();
  }, [store]);
  return store;
}
export {
  useSharedStore
};
