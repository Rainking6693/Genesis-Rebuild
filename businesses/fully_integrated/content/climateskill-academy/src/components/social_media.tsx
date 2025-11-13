import React, { useState, useCallback, useMemo } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Memoize incrementStep to prevent unnecessary re-renders if it's derived from props
  const memoizedIncrementStep = useMemo(() => incrementStep, [incrementStep]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount + memoizedIncrementStep;
      return nextCount <= max ? nextCount : prevCount; // Prevent exceeding max
    });
  }, [memoizedIncrementStep, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount - memoizedIncrementStep;
      return nextCount >= min ? nextCount : prevCount; // Prevent going below min
    });
  }, [memoizedIncrementStep, min]);

  // Handle potential errors during increment/decrement (e.g., invalid incrementStep)
  const safeIncrement = useCallback(() => {
    try {
      increment();
    } catch (error) {
      console.error('Error during increment:', error);
      // Optionally display an error message to the user
      alert('An error occurred while incrementing. Please check the configuration.');
    }
  }, [increment]);

  const safeDecrement = useCallback(() => {
    try {
      decrement();
    } catch (error) {
      console.error('Error during decrement:', error);
      // Optionally display an error message to the user
      alert('An error occurred while decrementing. Please check the configuration.');
    }
  }, [decrement]);

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {count}</p>
      <button
        onClick={safeIncrement}
        aria-label={ariaLabelIncrement}
        disabled={count >= max}
      >
        Increment
      </button>
      <button
        onClick={safeDecrement}
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
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Memoize incrementStep to prevent unnecessary re-renders if it's derived from props
  const memoizedIncrementStep = useMemo(() => incrementStep, [incrementStep]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount + memoizedIncrementStep;
      return nextCount <= max ? nextCount : prevCount; // Prevent exceeding max
    });
  }, [memoizedIncrementStep, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount - memoizedIncrementStep;
      return nextCount >= min ? nextCount : prevCount; // Prevent going below min
    });
  }, [memoizedIncrementStep, min]);

  // Handle potential errors during increment/decrement (e.g., invalid incrementStep)
  const safeIncrement = useCallback(() => {
    try {
      increment();
    } catch (error) {
      console.error('Error during increment:', error);
      // Optionally display an error message to the user
      alert('An error occurred while incrementing. Please check the configuration.');
    }
  }, [increment]);

  const safeDecrement = useCallback(() => {
    try {
      decrement();
    } catch (error) {
      console.error('Error during decrement:', error);
      // Optionally display an error message to the user
      alert('An error occurred while decrementing. Please check the configuration.');
    }
  }, [decrement]);

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {count}</p>
      <button
        onClick={safeIncrement}
        aria-label={ariaLabelIncrement}
        disabled={count >= max}
      >
        Increment
      </button>
      <button
        onClick={safeDecrement}
        aria-label={ariaLabelDecrement}
        disabled={count <= min}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;