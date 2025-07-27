<template>
  <div class="counter">
    <h2>Counter: {{ store.count }}</h2>
    <div class="buttons">
      <button @click="() => store.increment()">+1</button>
      <button @click="() => store.decrement()">-1</button>
      <button @click="() => store.incrementBy(5)">+5</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineSharedStore, useSharedStore } from '@share-state/vue'

const counterStore = defineSharedStore({
  name: 'counter' as const,
  state: { count: 0 },
  actions: {
    increment(state) {
      state.count += 1
    },
    decrement(state) {
      state.count -= 1
    },
    incrementBy(state, amount: number) {
      state.count += amount
    },
  },
})

const store = useSharedStore(counterStore)
</script>

<style scoped>
.counter {
  text-align: center;
  padding: 2rem;
}

.buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

button:hover {
  background: #f0f0f0;
}
</style>