import React, { useState, useCallback, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  decrementStep?: number; // Allow separate decrement step
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
  onError?: (message: string) => void; // Callback for error handling
  disabled?: boolean; // Prop to disable the entire counter
}

/**
 * A simple counter component with increment and decrement buttons.
 * Includes configurable min/max values, custom aria labels, a callback for count changes, and error handling.
 *
 * @param {CounterProps} props - The component's props.
 * @param {number} props.initialCount - The initial value of the counter (default: 0).
 * @param {number} props.incrementStep - The amount to increment the counter by (default: 1).
 * @param {number} props.decrementStep - The amount to decrement the counter by (default: 1).
 * @param {number} props.min - The minimum allowed value for the counter (default: undefined, no minimum).
 * @param {number} props.max - The maximum allowed value for the counter (default: undefined, no maximum).
 * @param {string} props.ariaLabelIncrement - Custom aria label for the increment button (default: "Increment").
 * @param {string} props.ariaLabelDecrement - Custom aria label for the decrement button (default: "Decrement").
 * @param {function} props.onCountChange - Callback function called when the count changes.
 * @param {function} props.onError - Callback function called when an error occurs (e.g., exceeding min/max).
 * @param {boolean} props.disabled - Disables the entire counter component.
 * @returns {JSX.Element} The rendered counter component.
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  decrementStep = 1,
  min,
  max,
  ariaLabelIncrement = "Increment",
  ariaLabelDecrement = "Decrement",
  onCountChange,
  onError,
  disabled = false,
}) => {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  const increment = useCallback(() => {
    if (disabled) return;

    setCount((prevCount) => {
      const newValue = prevCount + incrementStep;
      if (max !== undefined && newValue > max) {
        if (onError) {
          onError(`Maximum value (${max}) exceeded.`);
        }
        return prevCount;
      }
      return newValue;
    });
  }, [incrementStep, max, onError, disabled]);

  const decrement = useCallback(() => {
    if (disabled) return;

    setCount((prevCount) => {
      const newValue = prevCount - decrementStep;
      if (min !== undefined && newValue < min) {
        if (onError) {
          onError(`Minimum value (${min}) exceeded.`);
        }
        return prevCount;
      }
      return newValue;
    });
  }, [decrementStep, min, onError, disabled]);

  const handleIncrementClick = () => {
    increment();
  };

  const handleDecrementClick = () => {
    decrement();
  };

  const isIncrementDisabled = disabled || (max !== undefined && count >= max);
  const isDecrementDisabled = disabled || (min !== undefined && count <= min);

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {count}</p>
      <button
        onClick={handleIncrementClick}
        aria-label={ariaLabelIncrement}
        disabled={isIncrementDisabled}
      >
        Increment
      </button>
      <button
        onClick={handleDecrementClick}
        aria-label={ariaLabelDecrement}
        disabled={isDecrementDisabled}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  decrementStep?: number; // Allow separate decrement step
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
  onError?: (message: string) => void; // Callback for error handling
  disabled?: boolean; // Prop to disable the entire counter
}

/**
 * A simple counter component with increment and decrement buttons.
 * Includes configurable min/max values, custom aria labels, a callback for count changes, and error handling.
 *
 * @param {CounterProps} props - The component's props.
 * @param {number} props.initialCount - The initial value of the counter (default: 0).
 * @param {number} props.incrementStep - The amount to increment the counter by (default: 1).
 * @param {number} props.decrementStep - The amount to decrement the counter by (default: 1).
 * @param {number} props.min - The minimum allowed value for the counter (default: undefined, no minimum).
 * @param {number} props.max - The maximum allowed value for the counter (default: undefined, no maximum).
 * @param {string} props.ariaLabelIncrement - Custom aria label for the increment button (default: "Increment").
 * @param {string} props.ariaLabelDecrement - Custom aria label for the decrement button (default: "Decrement").
 * @param {function} props.onCountChange - Callback function called when the count changes.
 * @param {function} props.onError - Callback function called when an error occurs (e.g., exceeding min/max).
 * @param {boolean} props.disabled - Disables the entire counter component.
 * @returns {JSX.Element} The rendered counter component.
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  decrementStep = 1,
  min,
  max,
  ariaLabelIncrement = "Increment",
  ariaLabelDecrement = "Decrement",
  onCountChange,
  onError,
  disabled = false,
}) => {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  const increment = useCallback(() => {
    if (disabled) return;

    setCount((prevCount) => {
      const newValue = prevCount + incrementStep;
      if (max !== undefined && newValue > max) {
        if (onError) {
          onError(`Maximum value (${max}) exceeded.`);
        }
        return prevCount;
      }
      return newValue;
    });
  }, [incrementStep, max, onError, disabled]);

  const decrement = useCallback(() => {
    if (disabled) return;

    setCount((prevCount) => {
      const newValue = prevCount - decrementStep;
      if (min !== undefined && newValue < min) {
        if (onError) {
          onError(`Minimum value (${min}) exceeded.`);
        }
        return prevCount;
      }
      return newValue;
    });
  }, [decrementStep, min, onError, disabled]);

  const handleIncrementClick = () => {
    increment();
  };

  const handleDecrementClick = () => {
    decrement();
  };

  const isIncrementDisabled = disabled || (max !== undefined && count >= max);
  const isDecrementDisabled = disabled || (min !== undefined && count <= min);

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {count}</p>
      <button
        onClick={handleIncrementClick}
        aria-label={ariaLabelIncrement}
        disabled={isIncrementDisabled}
      >
        Increment
      </button>
      <button
        onClick={handleDecrementClick}
        aria-label={ariaLabelDecrement}
        disabled={isDecrementDisabled}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;