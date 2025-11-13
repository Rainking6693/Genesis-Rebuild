import React, { useState, useCallback, useRef, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  decrementStep?: number; // Added decrementStep for flexibility
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
  disabled?: boolean; // Added disabled prop to disable the entire counter
  id?: string; // Added id prop for better accessibility and testing
}

/**
 * A simple counter component with increment and decrement functionality.
 * Includes optional min/max values, accessibility improvements, and a callback for count changes.
 *
 * @param {CounterProps} props - The component's props.
 * @param {number} props.initialCount - The initial value of the counter (default: 0).
 * @param {number} props.incrementStep - The amount to increment by (default: 1).
 * @param {number} props.decrementStep - The amount to decrement by (default: 1).
 * @param {number} props.min - The minimum allowed value for the counter (optional).
 * @param {number} props.max - The maximum allowed value for the counter (optional).
 * @param {string} props.ariaLabelIncrement - Aria label for increment button (optional).
 * @param {string} props.ariaLabelDecrement - Aria label for decrement button (optional).
 * @param {Function} props.onCountChange - Callback function when count changes (optional).
 * @param {boolean} props.disabled - Disables the entire counter (optional).
 * @param {string} props.id - Id for the counter component (optional).
 * @returns {JSX.Element} The rendered counter component.
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  decrementStep = 1,
  min,
  max,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
  disabled = false,
  id = 'counter',
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const countRef = useRef<number>(count);
  const [isIncrementDisabled, setIsIncrementDisabled] = useState<boolean>(false);
  const [isDecrementDisabled, setIsDecrementDisabled] = useState<boolean>(false);

  // Validate props
  useEffect(() => {
    if (min !== undefined && max !== undefined && min > max) {
      console.error("Counter: min value cannot be greater than max value.");
    }
    if (incrementStep <= 0) {
      console.error("Counter: incrementStep must be a positive number.");
    }
    if (decrementStep <= 0) {
      console.error("Counter: decrementStep must be a positive number.");
    }
  }, [min, max, incrementStep, decrementStep]);

  useEffect(() => {
    countRef.current = count;
  }, [count]);

  useEffect(() => {
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  useEffect(() => {
    setIsIncrementDisabled(disabled || (max !== undefined && count >= max));
    setIsDecrementDisabled(disabled || (min !== undefined && count <= min));
  }, [count, max, min, disabled]);

  const increment = useCallback(() => {
    if (disabled) return;

    setCount((prevCount) => {
      const newValue = prevCount + incrementStep;
      if (max !== undefined && newValue > max) {
        return prevCount; // Don't increment if it exceeds the max
      }
      return newValue;
    });
  }, [incrementStep, max, disabled]);

  const decrement = useCallback(() => {
    if (disabled) return;

    setCount((prevCount) => {
      const newValue = prevCount - decrementStep;
      if (min !== undefined && newValue < min) {
        return prevCount; // Don't decrement if it goes below the min
      }
      return newValue;
    });
  }, [decrementStep, min, disabled]);

  return (
    <div id={id}>
      <p aria-live="polite" id={`${id}-value`}>
        Count: {count}
      </p>
      <button
        onClick={increment}
        disabled={isIncrementDisabled}
        aria-label={ariaLabelIncrement}
        aria-describedby={`${id}-value`}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        disabled={isDecrementDisabled}
        aria-label={ariaLabelDecrement}
        aria-describedby={`${id}-value`}
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
  decrementStep?: number; // Added decrementStep for flexibility
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
  disabled?: boolean; // Added disabled prop to disable the entire counter
  id?: string; // Added id prop for better accessibility and testing
}

/**
 * A simple counter component with increment and decrement functionality.
 * Includes optional min/max values, accessibility improvements, and a callback for count changes.
 *
 * @param {CounterProps} props - The component's props.
 * @param {number} props.initialCount - The initial value of the counter (default: 0).
 * @param {number} props.incrementStep - The amount to increment by (default: 1).
 * @param {number} props.decrementStep - The amount to decrement by (default: 1).
 * @param {number} props.min - The minimum allowed value for the counter (optional).
 * @param {number} props.max - The maximum allowed value for the counter (optional).
 * @param {string} props.ariaLabelIncrement - Aria label for increment button (optional).
 * @param {string} props.ariaLabelDecrement - Aria label for decrement button (optional).
 * @param {Function} props.onCountChange - Callback function when count changes (optional).
 * @param {boolean} props.disabled - Disables the entire counter (optional).
 * @param {string} props.id - Id for the counter component (optional).
 * @returns {JSX.Element} The rendered counter component.
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  decrementStep = 1,
  min,
  max,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
  disabled = false,
  id = 'counter',
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const countRef = useRef<number>(count);
  const [isIncrementDisabled, setIsIncrementDisabled] = useState<boolean>(false);
  const [isDecrementDisabled, setIsDecrementDisabled] = useState<boolean>(false);

  // Validate props
  useEffect(() => {
    if (min !== undefined && max !== undefined && min > max) {
      console.error("Counter: min value cannot be greater than max value.");
    }
    if (incrementStep <= 0) {
      console.error("Counter: incrementStep must be a positive number.");
    }
    if (decrementStep <= 0) {
      console.error("Counter: decrementStep must be a positive number.");
    }
  }, [min, max, incrementStep, decrementStep]);

  useEffect(() => {
    countRef.current = count;
  }, [count]);

  useEffect(() => {
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  useEffect(() => {
    setIsIncrementDisabled(disabled || (max !== undefined && count >= max));
    setIsDecrementDisabled(disabled || (min !== undefined && count <= min));
  }, [count, max, min, disabled]);

  const increment = useCallback(() => {
    if (disabled) return;

    setCount((prevCount) => {
      const newValue = prevCount + incrementStep;
      if (max !== undefined && newValue > max) {
        return prevCount; // Don't increment if it exceeds the max
      }
      return newValue;
    });
  }, [incrementStep, max, disabled]);

  const decrement = useCallback(() => {
    if (disabled) return;

    setCount((prevCount) => {
      const newValue = prevCount - decrementStep;
      if (min !== undefined && newValue < min) {
        return prevCount; // Don't decrement if it goes below the min
      }
      return newValue;
    });
  }, [decrementStep, min, disabled]);

  return (
    <div id={id}>
      <p aria-live="polite" id={`${id}-value`}>
        Count: {count}
      </p>
      <button
        onClick={increment}
        disabled={isIncrementDisabled}
        aria-label={ariaLabelIncrement}
        aria-describedby={`${id}-value`}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        disabled={isDecrementDisabled}
        aria-label={ariaLabelDecrement}
        aria-describedby={`${id}-value`}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;