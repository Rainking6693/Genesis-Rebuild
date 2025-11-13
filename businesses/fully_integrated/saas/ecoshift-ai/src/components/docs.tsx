import React, { useState, useCallback, useRef, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelPrefix?: string;
  onCountChange?: (count: number) => void; // Callback for when the count changes
  onError?: (message: string) => void; // Callback for handling errors (e.g., exceeding min/max)
}

/**
 * A simple counter component with increment and decrement functionality.
 * Includes optional min/max values and improved accessibility.
 *
 * @param {number} initialCount - The initial value of the counter (default: 0).
 * @param {number} incrementStep - The amount to increment/decrement the counter by (default: 1).
 * @param {number} min - The minimum allowed value for the counter.
 * @param {number} max - The maximum allowed value for the counter.
 * @param {string} ariaLabelPrefix - Prefix for aria-labels for better context.
 * @param {function} onCountChange - Callback function that is called when the count changes.
 * @param {function} onError - Callback function that is called when an error occurs (e.g., exceeding min/max).
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min,
  max,
  ariaLabelPrefix = 'Counter',
  onCountChange,
  onError,
}) => {
  const [count, setCount] = useState(initialCount);
  const countRef = useRef(count);
  const incrementStepRef = useRef(incrementStep); // useRef for incrementStep
  const minRef = useRef(min); // useRef for min
  const maxRef = useRef(max); // useRef for max

  useEffect(() => {
    countRef.current = count;
    onCountChange?.(count); // Call the callback when the count changes
  }, [count, onCountChange]);

  useEffect(() => {
    incrementStepRef.current = incrementStep;
    minRef.current = min;
    maxRef.current = max;
  }, [incrementStep, min, max]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newValue = prevCount + incrementStepRef.current;
      if (maxRef.current !== undefined && newValue > maxRef.current) {
        onError?.(`Maximum value (${maxRef.current}) reached.`);
        return prevCount;
      }
      return newValue;
    });
  }, []);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newValue = prevCount - incrementStepRef.current;
      if (minRef.current !== undefined && newValue < minRef.current) {
        onError?.(`Minimum value (${minRef.current}) reached.`);
        return prevCount;
      }
      return newValue;
    });
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const buttonText = event.currentTarget.textContent; // Directly get text content

        if (buttonText?.includes('Increment')) {
          increment();
        } else if (buttonText?.includes('Decrement')) {
          decrement();
        }
      }
    },
    [increment, decrement]
  );

  const isIncrementDisabled = maxRef.current !== undefined && count >= maxRef.current;
  const isDecrementDisabled = minRef.current !== undefined && count <= minRef.current;

  // Consider using a more semantic element for the counter display
  return (
    <div role="group" aria-label={ariaLabelPrefix}>
      <div aria-live="polite" style={{ marginBottom: '0.5rem' }}>
        {ariaLabelPrefix} value: <span data-testid="counter-value">{count}</span>
      </div>
      <button
        onClick={increment}
        aria-label={`${ariaLabelPrefix} Increment`}
        disabled={isIncrementDisabled}
        onKeyDown={handleKeyDown}
        data-testid="increment-button"
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={`${ariaLabelPrefix} Decrement`}
        disabled={isDecrementDisabled}
        onKeyDown={handleKeyDown}
        data-testid="decrement-button"
      >
        Decrement
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
  ariaLabelPrefix?: string;
  onCountChange?: (count: number) => void; // Callback for when the count changes
  onError?: (message: string) => void; // Callback for handling errors (e.g., exceeding min/max)
}

/**
 * A simple counter component with increment and decrement functionality.
 * Includes optional min/max values and improved accessibility.
 *
 * @param {number} initialCount - The initial value of the counter (default: 0).
 * @param {number} incrementStep - The amount to increment/decrement the counter by (default: 1).
 * @param {number} min - The minimum allowed value for the counter.
 * @param {number} max - The maximum allowed value for the counter.
 * @param {string} ariaLabelPrefix - Prefix for aria-labels for better context.
 * @param {function} onCountChange - Callback function that is called when the count changes.
 * @param {function} onError - Callback function that is called when an error occurs (e.g., exceeding min/max).
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min,
  max,
  ariaLabelPrefix = 'Counter',
  onCountChange,
  onError,
}) => {
  const [count, setCount] = useState(initialCount);
  const countRef = useRef(count);
  const incrementStepRef = useRef(incrementStep); // useRef for incrementStep
  const minRef = useRef(min); // useRef for min
  const maxRef = useRef(max); // useRef for max

  useEffect(() => {
    countRef.current = count;
    onCountChange?.(count); // Call the callback when the count changes
  }, [count, onCountChange]);

  useEffect(() => {
    incrementStepRef.current = incrementStep;
    minRef.current = min;
    maxRef.current = max;
  }, [incrementStep, min, max]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newValue = prevCount + incrementStepRef.current;
      if (maxRef.current !== undefined && newValue > maxRef.current) {
        onError?.(`Maximum value (${maxRef.current}) reached.`);
        return prevCount;
      }
      return newValue;
    });
  }, []);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newValue = prevCount - incrementStepRef.current;
      if (minRef.current !== undefined && newValue < minRef.current) {
        onError?.(`Minimum value (${minRef.current}) reached.`);
        return prevCount;
      }
      return newValue;
    });
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const buttonText = event.currentTarget.textContent; // Directly get text content

        if (buttonText?.includes('Increment')) {
          increment();
        } else if (buttonText?.includes('Decrement')) {
          decrement();
        }
      }
    },
    [increment, decrement]
  );

  const isIncrementDisabled = maxRef.current !== undefined && count >= maxRef.current;
  const isDecrementDisabled = minRef.current !== undefined && count <= minRef.current;

  // Consider using a more semantic element for the counter display
  return (
    <div role="group" aria-label={ariaLabelPrefix}>
      <div aria-live="polite" style={{ marginBottom: '0.5rem' }}>
        {ariaLabelPrefix} value: <span data-testid="counter-value">{count}</span>
      </div>
      <button
        onClick={increment}
        aria-label={`${ariaLabelPrefix} Increment`}
        disabled={isIncrementDisabled}
        onKeyDown={handleKeyDown}
        data-testid="increment-button"
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={`${ariaLabelPrefix} Decrement`}
        disabled={isDecrementDisabled}
        onKeyDown={handleKeyDown}
        data-testid="decrement-button"
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;