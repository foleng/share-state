// src/index.ts
var stores = /* @__PURE__ */ new Map();
var ports = [];
function createSharedStore(config) {
  stores.set(config.name, config);
  return config;
}
function broadcastState(name, state) {
  ports.forEach((port) => {
    port.postMessage({
      type: "STATE_UPDATE",
      name,
      state
    });
  });
}
self.onconnect = (e) => {
  const port = e.ports[0];
  ports.push(port);
  port.onmessage = (event) => {
    const { type, name, actionName, payload } = event.data;
    const store = stores.get(name);
    if (!store) {
      console.warn(`Store "${name}" not found`);
      return;
    }
    if (type === "ACTION_CALL") {
      const action = store.actions[actionName];
      if (typeof action === "function") {
        action(store.state, ...payload);
        broadcastState(name, store.state);
      }
    }
  };
  port.addEventListener("close", () => {
    const index = ports.indexOf(port);
    if (index > -1) {
      ports.splice(index, 1);
    }
  });
  port.start();
};
export {
  createSharedStore
};
