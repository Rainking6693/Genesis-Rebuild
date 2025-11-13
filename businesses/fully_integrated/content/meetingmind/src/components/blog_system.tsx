import React, { useState, useCallback, useRef, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  min?: number;
  max?: number;
  onCountChange?: (count: number) => void;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  ariaLabelReset?: string;
  disabled?: boolean;
}

/**
 * A simple counter component with improved resiliency, edge cases, accessibility, and maintainability.
 *
 * Props:
 *   - initialCount: The initial value of the counter (default: 0).
 *   - incrementStep: The amount to increment/decrement the counter by (default: 1).  Must be a positive number.
 *   - min: The minimum allowed value for the counter.  Defaults to 0.
 *   - max: The maximum allowed value for the counter. If not provided, there is no upper limit.
 *   - onCountChange: A callback function that gets triggered *after* the count changes.
 *   - ariaLabelIncrement: Aria label for the increment button.
 *   - ariaLabelDecrement: Aria label for the decrement button.
 *   - ariaLabelReset: Aria label for the reset button.
 *   - disabled:  If true, disables all buttons.
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min = 0,
  max,
  onCountChange,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  ariaLabelReset = 'Reset',
  disabled = false,
}) => {
  const [count, setCount] = useState(initialCount);
  const [error, setError] = useState<string | null>(null);
  const initialCountRef = useRef(initialCount); // Persist initialCount for reset even after prop changes

  useEffect(() => {
    initialCountRef.current = initialCount; // Update ref when initialCount prop changes
  }, [initialCount]);

  useEffect(() => {
    if (incrementStep <= 0) {
      setError("incrementStep must be a positive number.");
      return;
    }
    setError(null); // Clear any previous error if incrementStep is now valid.

    // Validate initialCount against min/max
    if (initialCount < min) {
        setCount(min);
    } else if (max !== undefined && initialCount > max) {
        setCount(max);
    } else {
        setCount(initialCount);
    }

  }, [incrementStep, initialCount, min, max]);

  const increment = useCallback(() => {
    if (error) return; // Don't increment if there's an error

    setCount((prevCount) => {
      const nextCount = prevCount + incrementStep;
      if (max !== undefined && nextCount > max) {
        return prevCount; // Don't exceed max
      }
      const newValue = Math.max(nextCount, min);
      onCountChange?.(newValue); // Call callback *after* state update
      return newValue;
    });
  }, [incrementStep, max, min, onCountChange, error]);

  const decrement = useCallback(() => {
    if (error) return; // Don't decrement if there's an error

    setCount((prevCount) => {
      const nextCount = prevCount - incrementStep;
      if (nextCount < min) {
        return prevCount; // Don't go below min
      }
      const newValue = Math.max(nextCount, min);
      onCountChange?.(newValue); // Call callback *after* state update
      return newValue;
    });
  }, [incrementStep, min, onCountChange, error]);

  const reset = useCallback(() => {
    if (error) return; // Don't reset if there's an error

    setCount(() => {
      const resetValue = Math.max(Math.min(initialCountRef.current, max === undefined ? initialCountRef.current : max), min);
      onCountChange?.(resetValue); // Call callback *after* state update
      return resetValue;
    });
  }, [min, max, onCountChange, error]);

  return (
    <div>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <p aria-live="polite">Count: {count}</p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={disabled || error !== null || (max !== undefined && count >= max)}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={disabled || error !== null || count <= min}
      >
        Decrement
      </button>
      <button onClick={reset} aria-label={ariaLabelReset} disabled={disabled || error !== null || count === initialCountRef.current}>
        Reset
      </button>
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useRef, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  min?: number;
  max?: number;
  onCountChange?: (count: number) => void;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  ariaLabelReset?: string;
  disabled?: boolean;
}

/**
 * A simple counter component with improved resiliency, edge cases, accessibility, and maintainability.
 *
 * Props:
 *   - initialCount: The initial value of the counter (default: 0).
 *   - incrementStep: The amount to increment/decrement the counter by (default: 1).  Must be a positive number.
 *   - min: The minimum allowed value for the counter.  Defaults to 0.
 *   - max: The maximum allowed value for the counter. If not provided, there is no upper limit.
 *   - onCountChange: A callback function that gets triggered *after* the count changes.
 *   - ariaLabelIncrement: Aria label for the increment button.
 *   - ariaLabelDecrement: Aria label for the decrement button.
 *   - ariaLabelReset: Aria label for the reset button.
 *   - disabled:  If true, disables all buttons.
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min = 0,
  max,
  onCountChange,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  ariaLabelReset = 'Reset',
  disabled = false,
}) => {
  const [count, setCount] = useState(initialCount);
  const [error, setError] = useState<string | null>(null);
  const initialCountRef = useRef(initialCount); // Persist initialCount for reset even after prop changes

  useEffect(() => {
    initialCountRef.current = initialCount; // Update ref when initialCount prop changes
  }, [initialCount]);

  useEffect(() => {
    if (incrementStep <= 0) {
      setError("incrementStep must be a positive number.");
      return;
    }
    setError(null); // Clear any previous error if incrementStep is now valid.

    // Validate initialCount against min/max
    if (initialCount < min) {
        setCount(min);
    } else if (max !== undefined && initialCount > max) {
        setCount(max);
    } else {
        setCount(initialCount);
    }

  }, [incrementStep, initialCount, min, max]);

  const increment = useCallback(() => {
    if (error) return; // Don't increment if there's an error

    setCount((prevCount) => {
      const nextCount = prevCount + incrementStep;
      if (max !== undefined && nextCount > max) {
        return prevCount; // Don't exceed max
      }
      const newValue = Math.max(nextCount, min);
      onCountChange?.(newValue); // Call callback *after* state update
      return newValue;
    });
  }, [incrementStep, max, min, onCountChange, error]);

  const decrement = useCallback(() => {
    if (error) return; // Don't decrement if there's an error

    setCount((prevCount) => {
      const nextCount = prevCount - incrementStep;
      if (nextCount < min) {
        return prevCount; // Don't go below min
      }
      const newValue = Math.max(nextCount, min);
      onCountChange?.(newValue); // Call callback *after* state update
      return newValue;
    });
  }, [incrementStep, min, onCountChange, error]);

  const reset = useCallback(() => {
    if (error) return; // Don't reset if there's an error

    setCount(() => {
      const resetValue = Math.max(Math.min(initialCountRef.current, max === undefined ? initialCountRef.current : max), min);
      onCountChange?.(resetValue); // Call callback *after* state update
      return resetValue;
    });
  }, [min, max, onCountChange, error]);

  return (
    <div>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <p aria-live="polite">Count: {count}</p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={disabled || error !== null || (max !== undefined && count >= max)}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={disabled || error !== null || count <= min}
      >
        Decrement
      </button>
      <button onClick={reset} aria-label={ariaLabelReset} disabled={disabled || error !== null || count === initialCountRef.current}>
        Reset
      </button>
    </div>
  );
};

export default Counter;