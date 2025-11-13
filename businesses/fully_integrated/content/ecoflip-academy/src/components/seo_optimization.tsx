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
   *  A maximum value the counter can reach.  If provided, incrementing past this value will have no effect.
   */
  maxValue?: number;
  /**
   * A minimum value the counter can reach. If provided, decrementing past this value will have no effect.
   */
  minValue?: number;
  /**
   *  A label for the counter, used for accessibility.
   */
  ariaLabel?: string;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  onCountChange,
  maxValue,
  minValue,
  ariaLabel = 'counter',
}) => {
  const [count, setCount] = useState(initialCount);

  // Validate incrementBy prop using useMemo to avoid unnecessary re-renders
  const validatedIncrementBy = useMemo(() => {
    if (typeof incrementBy !== 'number' || incrementBy <= 0 || !Number.isFinite(incrementBy)) {
      console.warn(
        `Invalid incrementBy value: ${incrementBy}.  Must be a positive number.  Using default value of 1.`
      );
      return 1;
    }
    return incrementBy;
  }, [incrementBy]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const potentialNewCount = prevCount + validatedIncrementBy;

      if (maxValue !== undefined && potentialNewCount > maxValue) {
        return prevCount; // Don't increment if it exceeds maxValue
      }

      if (onCountChange) {
        onCountChange(potentialNewCount);
      }

      return potentialNewCount;
    });
  }, [validatedIncrementBy, maxValue, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const potentialNewCount = prevCount - validatedIncrementBy;

      if (minValue !== undefined && potentialNewCount < minValue) {
        return prevCount; // Don't decrement if it goes below minValue
      }

      if (onCountChange) {
        onCountChange(potentialNewCount);
      }

      return potentialNewCount;
    });
  }, [validatedIncrementBy, minValue, onCountChange]);

  const countDisplay = useMemo(() => {
    return Number(count).toLocaleString(); // Format the number for better readability
  }, [count]);

  return (
    <div role="group" aria-label={ariaLabel}>
      <p aria-live="polite">
        Count: <span data-testid="count-value">{countDisplay}</span>
      </p>
      <button onClick={increment} aria-label="Increment counter">
        Increment
      </button>
      <button onClick={decrement} aria-label="Decrement counter">
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
   *  A maximum value the counter can reach.  If provided, incrementing past this value will have no effect.
   */
  maxValue?: number;
  /**
   * A minimum value the counter can reach. If provided, decrementing past this value will have no effect.
   */
  minValue?: number;
  /**
   *  A label for the counter, used for accessibility.
   */
  ariaLabel?: string;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  onCountChange,
  maxValue,
  minValue,
  ariaLabel = 'counter',
}) => {
  const [count, setCount] = useState(initialCount);

  // Validate incrementBy prop using useMemo to avoid unnecessary re-renders
  const validatedIncrementBy = useMemo(() => {
    if (typeof incrementBy !== 'number' || incrementBy <= 0 || !Number.isFinite(incrementBy)) {
      console.warn(
        `Invalid incrementBy value: ${incrementBy}.  Must be a positive number.  Using default value of 1.`
      );
      return 1;
    }
    return incrementBy;
  }, [incrementBy]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const potentialNewCount = prevCount + validatedIncrementBy;

      if (maxValue !== undefined && potentialNewCount > maxValue) {
        return prevCount; // Don't increment if it exceeds maxValue
      }

      if (onCountChange) {
        onCountChange(potentialNewCount);
      }

      return potentialNewCount;
    });
  }, [validatedIncrementBy, maxValue, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const potentialNewCount = prevCount - validatedIncrementBy;

      if (minValue !== undefined && potentialNewCount < minValue) {
        return prevCount; // Don't decrement if it goes below minValue
      }

      if (onCountChange) {
        onCountChange(potentialNewCount);
      }

      return potentialNewCount;
    });
  }, [validatedIncrementBy, minValue, onCountChange]);

  const countDisplay = useMemo(() => {
    return Number(count).toLocaleString(); // Format the number for better readability
  }, [count]);

  return (
    <div role="group" aria-label={ariaLabel}>
      <p aria-live="polite">
        Count: <span data-testid="count-value">{countDisplay}</span>
      </p>
      <button onClick={increment} aria-label="Increment counter">
        Increment
      </button>
      <button onClick={decrement} aria-label="Decrement counter">
        Decrement
      </button>
    </div>
  );
};

export default Counter;