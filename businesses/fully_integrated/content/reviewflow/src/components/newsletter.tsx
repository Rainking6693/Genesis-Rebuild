import React, { useState, useCallback, useRef, useEffect } from 'react';

interface CounterProps {
  initialCount?: number | string; // Allow string input for initialCount
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
  disabled?: boolean; // Add a disabled prop
}

/**
 * A simple counter component with increment and decrement functionality.
 * Includes optional min/max values and a callback for count changes.
 *
 * @param {CounterProps} props - The component's props.
 * @param {number | string} props.initialCount - The initial value of the counter (default: 0). Accepts string to handle potential input errors.
 * @param {number} props.incrementStep - The amount to increment/decrement by (default: 1).
 * @param {number} props.min - The minimum allowed value for the counter (optional).
 * @param {number} props.max - The maximum allowed value for the counter (optional).
 * @param {string} props.ariaLabelIncrement - Aria label for increment button (default: "Increment").
 * @param {string} props.ariaLabelDecrement - Aria label for decrement button (default: "Decrement").
 * @param {function} props.onCountChange - Callback function to execute when the count changes.
 * @param {boolean} props.disabled - Disables the increment and decrement buttons (default: false).
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min,
  max,
  ariaLabelIncrement = "Increment",
  ariaLabelDecrement = "Decrement",
  onCountChange,
  disabled = false,
}) => {
  const initialCountNumber = typeof initialCount === 'string' ? parseInt(initialCount, 10) : initialCount;
  const [count, setCount] = useState(Number.isNaN(initialCountNumber) ? 0 : initialCountNumber); // Handle NaN case

  const countRef = useRef(count);

  useEffect(() => {
    countRef.current = count;
  }, [count]);

  useEffect(() => {
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  const increment = useCallback(() => {
    if (disabled) return; // Prevent increment if disabled

    setCount((prevCount) => {
      const newValue = prevCount + incrementStep;
      if (max !== undefined && newValue > max) {
        return prevCount;
      }
      return newValue;
    });
  }, [incrementStep, max, disabled]);

  const decrement = useCallback(() => {
    if (disabled) return; // Prevent decrement if disabled

    setCount((prevCount) => {
      const newValue = prevCount - incrementStep;
      if (min !== undefined && newValue < min) {
        return prevCount;
      }
      return newValue;
    });
  }, [incrementStep, min, disabled]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled) return; // Prevent keydown if disabled

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const target = event.target as HTMLElement;
        if (target.getAttribute('aria-label') === ariaLabelIncrement) {
          increment();
        } else if (target.getAttribute('aria-label') === ariaLabelDecrement) {
          decrement();
        }
      }
    },
    [increment, decrement, ariaLabelIncrement, ariaLabelDecrement, disabled]
  );

  // Handle potential errors in incrementStep, min, and max
  const safeIncrementStep = typeof incrementStep === 'number' && !Number.isNaN(incrementStep) && incrementStep > 0 ? incrementStep : 1;
  const safeMin = typeof min === 'number' && !Number.isNaN(min) ? min : undefined;
  const safeMax = typeof max === 'number' && !Number.isNaN(max) ? max : undefined;

  return (
    <div>
      <p aria-live="polite">Count: {count}</p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      >
        {ariaLabelIncrement}
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      >
        {ariaLabelDecrement}
      </button>
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useRef, useEffect } from 'react';

interface CounterProps {
  initialCount?: number | string; // Allow string input for initialCount
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
  disabled?: boolean; // Add a disabled prop
}

/**
 * A simple counter component with increment and decrement functionality.
 * Includes optional min/max values and a callback for count changes.
 *
 * @param {CounterProps} props - The component's props.
 * @param {number | string} props.initialCount - The initial value of the counter (default: 0). Accepts string to handle potential input errors.
 * @param {number} props.incrementStep - The amount to increment/decrement by (default: 1).
 * @param {number} props.min - The minimum allowed value for the counter (optional).
 * @param {number} props.max - The maximum allowed value for the counter (optional).
 * @param {string} props.ariaLabelIncrement - Aria label for increment button (default: "Increment").
 * @param {string} props.ariaLabelDecrement - Aria label for decrement button (default: "Decrement").
 * @param {function} props.onCountChange - Callback function to execute when the count changes.
 * @param {boolean} props.disabled - Disables the increment and decrement buttons (default: false).
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min,
  max,
  ariaLabelIncrement = "Increment",
  ariaLabelDecrement = "Decrement",
  onCountChange,
  disabled = false,
}) => {
  const initialCountNumber = typeof initialCount === 'string' ? parseInt(initialCount, 10) : initialCount;
  const [count, setCount] = useState(Number.isNaN(initialCountNumber) ? 0 : initialCountNumber); // Handle NaN case

  const countRef = useRef(count);

  useEffect(() => {
    countRef.current = count;
  }, [count]);

  useEffect(() => {
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  const increment = useCallback(() => {
    if (disabled) return; // Prevent increment if disabled

    setCount((prevCount) => {
      const newValue = prevCount + incrementStep;
      if (max !== undefined && newValue > max) {
        return prevCount;
      }
      return newValue;
    });
  }, [incrementStep, max, disabled]);

  const decrement = useCallback(() => {
    if (disabled) return; // Prevent decrement if disabled

    setCount((prevCount) => {
      const newValue = prevCount - incrementStep;
      if (min !== undefined && newValue < min) {
        return prevCount;
      }
      return newValue;
    });
  }, [incrementStep, min, disabled]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled) return; // Prevent keydown if disabled

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const target = event.target as HTMLElement;
        if (target.getAttribute('aria-label') === ariaLabelIncrement) {
          increment();
        } else if (target.getAttribute('aria-label') === ariaLabelDecrement) {
          decrement();
        }
      }
    },
    [increment, decrement, ariaLabelIncrement, ariaLabelDecrement, disabled]
  );

  // Handle potential errors in incrementStep, min, and max
  const safeIncrementStep = typeof incrementStep === 'number' && !Number.isNaN(incrementStep) && incrementStep > 0 ? incrementStep : 1;
  const safeMin = typeof min === 'number' && !Number.isNaN(min) ? min : undefined;
  const safeMax = typeof max === 'number' && !Number.isNaN(max) ? max : undefined;

  return (
    <div>
      <p aria-live="polite">Count: {count}</p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      >
        {ariaLabelIncrement}
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      >
        {ariaLabelDecrement}
      </button>
    </div>
  );
};

export default Counter;