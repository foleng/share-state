<script lang="ts">
  import Counter from './lib/Counter.svelte'
</script>

<main>
  <h1>ShareState Svelte Demo</h1>
  <Counter />
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }
</style>