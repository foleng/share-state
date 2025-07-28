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
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Shared Counter</h1>
      <p>Count: {store.count}</p>
      <button onClick={() => store.increment()}>Increment</button>
      <button onClick={() => store.decrement()}>Decrement</button>
      <button onClick={() => store.incrementBy(5)}>Increment by 5</button>
    </div>
  );
}

export default App;
