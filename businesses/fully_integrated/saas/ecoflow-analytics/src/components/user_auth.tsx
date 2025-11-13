import React, { useState, useCallback, useMemo } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Use useMemo to prevent unnecessary re-renders if incrementStep doesn't change
  const safeIncrementStep = useMemo(() => Math.abs(incrementStep), [incrementStep]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + safeIncrementStep;
      if (newCount > max) {
        return prevCount; // Or handle differently, e.g., wrap around, throw error
      }
      if (onCountChange) {
        onCountChange(newCount);
      }
      return newCount;
    });
  }, [safeIncrementStep, max, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - safeIncrementStep;
      if (newCount < min) {
        return prevCount; // Or handle differently, e.g., wrap around, throw error
      }
      if (onCountChange) {
        onCountChange(newCount);
      }
      return newCount;
    });
  }, [safeIncrementStep, min, onCountChange]);

  const isIncrementDisabled = useMemo(() => count >= max, [count, max]);
  const isDecrementDisabled = useMemo(() => count <= min, [count, min]);

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {count}</p>
      <button
        onClick={increment}
        disabled={isIncrementDisabled}
        aria-label={ariaLabelIncrement}
        title={isIncrementDisabled ? "Maximum value reached" : `Increment by ${safeIncrementStep}`}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        disabled={isDecrementDisabled}
        aria-label={ariaLabelDecrement}
        title={isDecrementDisabled ? "Minimum value reached" : `Decrement by ${safeIncrementStep}`}
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
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Use useMemo to prevent unnecessary re-renders if incrementStep doesn't change
  const safeIncrementStep = useMemo(() => Math.abs(incrementStep), [incrementStep]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + safeIncrementStep;
      if (newCount > max) {
        return prevCount; // Or handle differently, e.g., wrap around, throw error
      }
      if (onCountChange) {
        onCountChange(newCount);
      }
      return newCount;
    });
  }, [safeIncrementStep, max, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - safeIncrementStep;
      if (newCount < min) {
        return prevCount; // Or handle differently, e.g., wrap around, throw error
      }
      if (onCountChange) {
        onCountChange(newCount);
      }
      return newCount;
    });
  }, [safeIncrementStep, min, onCountChange]);

  const isIncrementDisabled = useMemo(() => count >= max, [count, max]);
  const isDecrementDisabled = useMemo(() => count <= min, [count, min]);

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {count}</p>
      <button
        onClick={increment}
        disabled={isIncrementDisabled}
        aria-label={ariaLabelIncrement}
        title={isIncrementDisabled ? "Maximum value reached" : `Increment by ${safeIncrementStep}`}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        disabled={isDecrementDisabled}
        aria-label={ariaLabelDecrement}
        title={isDecrementDisabled ? "Minimum value reached" : `Decrement by ${safeIncrementStep}`}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;