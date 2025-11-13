import React, { useState, Dispatch, SetStateAction, KeyboardEvent } from 'react';
import { useMemoizedFn, useDebounce } from '@udecode/plate-common';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  minCount?: number;
  maxCount?: number;
}

const Counter: React.FC<CounterProps> = ({ initialCount = 0, incrementStep = 1, minCount = 0, maxCount = Number.MAX_SAFE_INTEGER }) => {
  const [count, setCount] = useState<number>(initialCount);

  const handleIncrement = useMemoizedFn(() => {
    if (count < maxCount) {
      setCount(prevCount => Math.min(prevCount + incrementStep, maxCount));
    }
  });

  const handleDecrement = useMemoizedFn(() => {
    if (count > minCount) {
      setCount(prevCount => Math.max(prevCount - incrementStep, minCount));
    }
  });

  const debouncedIncrement = useDebounce(handleIncrement, 500);
  const debouncedDecrement = useDebounce(handleDecrement, 500);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === ' ') {
      event.currentTarget.click();
    }
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={debouncedIncrement} onKeyDown={handleKeyDown}>Increment</button>
      <button onClick={debouncedDecrement} onKeyDown={handleKeyDown}>Decrement</button>
    </div>
  );
};

export default Counter;

In this updated version, I've added the `Math.min` and `Math.max` functions to ensure that the count value never exceeds the specified `maxCount` or falls below the `minCount`. I've also added an accessibility feature by handling the space key press on the buttons, allowing users to increment or decrement the count using their keyboard.