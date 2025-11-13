import React, { useState, useCallback, useRef, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
  // Add an optional prop to handle out-of-bounds behavior
  outOfBoundsBehavior?: 'clamp' | 'wrap' | 'none' | ((currentCount: number, proposedCount: number, min: number, max: number) => number);
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
  outOfBoundsBehavior = 'clamp', // Default to clamp
}) => {
  const [count, setCount] = useState(initialCount);
  const countRef = useRef(count);

  useEffect(() => {
    countRef.current = count;
  }, [count]);

  useEffect(() => {
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  const handleOutOfBounds = useCallback(
    (currentCount: number, proposedCount: number, min: number, max: number): number => {
      if (typeof outOfBoundsBehavior === 'function') {
        return outOfBoundsBehavior(currentCount, proposedCount, min, max);
      }

      switch (outOfBoundsBehavior) {
        case 'clamp':
          return Math.max(min, Math.min(max, proposedCount));
        case 'wrap':
          if (proposedCount > max) {
            return min;
          } else if (proposedCount < min) {
            return max;
          }
          return proposedCount;
        case 'none':
          return currentCount;
        default:
          console.warn(`Invalid outOfBoundsBehavior: ${outOfBoundsBehavior}. Clamping to min/max.`);
          return Math.max(min, Math.min(max, proposedCount)); // Default to clamp if invalid
      }
    },
    [outOfBoundsBehavior]
  );

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + incrementStep;
      return handleOutOfBounds(prevCount, newCount, min, max);
    });
  }, [incrementStep, max, min, handleOutOfBounds]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - incrementStep;
      return handleOutOfBounds(prevCount, newCount, min, max);
    });
  }, [incrementStep, min, max, handleOutOfBounds]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault(); // Prevent scrolling
        increment();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault(); // Prevent scrolling
        decrement();
      }
    },
    [increment, decrement]
  );

  // Use a more robust check for disabled state, considering potential floating-point precision issues
  const isIncrementDisabled = max !== Number.POSITIVE_INFINITY && countRef.current >= max;
  const isDecrementDisabled = min !== Number.NEGATIVE_INFINITY && countRef.current <= min;

  return (
    <div
      role="group"
      aria-label="Counter"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <p>Count: {count}</p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={isIncrementDisabled}
      >
        {ariaLabelIncrement}
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={isDecrementDisabled}
      >
        {ariaLabelDecrement}
      </button>
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useRef, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
  // Add an optional prop to handle out-of-bounds behavior
  outOfBoundsBehavior?: 'clamp' | 'wrap' | 'none' | ((currentCount: number, proposedCount: number, min: number, max: number) => number);
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
  outOfBoundsBehavior = 'clamp', // Default to clamp
}) => {
  const [count, setCount] = useState(initialCount);
  const countRef = useRef(count);

  useEffect(() => {
    countRef.current = count;
  }, [count]);

  useEffect(() => {
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  const handleOutOfBounds = useCallback(
    (currentCount: number, proposedCount: number, min: number, max: number): number => {
      if (typeof outOfBoundsBehavior === 'function') {
        return outOfBoundsBehavior(currentCount, proposedCount, min, max);
      }

      switch (outOfBoundsBehavior) {
        case 'clamp':
          return Math.max(min, Math.min(max, proposedCount));
        case 'wrap':
          if (proposedCount > max) {
            return min;
          } else if (proposedCount < min) {
            return max;
          }
          return proposedCount;
        case 'none':
          return currentCount;
        default:
          console.warn(`Invalid outOfBoundsBehavior: ${outOfBoundsBehavior}. Clamping to min/max.`);
          return Math.max(min, Math.min(max, proposedCount)); // Default to clamp if invalid
      }
    },
    [outOfBoundsBehavior]
  );

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + incrementStep;
      return handleOutOfBounds(prevCount, newCount, min, max);
    });
  }, [incrementStep, max, min, handleOutOfBounds]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - incrementStep;
      return handleOutOfBounds(prevCount, newCount, min, max);
    });
  }, [incrementStep, min, max, handleOutOfBounds]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault(); // Prevent scrolling
        increment();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault(); // Prevent scrolling
        decrement();
      }
    },
    [increment, decrement]
  );

  // Use a more robust check for disabled state, considering potential floating-point precision issues
  const isIncrementDisabled = max !== Number.POSITIVE_INFINITY && countRef.current >= max;
  const isDecrementDisabled = min !== Number.NEGATIVE_INFINITY && countRef.current <= min;

  return (
    <div
      role="group"
      aria-label="Counter"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <p>Count: {count}</p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={isIncrementDisabled}
      >
        {ariaLabelIncrement}
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={isDecrementDisabled}
      >
        {ariaLabelDecrement}
      </button>
    </div>
  );
};

export default Counter;