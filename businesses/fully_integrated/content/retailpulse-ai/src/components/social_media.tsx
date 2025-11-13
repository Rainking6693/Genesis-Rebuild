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

  // Handle potential errors with incrementStep being zero
  const isIncrementDisabled = useMemo(() => memoizedIncrementStep === 0 || count >= max, [memoizedIncrementStep, count, max]);
  const isDecrementDisabled = useMemo(() => memoizedIncrementStep === 0 || count <= min, [memoizedIncrementStep, count, min]);

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {count}</p>
      <button
        onClick={increment}
        disabled={isIncrementDisabled}
        aria-label={ariaLabelIncrement}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        disabled={isDecrementDisabled}
        aria-label={ariaLabelDecrement}
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

  // Handle potential errors with incrementStep being zero
  const isIncrementDisabled = useMemo(() => memoizedIncrementStep === 0 || count >= max, [memoizedIncrementStep, count, max]);
  const isDecrementDisabled = useMemo(() => memoizedIncrementStep === 0 || count <= min, [memoizedIncrementStep, count, min]);

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {count}</p>
      <button
        onClick={increment}
        disabled={isIncrementDisabled}
        aria-label={ariaLabelIncrement}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        disabled={isDecrementDisabled}
        aria-label={ariaLabelDecrement}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;