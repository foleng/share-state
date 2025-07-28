<template>
  <div class="flex flex-col items-center p-8">
    <h2 class="text-2xl font-bold mb-4">Counter: {{ store.count }}</h2>
    <div class="flex gap-4 justify-center mt-4">
      <button 
        @click="() => store.increment()" 
        class="px-4 py-2 text-base border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
      >
        +1
      </button>
      <button 
        @click="() => store.decrement()" 
        class="px-4 py-2 text-base border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
      >
        -1
      </button>
      <button 
        @click="() => store.incrementBy(5)" 
        class="px-4 py-2 text-base border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
      >
        +5
      </button>
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