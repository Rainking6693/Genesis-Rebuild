import React, { useState, useCallback, useMemo, useEffect } from 'react';

interface CounterProps {
  initialCount?: number | string; // Allow string input for initialCount
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  disabled?: boolean;
  onChange?: (value: number) => void; // Callback for when the count changes
  onError?: (error: string) => void; // Callback for error handling
}

/**
 * A simple counter component with increment and decrement functionality.
 * Includes optional min/max values, custom aria labels, and disabled state.
 * Handles string inputs for initialCount and provides onChange and onError callbacks.
 *
 * @param {CounterProps} props - The component's props.
 * @param {number | string} props.initialCount - The initial value of the counter (default: 0).  Accepts a string that will be parsed to a number.
 * @param {number} props.incrementStep - The amount to increment/decrement by (default: 1).
 * @param {number} props.min - The minimum allowed value for the counter (optional).
 * @param {number} props.max - The maximum allowed value for the counter (optional).
 * @param {string} props.ariaLabelIncrement - Custom aria label for the increment button (default: "Increment").
 * @param {string} props.ariaLabelDecrement - Custom aria label for the decrement button (default: "Decrement").
 * @param {boolean} props.disabled - Disables the increment and decrement buttons (default: false).
 * @param {function} props.onChange - Callback function that is called when the counter value changes.
 * @param {function} props.onError - Callback function that is called when an error occurs (e.g., invalid initialCount).
 * @returns {JSX.Element} The rendered counter component.
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min,
  max,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  disabled = false,
  onChange,
  onError,
}) => {
  const [count, setCount] = useState<number>(() => {
    let initialValue: number;
    if (typeof initialCount === 'string') {
      const parsedValue = Number(initialCount);
      if (isNaN(parsedValue)) {
        if (onError) {
          onError('Invalid initialCount string provided.');
        }
        return 0; // Default to 0 if parsing fails
      }
      initialValue = parsedValue;
    } else {
      initialValue = initialCount;
    }
    return initialValue;
  });

  useEffect(() => {
    if (onChange) {
      onChange(count);
    }
  }, [count, onChange]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount + incrementStep;
      if (max !== undefined && nextCount > max) {
        return prevCount; // Prevent exceeding the maximum
      }
      return nextCount;
    });
  }, [incrementStep, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount - incrementStep;
      if (min !== undefined && nextCount < min) {
        return prevCount; // Prevent going below the minimum
      }
      return nextCount;
    });
  }, [incrementStep, min]);

  const isIncrementDisabled = useMemo(
    () => disabled || (max !== undefined && count >= max),
    [disabled, max, count]
  );
  const isDecrementDisabled = useMemo(
    () => disabled || (min !== undefined && count <= min),
    [disabled, min, count]
  );

  const incrementButtonId = useMemo(() => `increment-button-${Math.random().toString(36).substring(2, 15)}`, []);
  const decrementButtonId = useMemo(() => `decrement-button-${Math.random().toString(36).substring(2, 15)}`, []);
  const countDisplayId = useMemo(() => `count-display-${Math.random().toString(36).substring(2, 15)}`, []);

  return (
    <div>
      <p id={countDisplayId}>Count: {count}</p>
      <button
        id={incrementButtonId}
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={isIncrementDisabled}
        aria-describedby={isIncrementDisabled ? 'increment-disabled-message' : undefined}
      >
        Increment
      </button>
      <button
        id={decrementButtonId}
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={isDecrementDisabled}
        aria-describedby={isDecrementDisabled ? 'decrement-disabled-message' : undefined}
      >
        Decrement
      </button>
      {isIncrementDisabled && <span id="increment-disabled-message" aria-live="polite" className="sr-only">Increment is disabled.</span>}
      {isDecrementDisabled && <span id="decrement-disabled-message" aria-live="polite" className="sr-only">Decrement is disabled.</span>}
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useMemo, useEffect } from 'react';

interface CounterProps {
  initialCount?: number | string; // Allow string input for initialCount
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  disabled?: boolean;
  onChange?: (value: number) => void; // Callback for when the count changes
  onError?: (error: string) => void; // Callback for error handling
}

/**
 * A simple counter component with increment and decrement functionality.
 * Includes optional min/max values, custom aria labels, and disabled state.
 * Handles string inputs for initialCount and provides onChange and onError callbacks.
 *
 * @param {CounterProps} props - The component's props.
 * @param {number | string} props.initialCount - The initial value of the counter (default: 0).  Accepts a string that will be parsed to a number.
 * @param {number} props.incrementStep - The amount to increment/decrement by (default: 1).
 * @param {number} props.min - The minimum allowed value for the counter (optional).
 * @param {number} props.max - The maximum allowed value for the counter (optional).
 * @param {string} props.ariaLabelIncrement - Custom aria label for the increment button (default: "Increment").
 * @param {string} props.ariaLabelDecrement - Custom aria label for the decrement button (default: "Decrement").
 * @param {boolean} props.disabled - Disables the increment and decrement buttons (default: false).
 * @param {function} props.onChange - Callback function that is called when the counter value changes.
 * @param {function} props.onError - Callback function that is called when an error occurs (e.g., invalid initialCount).
 * @returns {JSX.Element} The rendered counter component.
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min,
  max,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  disabled = false,
  onChange,
  onError,
}) => {
  const [count, setCount] = useState<number>(() => {
    let initialValue: number;
    if (typeof initialCount === 'string') {
      const parsedValue = Number(initialCount);
      if (isNaN(parsedValue)) {
        if (onError) {
          onError('Invalid initialCount string provided.');
        }
        return 0; // Default to 0 if parsing fails
      }
      initialValue = parsedValue;
    } else {
      initialValue = initialCount;
    }
    return initialValue;
  });

  useEffect(() => {
    if (onChange) {
      onChange(count);
    }
  }, [count, onChange]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount + incrementStep;
      if (max !== undefined && nextCount > max) {
        return prevCount; // Prevent exceeding the maximum
      }
      return nextCount;
    });
  }, [incrementStep, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount - incrementStep;
      if (min !== undefined && nextCount < min) {
        return prevCount; // Prevent going below the minimum
      }
      return nextCount;
    });
  }, [incrementStep, min]);

  const isIncrementDisabled = useMemo(
    () => disabled || (max !== undefined && count >= max),
    [disabled, max, count]
  );
  const isDecrementDisabled = useMemo(
    () => disabled || (min !== undefined && count <= min),
    [disabled, min, count]
  );

  const incrementButtonId = useMemo(() => `increment-button-${Math.random().toString(36).substring(2, 15)}`, []);
  const decrementButtonId = useMemo(() => `decrement-button-${Math.random().toString(36).substring(2, 15)}`, []);
  const countDisplayId = useMemo(() => `count-display-${Math.random().toString(36).substring(2, 15)}`, []);

  return (
    <div>
      <p id={countDisplayId}>Count: {count}</p>
      <button
        id={incrementButtonId}
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={isIncrementDisabled}
        aria-describedby={isIncrementDisabled ? 'increment-disabled-message' : undefined}
      >
        Increment
      </button>
      <button
        id={decrementButtonId}
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={isDecrementDisabled}
        aria-describedby={isDecrementDisabled ? 'decrement-disabled-message' : undefined}
      >
        Decrement
      </button>
      {isIncrementDisabled && <span id="increment-disabled-message" aria-live="polite" className="sr-only">Increment is disabled.</span>}
      {isDecrementDisabled && <span id="decrement-disabled-message" aria-live="polite" className="sr-only">Decrement is disabled.</span>}
    </div>
  );
};

export default Counter;