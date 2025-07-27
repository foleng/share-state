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

<div class="counter">
  <h2>Counter: {$store?.count ?? 0}</h2>
  <div class="buttons">
    <button on:click={store.increment}>+1</button>
    <button on:click={store.decrement}>-1</button>
    <button on:click={incrementBy5}>+5</button>
  </div>
</div>

<style>
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

  button:hover:not(:disabled) {
    background: #f0f0f0;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>