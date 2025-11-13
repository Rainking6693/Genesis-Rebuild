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

  // Use useCallback to memoize the increment function
  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + incrementStep;
      if (newCount <= max) {
        onCountChange?.(newCount); // Optional callback for count changes
        return newCount;
      } else {
        return prevCount; // Prevent exceeding the maximum
      }
    });
  }, [incrementStep, max, onCountChange]);

  // Use useCallback to memoize the decrement function
  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - incrementStep;
      if (newCount >= min) {
        onCountChange?.(newCount); // Optional callback for count changes
        return newCount;
      } else {
        return prevCount; // Prevent going below the minimum
      }
    });
  }, [incrementStep, min, onCountChange]);

  // Memoize the count value to prevent unnecessary re-renders
  const memoizedCount = useMemo(() => count, [count]);

  // Handle potential errors with incrementStep being zero
  const isIncrementStepValid = useMemo(() => incrementStep !== 0, [incrementStep]);

  return (
    <div>
      <p aria-live="polite">Count: {memoizedCount}</p>
      {isIncrementStepValid ? (
        <>
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
        </>
      ) : (
        <p role="alert">Error: Increment step cannot be zero.</p>
      )}
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

  // Use useCallback to memoize the increment function
  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + incrementStep;
      if (newCount <= max) {
        onCountChange?.(newCount); // Optional callback for count changes
        return newCount;
      } else {
        return prevCount; // Prevent exceeding the maximum
      }
    });
  }, [incrementStep, max, onCountChange]);

  // Use useCallback to memoize the decrement function
  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - incrementStep;
      if (newCount >= min) {
        onCountChange?.(newCount); // Optional callback for count changes
        return newCount;
      } else {
        return prevCount; // Prevent going below the minimum
      }
    });
  }, [incrementStep, min, onCountChange]);

  // Memoize the count value to prevent unnecessary re-renders
  const memoizedCount = useMemo(() => count, [count]);

  // Handle potential errors with incrementStep being zero
  const isIncrementStepValid = useMemo(() => incrementStep !== 0, [incrementStep]);

  return (
    <div>
      <p aria-live="polite">Count: {memoizedCount}</p>
      {isIncrementStepValid ? (
        <>
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
        </>
      ) : (
        <p role="alert">Error: Increment step cannot be zero.</p>
      )}
    </div>
  );
};

export default Counter;