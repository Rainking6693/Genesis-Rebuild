import React, { useState, useCallback, useMemo } from 'react';

interface CounterProps {
  /**
   * The initial value of the counter. Defaults to 0.
   */
  initialCount?: number;
  /**
   * The amount to increment or decrement the counter by. Defaults to 1.  Must be a positive number.
   */
  incrementStep?: number;
  /**
   * A callback function that is called when the count changes.
   * @param newCount The new value of the count.
   */
  onCountChange?: (newCount: number) => void;
  /**
   * A maximum value the counter can reach. If undefined, there is no maximum.
   */
  maxCount?: number;
  /**
   * A minimum value the counter can reach. If undefined, there is no minimum.
   */
  minCount?: number;
  /**
   * A label for the counter, used for accessibility.
   */
  ariaLabel?: string;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  onCountChange,
  maxCount,
  minCount,
  ariaLabel = 'Counter',
}) => {
  // Validate incrementStep to prevent unexpected behavior
  const validatedIncrementStep = useMemo(() => {
    if (typeof incrementStep !== 'number' || incrementStep <= 0 || !Number.isFinite(incrementStep)) {
      console.warn(
        `Invalid incrementStep value: ${incrementStep}.  Using default value of 1. incrementStep must be a positive number.`
      );
      return 1;
    }
    return incrementStep;
  }, [incrementStep]);

  const [count, setCount] = useState<number>(initialCount);

  // Use useCallback to memoize the increment function
  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + validatedIncrementStep;
      if (maxCount !== undefined && newCount > maxCount) {
        return prevCount; // Prevent exceeding maxCount
      }
      onCountChange?.(newCount); // Call the callback if it exists
      return newCount;
    });
  }, [validatedIncrementStep, maxCount, onCountChange]);

  // Use useCallback to memoize the decrement function
  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - validatedIncrementStep;
      if (minCount !== undefined && newCount < minCount) {
        return prevCount; // Prevent going below minCount
      }
      onCountChange?.(newCount); // Call the callback if it exists
      return newCount;
    });
  }, [validatedIncrementStep, minCount, onCountChange]);

  const isIncrementDisabled = useMemo(() => maxCount !== undefined && count >= maxCount, [count, maxCount]);
  const isDecrementDisabled = useMemo(() => minCount !== undefined && count <= minCount, [count, minCount]);

  return (
    <div role="group" aria-label={ariaLabel}>
      <p aria-live="polite">
        Count: <span data-testid="count-value">{count}</span>
      </p>
      <button
        onClick={increment}
        disabled={isIncrementDisabled}
        aria-label="Increment"
        title="Increment the counter"
      >
        Increment
      </button>
      <button
        onClick={decrement}
        disabled={isDecrementDisabled}
        aria-label="Decrement"
        title="Decrement the counter"
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useMemo } from 'react';

interface CounterProps {
  /**
   * The initial value of the counter. Defaults to 0.
   */
  initialCount?: number;
  /**
   * The amount to increment or decrement the counter by. Defaults to 1.  Must be a positive number.
   */
  incrementStep?: number;
  /**
   * A callback function that is called when the count changes.
   * @param newCount The new value of the count.
   */
  onCountChange?: (newCount: number) => void;
  /**
   * A maximum value the counter can reach. If undefined, there is no maximum.
   */
  maxCount?: number;
  /**
   * A minimum value the counter can reach. If undefined, there is no minimum.
   */
  minCount?: number;
  /**
   * A label for the counter, used for accessibility.
   */
  ariaLabel?: string;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  onCountChange,
  maxCount,
  minCount,
  ariaLabel = 'Counter',
}) => {
  // Validate incrementStep to prevent unexpected behavior
  const validatedIncrementStep = useMemo(() => {
    if (typeof incrementStep !== 'number' || incrementStep <= 0 || !Number.isFinite(incrementStep)) {
      console.warn(
        `Invalid incrementStep value: ${incrementStep}.  Using default value of 1. incrementStep must be a positive number.`
      );
      return 1;
    }
    return incrementStep;
  }, [incrementStep]);

  const [count, setCount] = useState<number>(initialCount);

  // Use useCallback to memoize the increment function
  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + validatedIncrementStep;
      if (maxCount !== undefined && newCount > maxCount) {
        return prevCount; // Prevent exceeding maxCount
      }
      onCountChange?.(newCount); // Call the callback if it exists
      return newCount;
    });
  }, [validatedIncrementStep, maxCount, onCountChange]);

  // Use useCallback to memoize the decrement function
  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - validatedIncrementStep;
      if (minCount !== undefined && newCount < minCount) {
        return prevCount; // Prevent going below minCount
      }
      onCountChange?.(newCount); // Call the callback if it exists
      return newCount;
    });
  }, [validatedIncrementStep, minCount, onCountChange]);

  const isIncrementDisabled = useMemo(() => maxCount !== undefined && count >= maxCount, [count, maxCount]);
  const isDecrementDisabled = useMemo(() => minCount !== undefined && count <= minCount, [count, minCount]);

  return (
    <div role="group" aria-label={ariaLabel}>
      <p aria-live="polite">
        Count: <span data-testid="count-value">{count}</span>
      </p>
      <button
        onClick={increment}
        disabled={isIncrementDisabled}
        aria-label="Increment"
        title="Increment the counter"
      >
        Increment
      </button>
      <button
        onClick={decrement}
        disabled={isDecrementDisabled}
        aria-label="Decrement"
        title="Decrement the counter"
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;