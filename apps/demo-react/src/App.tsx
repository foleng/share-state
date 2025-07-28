import React from "react";
import { useSharedStore, defineSharedStore } from "@share-state/react";

const counterStore = defineSharedStore({
  name: "counter" as const,
  state: {
    count: 0,
  },
  actions: {
    increment: (state) => {
      state.count++;
    },
    decrement: (state) => {
      state.count--;
    },
    incrementBy: (state, amount: number) => {
      state.count += amount;
    },
  },
});

function App() {
  const store = useSharedStore(counterStore);

  if (!store) {
    return <div>Loading store...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      <header className="bg-white shadow-sm">
        <div className="px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-800">ShareState React Demo</h1>
        </div>
      </header>
      <main className="flex-1 p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
          <h2 className="text-lg font-medium text-center text-gray-700 mb-4">Shared Counter</h2>
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-blue-600 mb-1">{store.count}</div>
            <p className="text-sm text-gray-500">Current Count</p>
          </div>
          <div className="space-y-3 max-w-md mx-auto">
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => store.decrement()} 
                className="bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-3 rounded text-sm transition duration-150 ease-in-out"
              >
                -1
              </button>
              <button 
                onClick={() => store.increment()} 
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 px-3 rounded text-sm transition duration-150 ease-in-out"
              >
                +1
              </button>
              <button 
                onClick={() => store.incrementBy(5)} 
                className="bg-green-100 hover:bg-green-200 text-green-700 font-medium py-2 px-3 rounded text-sm transition duration-150 ease-in-out"
              >
                +5
              </button>
            </div>
            <button 
              onClick={() => store.incrementBy(-store.count)} 
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded text-sm transition duration-150 ease-in-out"
            >
              Reset
            </button>
          </div>
        </div>
      </main>
      <footer className="bg-white border-t py-4">
        <div className="px-4 text-center text-xs text-gray-500">
          <p>ShareState - 轻量级、类型安全的跨页面状态管理库</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
