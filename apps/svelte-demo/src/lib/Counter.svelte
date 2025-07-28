<script lang="ts">
  import { useSharedStore, defineSharedStore } from '@share-state/svelte'

  const counterStore = defineSharedStore({
    name: 'counter',
    state: { count: 0 },
    actions: {
      increment(state) {
        state.count += 1
      },
      decrement(state) {
        state.count -= 1
      },
      incrementBy(state, amount) {
        state.count += amount
      },
    },
  })

  const store = useSharedStore(counterStore)

  function incrementBy5() {
    store.incrementBy(5)
  }
</script>

<div class="flex flex-col items-center p-8">
  <h2 class="text-2xl font-bold mb-4">Counter: {$store?.count ?? 0}</h2>
  <div class="flex gap-4 justify-center mt-4">
    <button 
      on:click={store.increment}
      class="px-4 py-2 text-base border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
    >
      +1
    </button>
    <button 
      on:click={store.decrement}
      class="px-4 py-2 text-base border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
    >
      -1
    </button>
    <button 
      on:click={incrementBy5}
      class="px-4 py-2 text-base border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
    >
      +5
    </button>
  </div>
</div>

