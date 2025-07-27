# ShareState 使用指南

ShareState 是一个轻量级、类型安全的跨页面（跨 Tab）状态管理库，支持 React、Vue 和 Svelte。

## 安装

### 核心包
```bash
npm install @share-state/core @share-state/worker
```

### React
```bash
npm install @share-state/react
```

### Vue 3
```bash
npm install @share-state/vue
```

### Svelte
```bash
npm install @share-state/svelte
```

## 快速开始

### 1. 定义 Store

创建一个新的文件来定义你的 store：

#### React
```typescript
// src/store/counter.ts
import { defineSharedStore } from '@share-state/react';

export const counterStore = defineSharedStore({
  name: 'counter' as const,
  state: {
    count: 0,
    user: { name: '', age: 0 }
  },
  actions: {
    increment(state) {
      state.count += 1;
    },
    setUser(state, user: { name: string; age: number }) {
      state.user = user;
    },
  },
});
```

#### Vue 3
```typescript
// src/store/counter.ts
import { defineSharedStore } from '@share-state/vue';

export const counterStore = defineSharedStore({
  name: 'counter' as const,
  state: {
    count: 0,
  },
  actions: {
    increment(state) {
      state.count += 1;
    },
    incrementBy(state, amount: number) {
      state.count += amount;
    },
  },
});
```

#### Svelte
```typescript
// src/store/counter.ts
import { defineSharedStore } from '@share-state/svelte';

export const counterStore = defineSharedStore({
  name: 'counter' as const,
  state: {
    count: 0,
  },
  actions: {
    increment(state) {
      state.count += 1;
    },
    reset(state) {
      state.count = 0;
    },
  },
});
```

### 2. 配置 Shared Worker

创建 `public/shared-worker.js`：

```javascript
import { createSharedStore } from '@share-state/worker';

// 导入所有 store 定义
import { counterStore } from '../src/store/counter.js';

// 创建 store 实例
createSharedStore(counterStore);

// 可以添加更多 store
// createSharedStore(otherStore);

console.log('Shared Worker is running...');
```

### 3. 在组件中使用

#### React
```typescript
// src/components/Counter.tsx
import React from 'react';
import { useSharedStore } from '@share-state/react';
import { counterStore } from '../store/counter';

function Counter() {
  const store = useSharedStore(counterStore);

  if (!store) {
    return <div>Loading store...</div>;
  }

  return (
    <div>
      <h1>Count: {store.count}</h1>
      <button onClick={() => store.increment()}>Increment</button>
      <button onClick={() => store.setUser({ name: 'Alice', age: 30 })}>Set User</button>
    </div>
  );
}
```

#### Vue 3
```vue
<template>
  <div class="counter">
    <h2>Counter: {{ store.count }}</h2>
    <button @click="store.increment">+1</button>
    <button @click="incrementBy5">+5</button>
  </div>
</template>

<script setup lang="ts">
import { counterStore } from './store/counter'
import { useSharedStore } from '@share-state/vue'

const store = useSharedStore(counterStore)

function incrementBy5() {
  store.incrementBy(5)
}
</script>
```

#### Svelte
```svelte
<script lang="ts">
  import { counterStore } from './store/counter'
  import { useSharedStore } from '@share-state/svelte'

  const store = useSharedStore(counterStore)

  function incrementBy5() {
    store.incrementBy(5)
  }
</script>

<div class="counter">
  <h2>Counter: {$store?.count ?? 'Loading...'}</h2>
  <button on:click={store.increment} disabled={!$store}>+1</button>
  <button on:click={incrementBy5} disabled={!$store}>+5</button>
</div>
```

## API 参考

### defineSharedStore(config)

创建 store 的配置对象。

- **config.name**: string - store 的唯一标识符
- **config.state**: object - 初始状态
- **config.actions**: object - 包含所有修改 state 的方法

### useSharedStore(storeConfig)

框架特定的 Hook，用于连接和使用共享 store。

- **storeConfig**: 由 defineSharedStore 返回的配置对象
- **返回值**: 类型安全的代理对象，包含所有 state 属性和 actions 方法

## 注意事项

1. **浏览器支持**: 需要支持 SharedWorker 的现代浏览器
2. **HTTPS**: 在生产环境中需要 HTTPS 才能正常工作
3. **开发服务器**: 使用 Vite、Webpack 等现代构建工具
4. **类型安全**: 完全支持 TypeScript

## 示例

查看 `examples/` 目录中的完整示例：
- `examples/vue-demo/` - Vue 3 示例
- `examples/svelte-demo/` - Svelte 示例
- `apps/demo-react/` - React 示例