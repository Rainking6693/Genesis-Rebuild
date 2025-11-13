import React, { useState, useCallback, useMemo } from 'react';

interface CounterProps {
  /**
   * The initial value of the counter. Defaults to 0.
   */
  initialCount?: number;
  /**
   * The amount to increment or decrement the counter by. Defaults to 1.  Must be a positive number.
   */
  incrementBy?: number;
  /**
   * A callback function that is called when the count changes.
   * @param newCount The new value of the count.
   */
  onCountChange?: (newCount: number) => void;
  /**
   * Aria label for the increment button.  Important for accessibility.
   */
  incrementAriaLabel?: string;
  /**
   * Aria label for the decrement button. Important for accessibility.
   */
  decrementAriaLabel?: string;
  /**
   * Disables the increment button.
   */
  disableIncrement?: boolean;
    /**
   * Disables the decrement button.
   */
  disableDecrement?: boolean;
}

/**
 * A simple counter component.
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  onCountChange,
  incrementAriaLabel = 'Increment',
  decrementAriaLabel = 'Decrement',
  disableIncrement = false,
  disableDecrement = false,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Validate incrementBy prop using useMemo to avoid unnecessary re-renders
  const validatedIncrementBy = useMemo(() => {
    if (typeof incrementBy !== 'number' || incrementBy <= 0 || !Number.isFinite(incrementBy)) {
      console.error(
        `Invalid incrementBy value: ${incrementBy}.  Must be a positive number.  Using default value of 1.`
      );
      return 1;
    }
    return incrementBy;
  }, [incrementBy]);

  // Use useCallback to memoize the increment function
  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + validatedIncrementBy;
      onCountChange?.(newCount); // Optional chaining
      return newCount;
    });
  }, [validatedIncrementBy, onCountChange]);

  // Use useCallback to memoize the decrement function
  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - validatedIncrementBy;
      onCountChange?.(newCount); // Optional chaining
      return newCount;
    });
  }, [validatedIncrementBy, onCountChange]);

  return (
    <div data-testid="counter-container">
      <p data-testid="count-value">Count: {count}</p>
      <button
        onClick={increment}
        aria-label={incrementAriaLabel}
        data-testid="increment-button"
        disabled={disableIncrement}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={decrementAriaLabel}
        data-testid="decrement-button"
        disabled={disableDecrement}
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
  incrementBy?: number;
  /**
   * A callback function that is called when the count changes.
   * @param newCount The new value of the count.
   */
  onCountChange?: (newCount: number) => void;
  /**
   * Aria label for the increment button.  Important for accessibility.
   */
  incrementAriaLabel?: string;
  /**
   * Aria label for the decrement button. Important for accessibility.
   */
  decrementAriaLabel?: string;
  /**
   * Disables the increment button.
   */
  disableIncrement?: boolean;
    /**
   * Disables the decrement button.
   */
  disableDecrement?: boolean;
}

/**
 * A simple counter component.
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  onCountChange,
  incrementAriaLabel = 'Increment',
  decrementAriaLabel = 'Decrement',
  disableIncrement = false,
  disableDecrement = false,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Validate incrementBy prop using useMemo to avoid unnecessary re-renders
  const validatedIncrementBy = useMemo(() => {
    if (typeof incrementBy !== 'number' || incrementBy <= 0 || !Number.isFinite(incrementBy)) {
      console.error(
        `Invalid incrementBy value: ${incrementBy}.  Must be a positive number.  Using default value of 1.`
      );
      return 1;
    }
    return incrementBy;
  }, [incrementBy]);

  // Use useCallback to memoize the increment function
  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + validatedIncrementBy;
      onCountChange?.(newCount); // Optional chaining
      return newCount;
    });
  }, [validatedIncrementBy, onCountChange]);

  // Use useCallback to memoize the decrement function
  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - validatedIncrementBy;
      onCountChange?.(newCount); // Optional chaining
      return newCount;
    });
  }, [validatedIncrementBy, onCountChange]);

  return (
    <div data-testid="counter-container">
      <p data-testid="count-value">Count: {count}</p>
      <button
        onClick={increment}
        aria-label={incrementAriaLabel}
        data-testid="increment-button"
        disabled={disableIncrement}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={decrementAriaLabel}
        data-testid="decrement-button"
        disabled={disableDecrement}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;