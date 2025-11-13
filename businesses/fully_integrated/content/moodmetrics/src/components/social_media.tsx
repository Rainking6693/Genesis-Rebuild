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

  // Use useMemo to prevent unnecessary re-renders if incrementBy doesn't change
  const safeIncrementBy = useMemo(() => Math.abs(incrementBy), [incrementBy]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + safeIncrementBy;
      if (newCount <= max) {
        onCountChange?.(newCount); // Optional callback for count changes
        return newCount;
      } else {
        // Handle max limit - either stay at max or do nothing
        return prevCount; // Or return max; to clamp the value
      }
    });
  }, [safeIncrementBy, max, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - safeIncrementBy;
      if (newCount >= min) {
        onCountChange?.(newCount); // Optional callback for count changes
        return newCount;
      } else {
        // Handle min limit - either stay at min or do nothing
        return prevCount; // Or return min; to clamp the value
      }
    });
  }, [safeIncrementBy, min, onCountChange]);

  const countDisplay = useMemo(() => {
    // Format the count for display (e.g., add commas, etc.)
    return count.toLocaleString();
  }, [count]);

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {countDisplay}</p>
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

  // Use useMemo to prevent unnecessary re-renders if incrementBy doesn't change
  const safeIncrementBy = useMemo(() => Math.abs(incrementBy), [incrementBy]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + safeIncrementBy;
      if (newCount <= max) {
        onCountChange?.(newCount); // Optional callback for count changes
        return newCount;
      } else {
        // Handle max limit - either stay at max or do nothing
        return prevCount; // Or return max; to clamp the value
      }
    });
  }, [safeIncrementBy, max, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - safeIncrementBy;
      if (newCount >= min) {
        onCountChange?.(newCount); // Optional callback for count changes
        return newCount;
      } else {
        // Handle min limit - either stay at min or do nothing
        return prevCount; // Or return min; to clamp the value
      }
    });
  }, [safeIncrementBy, min, onCountChange]);

  const countDisplay = useMemo(() => {
    // Format the count for display (e.g., add commas, etc.)
    return count.toLocaleString();
  }, [count]);

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {countDisplay}</p>
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