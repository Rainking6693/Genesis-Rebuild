import React, { useState, useCallback, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
  /**
   * A custom class name to apply to the container div.
   */
  className?: string;
  /**
   * A custom style object to apply to the container div.
   */
  style?: React.CSSProperties;
  /**
   * Debounce time in milliseconds for the onCountChange callback.
   * Useful to prevent excessive calls when the count changes rapidly.
   */
  debounceMs?: number;
}

/**
 * A simple counter component with increment and decrement functionality.
 * Includes optional min/max values and callback for count changes.
 *
 * @param {CounterProps} props - The component's props.
 * @param {number} props.initialCount - The initial value of the counter (default: 0).
 * @param {number} props.incrementStep - The amount to increment/decrement by (default: 1).
 * @param {number} props.min - The minimum allowed value for the counter (optional).
 * @param {number} props.max - The maximum allowed value for the counter (optional).
 * @param {string} props.ariaLabelIncrement - Aria label for increment button (optional).
 * @param {string} props.ariaLabelDecrement - Aria label for decrement button (optional).
 * @param {function} props.onCountChange - Callback function when count changes (optional).
 * @param {string} props.className - Custom CSS class for the container.
 * @param {React.CSSProperties} props.style - Custom styles for the container.
 * @param {number} props.debounceMs - Debounce time for onCountChange callback.
 * @returns {JSX.Element} The rendered counter component.
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min,
  max,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
  className,
  style,
  debounceMs = 0,
}) => {
  const [count, setCount] = useState(initialCount);

  // Validate props
  useEffect(() => {
    if (min !== undefined && max !== undefined && min > max) {
      console.error("Counter: min prop cannot be greater than max prop.");
    }
    if (incrementStep <= 0) {
      console.error("Counter: incrementStep must be a positive number.");
    }
  }, [min, max, incrementStep]);

  useEffect(() => {
    setCount(initialCount); // Reset count when initialCount prop changes
  }, [initialCount]);

  // Debounce the onCountChange callback
  const debouncedOnCountChange = useCallback(
    (currentCount: number) => {
      if (onCountChange) {
        const timeoutId = setTimeout(() => {
          onCountChange(currentCount);
        }, debounceMs);

        return () => clearTimeout(timeoutId); // Cleanup function
      }
      return () => {};
    },
    [onCountChange, debounceMs]
  );

  useEffect(() => {
    const cleanup = debouncedOnCountChange(count);
    return cleanup;
  }, [count, debouncedOnCountChange]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      let newValue = prevCount + incrementStep;

      if (max !== undefined && newValue > max) {
        newValue = max;
      }

      return newValue;
    });
  }, [incrementStep, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      let newValue = prevCount - incrementStep;

      if (min !== undefined && newValue < min) {
        newValue = min;
      }

      return newValue;
    });
  }, [incrementStep, min]);

  const isIncrementDisabled = max !== undefined && count >= max;
  const isDecrementDisabled = min !== undefined && count <= min;

  return (
    <div className={className} style={style}>
      <p aria-live="polite">Count: {count}</p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={isIncrementDisabled}
      >
        {ariaLabelIncrement}
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={isDecrementDisabled}
      >
        {ariaLabelDecrement}
      </button>
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
  /**
   * A custom class name to apply to the container div.
   */
  className?: string;
  /**
   * A custom style object to apply to the container div.
   */
  style?: React.CSSProperties;
  /**
   * Debounce time in milliseconds for the onCountChange callback.
   * Useful to prevent excessive calls when the count changes rapidly.
   */
  debounceMs?: number;
}

/**
 * A simple counter component with increment and decrement functionality.
 * Includes optional min/max values and callback for count changes.
 *
 * @param {CounterProps} props - The component's props.
 * @param {number} props.initialCount - The initial value of the counter (default: 0).
 * @param {number} props.incrementStep - The amount to increment/decrement by (default: 1).
 * @param {number} props.min - The minimum allowed value for the counter (optional).
 * @param {number} props.max - The maximum allowed value for the counter (optional).
 * @param {string} props.ariaLabelIncrement - Aria label for increment button (optional).
 * @param {string} props.ariaLabelDecrement - Aria label for decrement button (optional).
 * @param {function} props.onCountChange - Callback function when count changes (optional).
 * @param {string} props.className - Custom CSS class for the container.
 * @param {React.CSSProperties} props.style - Custom styles for the container.
 * @param {number} props.debounceMs - Debounce time for onCountChange callback.
 * @returns {JSX.Element} The rendered counter component.
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min,
  max,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
  className,
  style,
  debounceMs = 0,
}) => {
  const [count, setCount] = useState(initialCount);

  // Validate props
  useEffect(() => {
    if (min !== undefined && max !== undefined && min > max) {
      console.error("Counter: min prop cannot be greater than max prop.");
    }
    if (incrementStep <= 0) {
      console.error("Counter: incrementStep must be a positive number.");
    }
  }, [min, max, incrementStep]);

  useEffect(() => {
    setCount(initialCount); // Reset count when initialCount prop changes
  }, [initialCount]);

  // Debounce the onCountChange callback
  const debouncedOnCountChange = useCallback(
    (currentCount: number) => {
      if (onCountChange) {
        const timeoutId = setTimeout(() => {
          onCountChange(currentCount);
        }, debounceMs);

        return () => clearTimeout(timeoutId); // Cleanup function
      }
      return () => {};
    },
    [onCountChange, debounceMs]
  );

  useEffect(() => {
    const cleanup = debouncedOnCountChange(count);
    return cleanup;
  }, [count, debouncedOnCountChange]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      let newValue = prevCount + incrementStep;

      if (max !== undefined && newValue > max) {
        newValue = max;
      }

      return newValue;
    });
  }, [incrementStep, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      let newValue = prevCount - incrementStep;

      if (min !== undefined && newValue < min) {
        newValue = min;
      }

      return newValue;
    });
  }, [incrementStep, min]);

  const isIncrementDisabled = max !== undefined && count >= max;
  const isDecrementDisabled = min !== undefined && count <= min;

  return (
    <div className={className} style={style}>
      <p aria-live="polite">Count: {count}</p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={isIncrementDisabled}
      >
        {ariaLabelIncrement}
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={isDecrementDisabled}
      >
        {ariaLabelDecrement}
      </button>
    </div>
  );
};

export default Counter;