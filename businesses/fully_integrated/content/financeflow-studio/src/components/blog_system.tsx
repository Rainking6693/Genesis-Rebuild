import React, { useState, useCallback, useMemo } from 'react';

interface CounterProps {
  /** The initial value of the counter. Defaults to 0. */
  initialCount?: number;
  /** The amount to increment or decrement the counter by. Defaults to 1. Must be a positive number. */
  incrementBy?: number;
  /** A callback function that is called when the count changes. */
  onCountChange?: (newCount: number) => void;
  /** Aria label for the increment button.  */
  incrementAriaLabel?: string;
  /** Aria label for the decrement button. */
  decrementAriaLabel?: string;
  /** Disables the increment button. */
  disableIncrement?: boolean;
  /** Disables the decrement button. */
  disableDecrement?: boolean;
  /** Maximum value the counter can reach.  If undefined, there is no maximum. */
  maxValue?: number;
  /** Minimum value the counter can reach. If undefined, there is no minimum. */
  minValue?: number;
}

/**
 * A simple counter component with increment and decrement buttons.
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  onCountChange,
  incrementAriaLabel = 'Increment',
  decrementAriaLabel = 'Decrement',
  disableIncrement = false,
  disableDecrement = false,
  maxValue,
  minValue,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Validate incrementBy prop
  const validatedIncrementBy = useMemo(() => {
    if (typeof incrementBy !== 'number' || incrementBy <= 0) {
      console.warn(
        `Counter: incrementBy prop must be a positive number.  Using default value of 1.`
      );
      return 1;
    }
    return incrementBy;
  }, [incrementBy]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount + validatedIncrementBy;
      if (maxValue !== undefined && nextCount > maxValue) {
        return prevCount; // Prevent incrementing beyond the maximum value
      }
      onCountChange?.(nextCount); // Call the callback if it exists
      return nextCount;
    });
  }, [validatedIncrementBy, maxValue, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount - validatedIncrementBy;
      if (minValue !== undefined && nextCount < minValue) {
        return prevCount; // Prevent decrementing below the minimum value
      }
      onCountChange?.(nextCount); // Call the callback if it exists
      return nextCount;
    });
  }, [validatedIncrementBy, minValue, onCountChange]);

  const isIncrementDisabled = useMemo(() => {
    return disableIncrement || (maxValue !== undefined && count >= maxValue);
  }, [disableIncrement, maxValue, count]);

  const isDecrementDisabled = useMemo(() => {
    return disableDecrement || (minValue !== undefined && count <= minValue);
  }, [disableDecrement, minValue, count]);

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {count}</p>
      <button
        onClick={increment}
        aria-label={incrementAriaLabel}
        disabled={isIncrementDisabled}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={decrementAriaLabel}
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
  /** The amount to increment or decrement the counter by. Defaults to 1. Must be a positive number. */
  incrementBy?: number;
  /** A callback function that is called when the count changes. */
  onCountChange?: (newCount: number) => void;
  /** Aria label for the increment button.  */
  incrementAriaLabel?: string;
  /** Aria label for the decrement button. */
  decrementAriaLabel?: string;
  /** Disables the increment button. */
  disableIncrement?: boolean;
  /** Disables the decrement button. */
  disableDecrement?: boolean;
  /** Maximum value the counter can reach.  If undefined, there is no maximum. */
  maxValue?: number;
  /** Minimum value the counter can reach. If undefined, there is no minimum. */
  minValue?: number;
}

/**
 * A simple counter component with increment and decrement buttons.
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  onCountChange,
  incrementAriaLabel = 'Increment',
  decrementAriaLabel = 'Decrement',
  disableIncrement = false,
  disableDecrement = false,
  maxValue,
  minValue,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Validate incrementBy prop
  const validatedIncrementBy = useMemo(() => {
    if (typeof incrementBy !== 'number' || incrementBy <= 0) {
      console.warn(
        `Counter: incrementBy prop must be a positive number.  Using default value of 1.`
      );
      return 1;
    }
    return incrementBy;
  }, [incrementBy]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount + validatedIncrementBy;
      if (maxValue !== undefined && nextCount > maxValue) {
        return prevCount; // Prevent incrementing beyond the maximum value
      }
      onCountChange?.(nextCount); // Call the callback if it exists
      return nextCount;
    });
  }, [validatedIncrementBy, maxValue, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount - validatedIncrementBy;
      if (minValue !== undefined && nextCount < minValue) {
        return prevCount; // Prevent decrementing below the minimum value
      }
      onCountChange?.(nextCount); // Call the callback if it exists
      return nextCount;
    });
  }, [validatedIncrementBy, minValue, onCountChange]);

  const isIncrementDisabled = useMemo(() => {
    return disableIncrement || (maxValue !== undefined && count >= maxValue);
  }, [disableIncrement, maxValue, count]);

  const isDecrementDisabled = useMemo(() => {
    return disableDecrement || (minValue !== undefined && count <= minValue);
  }, [disableDecrement, minValue, count]);

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {count}</p>
      <button
        onClick={increment}
        aria-label={incrementAriaLabel}
        disabled={isIncrementDisabled}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={decrementAriaLabel}
        disabled={isDecrementDisabled}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;