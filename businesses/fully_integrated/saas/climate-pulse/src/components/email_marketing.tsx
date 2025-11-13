import React, { useState } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementBy?: number;
  maxCount?: number;
  minCount?: number;
}

const Counter: React.FC<CounterProps> = ({ initialCount = 0, incrementBy = 1, maxCount, minCount }) => {
  /**
   * A counter component for tracking email marketing campaign performance.
   * Supports customizable maximum and minimum counts, and increment step.
   */
  const [count, setCount] = useState(initialCount);

  const handleIncrement = () => {
    const validIncrement = typeof incrementBy === 'number' && incrementBy > 0 ? incrementBy : 1;
    if (maxCount && count >= maxCount) return;
    setCount(prevCount => Math.min(prevCount + validIncrement, maxCount || Number.MAX_SAFE_INTEGER));
  };

  const handleDecrement = () => {
    const validDecrement = typeof incrementBy === 'number' && incrementBy > 0 ? incrementBy : 1;
    if (minCount && count <= minCount) return;
    setCount(prevCount => Math.max(prevCount - validDecrement, minCount || 0));
  };

  return (
    <div>
      <p>Email Campaign Performance: {count}</p>
      <button aria-label="Increment counter" onClick={handleIncrement}>Increment</button>
      <button aria-label="Decrement counter" onClick={handleDecrement}>Decrement</button>
    </div>
  );
};

export default Counter;

In this updated version, I've added checks for the maximum and minimum counts to ensure that the count doesn't exceed the specified limits. I've also used `Math.min` and `Math.max` to prevent potential overflow or underflow issues. Additionally, I've added ARIA labels to the buttons to improve accessibility.