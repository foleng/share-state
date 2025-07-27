// src/index.ts
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
      console.log("Received STATE_UPDATE:", { name, state });
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
      const state = localStateCache.get(name) || null;
      console.log("getState called, returning:", state);
      return state;
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
      if (prop === "count" && !currentState) {
        return 0;
      }
      if (prop in target) {
        return target[prop];
      }
      return (...args) => {
        if (!worker) {
          console.error("ShareState worker is not available.");
          return;
        }
        const serializableArgs = args.map((arg) => {
          if (arg === null || arg === void 0)
            return arg;
          if (typeof arg === "string" || typeof arg === "number" || typeof arg === "boolean")
            return arg;
          if (Array.isArray(arg))
            return arg;
          if (typeof arg === "object" && arg.constructor === Object)
            return arg;
          return void 0;
        }).filter((arg) => arg !== void 0);
        worker.port.postMessage({
          type: "ACTION_CALL",
          name,
          actionName: prop,
          payload: serializableArgs
        });
      };
    }
  });
  storeProxyCache.set(name, proxy);
  return proxy;
}
function defineSharedStore(config) {
  return config;
}
export {
  defineSharedStore,
  getSharedStore
};
