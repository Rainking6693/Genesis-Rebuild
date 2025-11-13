import React, { useState, useCallback, useMemo } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementBy?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Use useMemo to prevent unnecessary recalculations
  const incrementAmount = useMemo(() => Math.abs(incrementBy), [incrementBy]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + incrementAmount;
      if (newCount > max) {
        return prevCount; // Or handle overflow differently, e.g., wrap around
      }
      onCountChange?.(newCount);
      return newCount;
    });
  }, [incrementAmount, max, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - incrementAmount;
      if (newCount < min) {
        return prevCount; // Or handle underflow differently, e.g., wrap around
      }
      onCountChange?.(newCount);
      return newCount;
    });
  }, [incrementAmount, min, onCountChange]);

  // Handle potential errors with incrementBy being zero
  if (incrementAmount === 0) {
    return (
      <div>
        <p>Error: incrementBy cannot be zero.</p>
      </div>
    );
  }

  return (
    <div role="group" aria-label="Counter">
      <p>Count: {count}</p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={count >= max}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={count <= min}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useMemo } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementBy?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Use useMemo to prevent unnecessary recalculations
  const incrementAmount = useMemo(() => Math.abs(incrementBy), [incrementBy]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + incrementAmount;
      if (newCount > max) {
        return prevCount; // Or handle overflow differently, e.g., wrap around
      }
      onCountChange?.(newCount);
      return newCount;
    });
  }, [incrementAmount, max, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - incrementAmount;
      if (newCount < min) {
        return prevCount; // Or handle underflow differently, e.g., wrap around
      }
      onCountChange?.(newCount);
      return newCount;
    });
  }, [incrementAmount, min, onCountChange]);

  // Handle potential errors with incrementBy being zero
  if (incrementAmount === 0) {
    return (
      <div>
        <p>Error: incrementBy cannot be zero.</p>
      </div>
    );
  }

  return (
    <div role="group" aria-label="Counter">
      <p>Count: {count}</p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={count >= max}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={count <= min}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;