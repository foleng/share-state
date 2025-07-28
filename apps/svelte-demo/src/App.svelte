<script lang="ts">
  import Counter from './lib/Counter.svelte'
</script>

<div class="min-h-screen bg-gray-50 flex flex-col">
  <header class="bg-white shadow-sm">
    <div class="px-4 py-4">
      <h1 class="text-xl font-semibold text-gray-800">ShareState Svelte Demo</h1>
    </div>
  </header>
  <main class="flex-1 p-4">
    <Counter />
  </main>
  <footer class="bg-white border-t py-4">
    <div class="px-4 text-center text-xs text-gray-500">
      <p>ShareState - 轻量级、类型安全的跨页面状态管理库</p>
    </div>
  </footer>
</div>