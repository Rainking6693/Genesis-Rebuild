import React, { useState, useCallback, useMemo } from 'react';

interface CounterProps {
  /** The initial value of the counter. Defaults to 0. */
  initialCount?: number;
  /** The amount to increment or decrement the counter by. Defaults to 1. Must be a positive number. */
  incrementStep?: number;
  /** Optional callback function to execute when the count changes. */
  onCountChange?: (newCount: number) => void;
  /** Optional maximum value for the counter.  If provided, incrementing will stop at this value. */
  maxValue?: number;
  /** Optional minimum value for the counter. If provided, decrementing will stop at this value. */
  minValue?: number;
  /** Aria label for the increment button. */
  incrementAriaLabel?: string;
  /** Aria label for the decrement button. */
  decrementAriaLabel?: string;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  onCountChange,
  maxValue,
  minValue,
  incrementAriaLabel = 'Increment',
  decrementAriaLabel = 'Decrement',
}) => {
  // Validate incrementStep prop
  const validatedIncrementStep = useMemo(() => {
    if (typeof incrementStep !== 'number' || incrementStep <= 0) {
      console.warn(
        `Invalid incrementStep value: ${incrementStep}.  Using default value of 1.`
      );
      return 1;
    }
    return incrementStep;
  }, [incrementStep]);

  const [count, setCount] = useState<number>(initialCount);

  // Use useCallback to memoize the increment function
  const increment = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount + validatedIncrementStep;
      if (maxValue !== undefined && nextCount > maxValue) {
        return prevCount; // Stop incrementing if maxValue is reached
      }
      if (onCountChange) {
        onCountChange(nextCount);
      }
      return nextCount;
    });
  }, [validatedIncrementStep, maxValue, onCountChange]);

  // Use useCallback to memoize the decrement function
  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount - validatedIncrementStep;
      if (minValue !== undefined && nextCount < minValue) {
        return prevCount; // Stop decrementing if minValue is reached
      }
      if (onCountChange) {
        onCountChange(nextCount);
      }
      return nextCount;
    });
  }, [validatedIncrementStep, minValue, onCountChange]);

  // Use useCallback to memoize the reset function
  const reset = useCallback(() => {
    setCount(initialCount);
    if (onCountChange) {
      onCountChange(initialCount);
    }
  }, [initialCount, onCountChange]);

  const isIncrementDisabled = useMemo(() => maxValue !== undefined && count >= maxValue, [count, maxValue]);
  const isDecrementDisabled = useMemo(() => minValue !== undefined && count <= minValue, [count, minValue]);

  return (
    <div>
      <p aria-live="polite">Count: {count}</p>
      <button
        onClick={increment}
        disabled={isIncrementDisabled}
        aria-label={incrementAriaLabel}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        disabled={isDecrementDisabled}
        aria-label={decrementAriaLabel}
      >
        Decrement
      </button>
      <button onClick={reset} aria-label="Reset">
        Reset
      </button>
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useMemo } from 'react';

interface CounterProps {
  /** The initial value of the counter. Defaults to 0. */
  initialCount?: number;
  /** The amount to increment or decrement the counter by. Defaults to 1. Must be a positive number. */
  incrementStep?: number;
  /** Optional callback function to execute when the count changes. */
  onCountChange?: (newCount: number) => void;
  /** Optional maximum value for the counter.  If provided, incrementing will stop at this value. */
  maxValue?: number;
  /** Optional minimum value for the counter. If provided, decrementing will stop at this value. */
  minValue?: number;
  /** Aria label for the increment button. */
  incrementAriaLabel?: string;
  /** Aria label for the decrement button. */
  decrementAriaLabel?: string;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  onCountChange,
  maxValue,
  minValue,
  incrementAriaLabel = 'Increment',
  decrementAriaLabel = 'Decrement',
}) => {
  // Validate incrementStep prop
  const validatedIncrementStep = useMemo(() => {
    if (typeof incrementStep !== 'number' || incrementStep <= 0) {
      console.warn(
        `Invalid incrementStep value: ${incrementStep}.  Using default value of 1.`
      );
      return 1;
    }
    return incrementStep;
  }, [incrementStep]);

  const [count, setCount] = useState<number>(initialCount);

  // Use useCallback to memoize the increment function
  const increment = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount + validatedIncrementStep;
      if (maxValue !== undefined && nextCount > maxValue) {
        return prevCount; // Stop incrementing if maxValue is reached
      }
      if (onCountChange) {
        onCountChange(nextCount);
      }
      return nextCount;
    });
  }, [validatedIncrementStep, maxValue, onCountChange]);

  // Use useCallback to memoize the decrement function
  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount - validatedIncrementStep;
      if (minValue !== undefined && nextCount < minValue) {
        return prevCount; // Stop decrementing if minValue is reached
      }
      if (onCountChange) {
        onCountChange(nextCount);
      }
      return nextCount;
    });
  }, [validatedIncrementStep, minValue, onCountChange]);

  // Use useCallback to memoize the reset function
  const reset = useCallback(() => {
    setCount(initialCount);
    if (onCountChange) {
      onCountChange(initialCount);
    }
  }, [initialCount, onCountChange]);

  const isIncrementDisabled = useMemo(() => maxValue !== undefined && count >= maxValue, [count, maxValue]);
  const isDecrementDisabled = useMemo(() => minValue !== undefined && count <= minValue, [count, minValue]);

  return (
    <div>
      <p aria-live="polite">Count: {count}</p>
      <button
        onClick={increment}
        disabled={isIncrementDisabled}
        aria-label={incrementAriaLabel}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        disabled={isDecrementDisabled}
        aria-label={decrementAriaLabel}
      >
        Decrement
      </button>
      <button onClick={reset} aria-label="Reset">
        Reset
      </button>
    </div>
  );
};

export default Counter;