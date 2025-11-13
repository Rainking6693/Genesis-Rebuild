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
  ariaLabelIncrement = 'Increment counter',
  ariaLabelDecrement = 'Decrement counter',
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Memoize incrementStep to prevent unnecessary re-renders if it's a complex calculation
  const safeIncrementStep = useMemo(() => {
    if (typeof incrementStep !== 'number' || isNaN(incrementStep)) {
      console.warn("Invalid incrementStep provided.  Using default of 1.");
      return 1;
    }
    return incrementStep;
  }, [incrementStep]);

  // Use useCallback to memoize the increment function
  const increment = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount + safeIncrementStep;
      return Math.min(nextCount, max); // Respect the max value
    });
  }, [safeIncrementStep, max]);

  // Use useCallback to memoize the decrement function
  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount - safeIncrementStep;
      return Math.max(nextCount, min); // Respect the min value
    });
  }, [safeIncrementStep, min]);

  // Handle edge cases for min/max values during initial render
  const validatedCount = useMemo(() => {
    return Math.max(min, Math.min(initialCount, max));
  }, [initialCount, min, max]);

  // Initialize count with validated value only once
  useState(() => {
    setCount(validatedCount);
  }, [validatedCount]);

  const isIncrementDisabled = count >= max;
  const isDecrementDisabled = count <= min;

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {count}</p>
      <button
        onClick={increment}
        disabled={isIncrementDisabled}
        aria-label={ariaLabelIncrement}
        title={isIncrementDisabled ? "Maximum value reached" : undefined}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        disabled={isDecrementDisabled}
        aria-label={ariaLabelDecrement}
        title={isDecrementDisabled ? "Minimum value reached" : undefined}
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
  ariaLabelIncrement = 'Increment counter',
  ariaLabelDecrement = 'Decrement counter',
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Memoize incrementStep to prevent unnecessary re-renders if it's a complex calculation
  const safeIncrementStep = useMemo(() => {
    if (typeof incrementStep !== 'number' || isNaN(incrementStep)) {
      console.warn("Invalid incrementStep provided.  Using default of 1.");
      return 1;
    }
    return incrementStep;
  }, [incrementStep]);

  // Use useCallback to memoize the increment function
  const increment = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount + safeIncrementStep;
      return Math.min(nextCount, max); // Respect the max value
    });
  }, [safeIncrementStep, max]);

  // Use useCallback to memoize the decrement function
  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount - safeIncrementStep;
      return Math.max(nextCount, min); // Respect the min value
    });
  }, [safeIncrementStep, min]);

  // Handle edge cases for min/max values during initial render
  const validatedCount = useMemo(() => {
    return Math.max(min, Math.min(initialCount, max));
  }, [initialCount, min, max]);

  // Initialize count with validated value only once
  useState(() => {
    setCount(validatedCount);
  }, [validatedCount]);

  const isIncrementDisabled = count >= max;
  const isDecrementDisabled = count <= min;

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {count}</p>
      <button
        onClick={increment}
        disabled={isIncrementDisabled}
        aria-label={ariaLabelIncrement}
        title={isIncrementDisabled ? "Maximum value reached" : undefined}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        disabled={isDecrementDisabled}
        aria-label={ariaLabelDecrement}
        title={isDecrementDisabled ? "Minimum value reached" : undefined}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;