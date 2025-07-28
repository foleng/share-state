<template>
  <div class="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
    <h2 class="text-lg font-medium text-center text-gray-700 mb-4">Shared Counter</h2>
    <div class="text-center mb-6">
      <div class="text-4xl font-bold text-green-600 mb-1">{{ store?.count ?? 0 }}</div>
      <p class="text-sm text-gray-500">Current Count</p>
    </div>
    <div class="space-y-3 max-w-md mx-auto">
      <div class="grid grid-cols-3 gap-2">
        <button 
          @click="() => store?.decrement()" 
          :disabled="!store"
          class="bg-red-100 hover:bg-red-200 disabled:bg-red-50 text-red-700 font-medium py-2 px-3 rounded text-sm transition duration-150 ease-in-out"
        >
          -1
        </button>
        <button 
          @click="() => store?.increment()" 
          :disabled="!store"
          class="bg-green-100 hover:bg-green-200 disabled:bg-green-50 text-green-700 font-medium py-2 px-3 rounded text-sm transition duration-150 ease-in-out"
        >
          +1
        </button>
        <button 
          @click="() => store?.incrementBy(5)" 
          :disabled="!store"
          class="bg-emerald-100 hover:bg-emerald-200 disabled:bg-emerald-50 text-emerald-700 font-medium py-2 px-3 rounded text-sm transition duration-150 ease-in-out"
        >
          +5
        </button>
      </div>
      <button 
        @click="() => store?.incrementBy(-(store?.count ?? 0))" 
        :disabled="!store"
        class="w-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded text-sm transition duration-150 ease-in-out"
      >
        Reset
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