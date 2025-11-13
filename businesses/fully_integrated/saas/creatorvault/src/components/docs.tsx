import React, { useState, useCallback, useRef, useEffect } from 'react';

interface CounterProps {
  /** The starting value of the counter (default: 0). */
  initialCount?: number;
  /** The amount to increment/decrement the counter by (default: 1). */
  incrementBy?: number;
  /** The minimum allowed value for the counter (optional). */
  min?: number;
  /** The maximum allowed value for the counter (optional). */
  max?: number;
  /** Prefix for the aria-label of the buttons (optional). */
  ariaLabelPrefix?: string;
  /** Custom class name for styling (optional). */
  className?: string;
  /** Callback function when the count changes (optional). */
  onChange?: (count: number) => void;
}

/**
 * A simple counter component with increment and decrement functionality.
 * Includes optional min/max values, improved accessibility, and error handling.
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  min,
  max,
  ariaLabelPrefix = 'Counter',
  className,
  onChange,
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const countRef = useRef<number>(count);

  useEffect(() => {
    countRef.current = count;
    if (onChange) {
      onChange(count);
    }
  }, [count, onChange]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      if (typeof incrementBy !== 'number' || isNaN(incrementBy)) {
        console.error('incrementBy must be a number');
        return prevCount; // Prevent increment if incrementBy is invalid
      }

      const newValue = prevCount + incrementBy;

      if (max !== undefined && typeof max === 'number' && newValue > max) {
        return prevCount;
      }

      return newValue;
    });
  }, [incrementBy, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      if (typeof incrementBy !== 'number' || isNaN(incrementBy)) {
        console.error('incrementBy must be a number');
        return prevCount; // Prevent decrement if incrementBy is invalid
      }

      const newValue = prevCount - incrementBy;

      if (min !== undefined && typeof min === 'number' && newValue < min) {
        return prevCount;
      }

      return newValue;
    });
  }, [incrementBy, min]);

  const handleIncrement = useCallback(() => {
    increment();
  }, [increment]);

  const handleDecrement = useCallback(() => {
    decrement();
  }, [decrement]);

  const isIncrementDisabled =
    max !== undefined && typeof max === 'number' && countRef.current >= max;
  const isDecrementDisabled =
    min !== undefined && typeof min === 'number' && countRef.current <= min;

  const ariaValueText = `Current count: ${count}`;

  return (
    <div className={className}>
      <p aria-live="polite" aria-valuetext={ariaValueText}>
        Count: {count}
      </p>
      <button
        onClick={handleIncrement}
        aria-label={`${ariaLabelPrefix} Increment by ${incrementBy}`}
        disabled={isIncrementDisabled}
        aria-disabled={isIncrementDisabled}
      >
        Increment
      </button>
      <button
        onClick={handleDecrement}
        aria-label={`${ariaLabelPrefix} Decrement by ${incrementBy}`}
        disabled={isDecrementDisabled}
        aria-disabled={isDecrementDisabled}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useRef, useEffect } from 'react';

interface CounterProps {
  /** The starting value of the counter (default: 0). */
  initialCount?: number;
  /** The amount to increment/decrement the counter by (default: 1). */
  incrementBy?: number;
  /** The minimum allowed value for the counter (optional). */
  min?: number;
  /** The maximum allowed value for the counter (optional). */
  max?: number;
  /** Prefix for the aria-label of the buttons (optional). */
  ariaLabelPrefix?: string;
  /** Custom class name for styling (optional). */
  className?: string;
  /** Callback function when the count changes (optional). */
  onChange?: (count: number) => void;
}

/**
 * A simple counter component with increment and decrement functionality.
 * Includes optional min/max values, improved accessibility, and error handling.
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  min,
  max,
  ariaLabelPrefix = 'Counter',
  className,
  onChange,
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const countRef = useRef<number>(count);

  useEffect(() => {
    countRef.current = count;
    if (onChange) {
      onChange(count);
    }
  }, [count, onChange]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      if (typeof incrementBy !== 'number' || isNaN(incrementBy)) {
        console.error('incrementBy must be a number');
        return prevCount; // Prevent increment if incrementBy is invalid
      }

      const newValue = prevCount + incrementBy;

      if (max !== undefined && typeof max === 'number' && newValue > max) {
        return prevCount;
      }

      return newValue;
    });
  }, [incrementBy, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      if (typeof incrementBy !== 'number' || isNaN(incrementBy)) {
        console.error('incrementBy must be a number');
        return prevCount; // Prevent decrement if incrementBy is invalid
      }

      const newValue = prevCount - incrementBy;

      if (min !== undefined && typeof min === 'number' && newValue < min) {
        return prevCount;
      }

      return newValue;
    });
  }, [incrementBy, min]);

  const handleIncrement = useCallback(() => {
    increment();
  }, [increment]);

  const handleDecrement = useCallback(() => {
    decrement();
  }, [decrement]);

  const isIncrementDisabled =
    max !== undefined && typeof max === 'number' && countRef.current >= max;
  const isDecrementDisabled =
    min !== undefined && typeof min === 'number' && countRef.current <= min;

  const ariaValueText = `Current count: ${count}`;

  return (
    <div className={className}>
      <p aria-live="polite" aria-valuetext={ariaValueText}>
        Count: {count}
      </p>
      <button
        onClick={handleIncrement}
        aria-label={`${ariaLabelPrefix} Increment by ${incrementBy}`}
        disabled={isIncrementDisabled}
        aria-disabled={isIncrementDisabled}
      >
        Increment
      </button>
      <button
        onClick={handleDecrement}
        aria-label={`${ariaLabelPrefix} Decrement by ${incrementBy}`}
        disabled={isDecrementDisabled}
        aria-disabled={isDecrementDisabled}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;