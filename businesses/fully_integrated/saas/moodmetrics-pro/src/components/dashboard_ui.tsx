import React, { useState, useCallback, useMemo } from 'react';

interface CounterProps {
  /** The initial value of the counter. Defaults to 0. */
  initialCount?: number;
  /** The amount to increment/decrement the counter by. Defaults to 1. Must be a positive number. */
  incrementStep?: number;
  /** Optional callback function to execute when the count changes. */
  onCountChange?: (newCount: number) => void;
  /** Minimum allowed value for the counter.  Decrementing below this value will be prevented. Defaults to undefined (no minimum). */
  minValue?: number;
  /** Maximum allowed value for the counter. Incrementing above this value will be prevented. Defaults to undefined (no maximum). */
  maxValue?: number;
  /** Aria label for the increment button.  Important for accessibility. */
  incrementButtonLabel?: string;
  /** Aria label for the decrement button. Important for accessibility. */
  decrementButtonLabel?: string;
  /** Disables the increment button. */
  disableIncrement?: boolean;
  /** Disables the decrement button. */
  disableDecrement?: boolean;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  onCountChange,
  minValue,
  maxValue,
  incrementButtonLabel = 'Increment',
  decrementButtonLabel = 'Decrement',
  disableIncrement,
  disableDecrement,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Validate incrementStep prop
  const validatedIncrementStep = useMemo(() => {
    if (incrementStep <= 0) {
      console.warn("incrementStep must be a positive number.  Using default value of 1.");
      return 1;
    }
    return incrementStep;
  }, [incrementStep]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newValue = prevCount + validatedIncrementStep;
      if (maxValue !== undefined && newValue > maxValue) {
        return prevCount; // Prevent incrementing beyond maxValue
      }
      onCountChange?.(newValue); // Optional callback
      return newValue;
    });
  }, [validatedIncrementStep, maxValue, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newValue = prevCount - validatedIncrementStep;
      if (minValue !== undefined && newValue < minValue) {
        return prevCount; // Prevent decrementing below minValue
      }
      onCountChange?.(newValue); // Optional callback
      return newValue;
    });
  }, [validatedIncrementStep, minValue, onCountChange]);

  const isIncrementDisabled = useMemo(() => {
    if (disableIncrement) return true;
    if (maxValue === undefined) return false;
    return count >= maxValue;
  }, [count, maxValue, disableIncrement]);

  const isDecrementDisabled = useMemo(() => {
    if (disableDecrement) return true;
    if (minValue === undefined) return false;
    return count <= minValue;
  }, [count, minValue, disableDecrement]);

  return (
    <div data-testid="counter-container">
      <p data-testid="count-value">Count: {count}</p>
      <button
        onClick={increment}
        aria-label={incrementButtonLabel}
        data-testid="increment-button"
        disabled={isIncrementDisabled}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={decrementButtonLabel}
        data-testid="decrement-button"
        disabled={isDecrementDisabled}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useMemo } from 'react';

interface CounterProps {
  /** The initial value of the counter. Defaults to 0. */
  initialCount?: number;
  /** The amount to increment/decrement the counter by. Defaults to 1. Must be a positive number. */
  incrementStep?: number;
  /** Optional callback function to execute when the count changes. */
  onCountChange?: (newCount: number) => void;
  /** Minimum allowed value for the counter.  Decrementing below this value will be prevented. Defaults to undefined (no minimum). */
  minValue?: number;
  /** Maximum allowed value for the counter. Incrementing above this value will be prevented. Defaults to undefined (no maximum). */
  maxValue?: number;
  /** Aria label for the increment button.  Important for accessibility. */
  incrementButtonLabel?: string;
  /** Aria label for the decrement button. Important for accessibility. */
  decrementButtonLabel?: string;
  /** Disables the increment button. */
  disableIncrement?: boolean;
  /** Disables the decrement button. */
  disableDecrement?: boolean;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  onCountChange,
  minValue,
  maxValue,
  incrementButtonLabel = 'Increment',
  decrementButtonLabel = 'Decrement',
  disableIncrement,
  disableDecrement,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Validate incrementStep prop
  const validatedIncrementStep = useMemo(() => {
    if (incrementStep <= 0) {
      console.warn("incrementStep must be a positive number.  Using default value of 1.");
      return 1;
    }
    return incrementStep;
  }, [incrementStep]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newValue = prevCount + validatedIncrementStep;
      if (maxValue !== undefined && newValue > maxValue) {
        return prevCount; // Prevent incrementing beyond maxValue
      }
      onCountChange?.(newValue); // Optional callback
      return newValue;
    });
  }, [validatedIncrementStep, maxValue, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newValue = prevCount - validatedIncrementStep;
      if (minValue !== undefined && newValue < minValue) {
        return prevCount; // Prevent decrementing below minValue
      }
      onCountChange?.(newValue); // Optional callback
      return newValue;
    });
  }, [validatedIncrementStep, minValue, onCountChange]);

  const isIncrementDisabled = useMemo(() => {
    if (disableIncrement) return true;
    if (maxValue === undefined) return false;
    return count >= maxValue;
  }, [count, maxValue, disableIncrement]);

  const isDecrementDisabled = useMemo(() => {
    if (disableDecrement) return true;
    if (minValue === undefined) return false;
    return count <= minValue;
  }, [count, minValue, disableDecrement]);

  return (
    <div data-testid="counter-container">
      <p data-testid="count-value">Count: {count}</p>
      <button
        onClick={increment}
        aria-label={incrementButtonLabel}
        data-testid="increment-button"
        disabled={isIncrementDisabled}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={decrementButtonLabel}
        data-testid="decrement-button"
        disabled={isDecrementDisabled}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;