import React from 'react';
import { useSharedStore } from '@share-state/react';

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

function App() {
  const store = useSharedStore<CounterState>('counter');

  if (!store) {
    return <div>Loading store...</div>;
  }

  return (
    <div>
      <h1>Shared Counter</h1>
      <p>Count: {store.count}</p>
      <button onClick={() => store.increment()}>Increment</button>
      <button onClick={() => store.decrement()}>Decrement</button>
    </div>
  );
}

export default App; 