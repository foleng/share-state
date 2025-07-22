
---

# ShareState - 跨页面状态管理库

![npm](https://img.shields.io/npm/v/share-state) ![license](https://img.shields.io/badge/license-MIT-blue.svg) ![typescript](https://img.shields.io/badge/language-TypeScript-blue)

**ShareState** 是一个轻量级、类型安全的跨页面（跨 Tab）状态管理库。它借鉴了 `Pinia` 和 `Zustand` 的设计思想，利用浏览器的 `SharedWorker` API，为你提供了一个像使用本地全局状态一样简单的多页面状态同步方案。

在一个标签页中修改状态，所有打开该应用的标签页都会立即响应更新。

[**查看在线 Demo**](#) *(你可以放一个部署好的 Demo 链接在这里)*

## 特性

-   ⚛️ **熟悉的 API**：如果你使用过 Pinia 或 Zustand，你会感到非常亲切。
-   🔗 **跨 Tab 同步**：真正的单一数据源，状态由一个 `SharedWorker` 统一管理。
-   🚀 **轻量且高效**：核心逻辑简洁，通过代理（Proxy）实现无感知的后台通信。
-   🔒 **类型安全**：完全使用 TypeScript 编写，提供一流的自动补全和类型检查。
-   🧩 **框架无关的核心**：虽然提供了 React Hook，但其核心设计可以轻松适配 Vue, Svelte 或原生 JS。
-   🛠️ **易于扩展**：可以轻松集成持久化（如 IndexedDB）、DevTools 等功能。

## 工作原理

ShareState 将状态管理分为两部分：

1.  **Store Host (在 SharedWorker 中)**: 这是真正的“单一数据源”。它维护着完整的 state，并定义了所有修改 state 的 `actions`。当 state 改变时，它会广播给所有连接的客户端。
2.  **Store Client (在主 UI 线程中)**: 这是你在组件中直接交互的部分。它通过一个简单的 Hook (`useSharedStore`) 连接到 Worker，持有一份 state 的副本用于渲染，并将 action 的调用代理到 Worker 执行。

 *(这是一个示例图，你可以自己画一个更贴切的)*

## 安装

```bash
npm install share-state # 假设你发布到了 npm
# 或者直接将 src/lib/ 目录下的文件复制到你的项目中
```

## 快速上手

下面是一个使用 React 的简单示例。

### 1. 定义一个 Store

创建一个文件来定义你的 store。这就像定义一个 Pinia store。

```typescript
// src/store/counter.ts
import { defineSharedStore } from 'share-state/react'; // 假设库路径
import { createSharedStore } from 'share-state/worker';

// 定义 store 的配置
const counterConfig = {
  name: 'counter' as const, // 唯一名称
  state: {
    count: 0,
    lastUpdated: null as string | null,
  },
  actions: {
    increment(state: { count: number }, by = 1) {
      state.count += by;
    },
    // ...其他 actions
  },
};

// 1. 导出类型化的定义，供 React Hook 使用
export const counterStoreDefinition = defineSharedStore(counterConfig);

// 2. 创建 store 实例，供 worker 使用
export const counterStore = createSharedStore(counterConfig);
```

### 2. 配置 Shared Worker

在你的 `public` 目录下创建一个 `shared-worker.js` 文件。这个文件是 Worker 的入口。

```javascript
// public/shared-worker.js
import { workerOnConnect } from '../src/lib/worker.js'; // 调整为你的库路径
import { counterStore } from '../src/store/counter.js'; // 导入你的 store

// 导入 counterStore 会执行 createSharedStore，从而注册它
// 如果有多个 store，都在这里导入

console.log('Shared Worker is running...');

// 设置连接处理器
onconnect = workerOnConnect;
```
**注意**: 如果你使用 Vite，它会自动处理模块导入。对于其他构建工具，你可能需要额外配置。

### 3. 在你的 React 组件中使用

现在，你可以在任何组件中使用 `useSharedStore` Hook 来访问和操作共享状态。

```tsx
// src/components/Counter.tsx
import { useSharedStore } from 'share-state/react';
import { counterStoreDefinition } from '../store/counter';

function Counter() {
  const store = useSharedStore(counterStoreDefinition);

  // 在 store 加载完成前，可以显示一个加载状态
  if (!store) {
    return <div>Loading store...</div>;
  }

  // `store` 对象是完全类型安全的！
  return (
    <div>
      <h1>Count: {store.count}</h1>
      <button onClick={() => store.increment()}>Increment</button>
      <button onClick={() => store.increment(5)}>Increment by 5</button>
    </div>
  );
}
```

现在，在两个不同的浏览器标签页中打开你的应用。在一个页面上点击按钮，你会看到另一个页面的状态也同步更新了！

## API 参考

### `defineSharedStore(config)` (客户端)

一个类型辅助函数，用于创建 store 的定义。它接收一个配置对象并按原样返回，但会捕获其类型信息。

-   `config`:
    -   `name: string`: Store 的唯一标识符。
    -   `state: object`: Store 的初始状态。
    -   `actions: object`: 一个包含所有修改 state 方法的对象。每个 action 函数的第一个参数都是 `state` 对象，你可以直接修改它（内部使用了 Immer-like 的模式）。

### `useSharedStore(storeDefinition)` (React Hook)

React Hook，用于在组件中连接和使用共享 store。

-   `storeDefinition`: 由 `defineSharedStore` 返回的 store 定义对象。
-   **返回值**: 一个类型安全的代理对象，包含了 store 的所有 `state` 属性和 `actions` 方法。在 Worker 首次连接或 state 尚未从 Worker 加载时，返回 `null`。

### `createSharedStore(config)` (Worker 端)

在 Worker 环境中实际创建和注册 store 的函数。

### `workerOnConnect(event)` (Worker 端)

`SharedWorker` 的 `onconnect` 事件处理器，负责管理客户端连接和消息路由。

## 路线图 (Roadmap)

-   [ ] **Vue 3 Composable 支持**: 提供 `useSharedStore` 的 Vue 版本。
-   [ ] **Svelte Store 支持**: 提供符合 Svelte Store 协议的适配器。
-   [ ] **持久化插件**: 轻松将状态同步到 `IndexedDB` 或 `localStorage`。
-   [ ] **DevTools 集成**: 提供浏览器扩展进行状态调试，如状态快照和时间旅行。
-   [ ] **Getters/Selectors**: 支持在 Worker 端定义计算属性。

## 贡献

欢迎提交 PR 和 Issue！如果你有任何想法或建议，请随时开一个 issue 来讨论。

## License

[MIT](./LICENSE)