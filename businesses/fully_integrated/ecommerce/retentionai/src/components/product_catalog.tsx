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
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Memoize incrementStep to prevent unnecessary re-renders if it's a complex calculation
  const safeIncrementStep = useMemo(() => {
    if (typeof incrementStep !== 'number' || isNaN(incrementStep)) {
      console.warn('Invalid incrementStep provided. Using default value of 1.');
      return 1;
    }
    return incrementStep;
  }, [incrementStep]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount + safeIncrementStep;
      return nextCount <= max ? nextCount : prevCount; // Prevent exceeding max
    });
  }, [safeIncrementStep, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount - safeIncrementStep;
      return nextCount >= min ? nextCount : prevCount; // Prevent going below min
    });
  }, [safeIncrementStep, min]);

  // Handle potential errors during rendering (e.g., if count becomes NaN)
  const displayCount = useMemo(() => {
    if (typeof count !== 'number' || isNaN(count)) {
      console.error('Invalid count value. Resetting to initialCount.');
      return initialCount;
    }
    return count;
  }, [count, initialCount]);

  const isIncrementDisabled = useMemo(() => displayCount >= max, [displayCount, max]);
  const isDecrementDisabled = useMemo(() => displayCount <= min, [displayCount, min]);

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {displayCount}</p>
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
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Memoize incrementStep to prevent unnecessary re-renders if it's a complex calculation
  const safeIncrementStep = useMemo(() => {
    if (typeof incrementStep !== 'number' || isNaN(incrementStep)) {
      console.warn('Invalid incrementStep provided. Using default value of 1.');
      return 1;
    }
    return incrementStep;
  }, [incrementStep]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount + safeIncrementStep;
      return nextCount <= max ? nextCount : prevCount; // Prevent exceeding max
    });
  }, [safeIncrementStep, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount - safeIncrementStep;
      return nextCount >= min ? nextCount : prevCount; // Prevent going below min
    });
  }, [safeIncrementStep, min]);

  // Handle potential errors during rendering (e.g., if count becomes NaN)
  const displayCount = useMemo(() => {
    if (typeof count !== 'number' || isNaN(count)) {
      console.error('Invalid count value. Resetting to initialCount.');
      return initialCount;
    }
    return count;
  }, [count, initialCount]);

  const isIncrementDisabled = useMemo(() => displayCount >= max, [displayCount, max]);
  const isDecrementDisabled = useMemo(() => displayCount <= min, [displayCount, min]);

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {displayCount}</p>
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