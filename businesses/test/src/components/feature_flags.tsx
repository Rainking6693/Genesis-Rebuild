import React, { useState, useCallback, useRef, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelPrefix?: string;
  onCountChange?: (count: number) => void;
}

/**
 * A simple counter component with increment and decrement buttons.
 * Includes optional min/max values, error handling, and accessibility improvements.
 *
 * @param {number} initialCount - The initial value of the counter (default: 0).
 * @param {number} incrementStep - The amount to increment/decrement the counter by (default: 1).
 * @param {number} min - The minimum allowed value for the counter (optional).
 * @param {number} max - The maximum allowed value for the counter (optional).
 * @param {string} ariaLabelPrefix - Prefix for aria-labels on buttons (optional).
 * @param {function} onCountChange - Callback function when count changes (optional).
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min,
  max,
  ariaLabelPrefix = 'Counter',
  onCountChange,
}) => {
  const [count, setCount] = useState(initialCount);
  const [error, setError] = useState<string | null>(null);
  const countRef = useRef(count); // useRef to hold the latest count value

  useEffect(() => {
    countRef.current = count; // Update the ref whenever count changes
  }, [count]);

  useEffect(() => {
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  const validateCount = useCallback(
    (newCount: number) => {
      if (min !== undefined && newCount < min) {
        setError(`Minimum value is ${min}`);
        return false;
      }
      if (max !== undefined && newCount > max) {
        setError(`Maximum value is ${max}`);
        return false;
      }
      setError(null);
      return true;
    },
    [min, max]
  );

  const increment = useCallback(() => {
    const newCount = countRef.current + incrementStep;
    if (validateCount(newCount)) {
      setCount(newCount);
    }
  }, [incrementStep, validateCount]);

  const decrement = useCallback(() => {
    const newCount = countRef.current - incrementStep;
    if (validateCount(newCount)) {
      setCount(newCount);
    }
  }, [incrementStep, validateCount]);

  const handleBlur = useCallback(() => {
    // Re-validate the count when the input loses focus
    validateCount(countRef.current);
  }, [validateCount]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (isNaN(newValue)) {
      setError('Invalid input. Please enter a number.');
      return;
    }
    if (validateCount(newValue)) {
      setCount(newValue);
    }
  }, [validateCount]);

  return (
    <div>
      <label htmlFor="counter-input">
        {ariaLabelPrefix} Value:
      </label>
      <input
        type="number"
        id="counter-input"
        value={count}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-live="polite"
        aria-invalid={!!error}
        aria-describedby={error ? 'counter-error' : undefined}
      />
      <button onClick={decrement} aria-label={`${ariaLabelPrefix} Decrement`}>
        Decrement
      </button>
      <button onClick={increment} aria-label={`${ariaLabelPrefix} Increment`}>
        Increment
      </button>
      {error && (
        <div id="counter-error" role="alert" style={{ color: 'red' }}>
          {error}
        </div>
      )}
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
  ariaLabelPrefix?: string;
  onCountChange?: (count: number) => void;
}

/**
 * A simple counter component with increment and decrement buttons.
 * Includes optional min/max values, error handling, and accessibility improvements.
 *
 * @param {number} initialCount - The initial value of the counter (default: 0).
 * @param {number} incrementStep - The amount to increment/decrement the counter by (default: 1).
 * @param {number} min - The minimum allowed value for the counter (optional).
 * @param {number} max - The maximum allowed value for the counter (optional).
 * @param {string} ariaLabelPrefix - Prefix for aria-labels on buttons (optional).
 * @param {function} onCountChange - Callback function when count changes (optional).
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min,
  max,
  ariaLabelPrefix = 'Counter',
  onCountChange,
}) => {
  const [count, setCount] = useState(initialCount);
  const [error, setError] = useState<string | null>(null);
  const countRef = useRef(count); // useRef to hold the latest count value

  useEffect(() => {
    countRef.current = count; // Update the ref whenever count changes
  }, [count]);

  useEffect(() => {
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  const validateCount = useCallback(
    (newCount: number) => {
      if (min !== undefined && newCount < min) {
        setError(`Minimum value is ${min}`);
        return false;
      }
      if (max !== undefined && newCount > max) {
        setError(`Maximum value is ${max}`);
        return false;
      }
      setError(null);
      return true;
    },
    [min, max]
  );

  const increment = useCallback(() => {
    const newCount = countRef.current + incrementStep;
    if (validateCount(newCount)) {
      setCount(newCount);
    }
  }, [incrementStep, validateCount]);

  const decrement = useCallback(() => {
    const newCount = countRef.current - incrementStep;
    if (validateCount(newCount)) {
      setCount(newCount);
    }
  }, [incrementStep, validateCount]);

  const handleBlur = useCallback(() => {
    // Re-validate the count when the input loses focus
    validateCount(countRef.current);
  }, [validateCount]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (isNaN(newValue)) {
      setError('Invalid input. Please enter a number.');
      return;
    }
    if (validateCount(newValue)) {
      setCount(newValue);
    }
  }, [validateCount]);

  return (
    <div>
      <label htmlFor="counter-input">
        {ariaLabelPrefix} Value:
      </label>
      <input
        type="number"
        id="counter-input"
        value={count}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-live="polite"
        aria-invalid={!!error}
        aria-describedby={error ? 'counter-error' : undefined}
      />
      <button onClick={decrement} aria-label={`${ariaLabelPrefix} Decrement`}>
        Decrement
      </button>
      <button onClick={increment} aria-label={`${ariaLabelPrefix} Increment`}>
        Increment
      </button>
      {error && (
        <div id="counter-error" role="alert" style={{ color: 'red' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default Counter;