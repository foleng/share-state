<template>
  <div class="counter">
    <h2>Counter: {{ store?.count ?? 0 }}</h2>
    <div class="buttons">
      <button @click="() => store?.increment()" :disabled="!store">+1</button>
      <button @click="() => store?.decrement()" :disabled="!store">-1</button>
      <button @click="() => store?.incrementBy(5)" :disabled="!store">+5</button>
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