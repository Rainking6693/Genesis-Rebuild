import React, { useState, useCallback, useRef, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  min?: number | null;
  max?: number | null;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
  /** Optional class name for styling purposes. */
  className?: string;
  /** Optional style object for inline styling. */
  style?: React.CSSProperties;
}

/**
 * A robust counter component with increment and decrement functionality, including configurable limits,
 * accessibility enhancements, and side-effect handling.
 *
 * @param {CounterProps} props - The component's props.
 * @param {number} props.initialCount - The initial value of the counter (default: 0).
 * @param {number} props.incrementStep - The amount to increment/decrement by (default: 1).
 * @param {number | null} props.min - The minimum allowed value for the counter (optional, use null for no minimum).
 * @param {number | null} props.max - The maximum allowed value for the counter (optional, use null for no maximum).
 * @param {string} props.ariaLabelIncrement - Aria label for increment button (default: "Increment").
 * @param {string} props.ariaLabelDecrement - Aria label for decrement button (default: "Decrement").
 * @param {function} props.onCountChange - Callback function triggered when the count changes.
 * @param {string} props.className - Optional class name for styling.
 * @param {React.CSSProperties} props.style - Optional style object for inline styling.
 * @returns {JSX.Element} The rendered counter component.
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min = null,
  max = null,
  ariaLabelIncrement = "Increment",
  ariaLabelDecrement = "Decrement",
  onCountChange,
  className,
  style,
}) => {
  const [count, setCount] = useState(initialCount);
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
    setCount((prevCount) => {
      let newValue = prevCount + incrementStep;
      if (max !== null && newValue > max) {
        newValue = max; // Cap at max value
      }
      return newValue;
    });
  }, [incrementStep, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      let newValue = prevCount - incrementStep;
      if (min !== null && newValue < min) {
        newValue = min; // Cap at min value
      }
      return newValue;
    });
  }, [incrementStep, min]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault(); // Prevent scrolling
        increment();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault(); // Prevent scrolling
        decrement();
      }
    },
    [increment, decrement]
  );

  const isIncrementDisabled = max !== null && count >= max;
  const isDecrementDisabled = min !== null && count <= min;

  return (
    <div
      className={className}
      style={style}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
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

import React, { useState, useCallback, useRef, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  min?: number | null;
  max?: number | null;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
  /** Optional class name for styling purposes. */
  className?: string;
  /** Optional style object for inline styling. */
  style?: React.CSSProperties;
}

/**
 * A robust counter component with increment and decrement functionality, including configurable limits,
 * accessibility enhancements, and side-effect handling.
 *
 * @param {CounterProps} props - The component's props.
 * @param {number} props.initialCount - The initial value of the counter (default: 0).
 * @param {number} props.incrementStep - The amount to increment/decrement by (default: 1).
 * @param {number | null} props.min - The minimum allowed value for the counter (optional, use null for no minimum).
 * @param {number | null} props.max - The maximum allowed value for the counter (optional, use null for no maximum).
 * @param {string} props.ariaLabelIncrement - Aria label for increment button (default: "Increment").
 * @param {string} props.ariaLabelDecrement - Aria label for decrement button (default: "Decrement").
 * @param {function} props.onCountChange - Callback function triggered when the count changes.
 * @param {string} props.className - Optional class name for styling.
 * @param {React.CSSProperties} props.style - Optional style object for inline styling.
 * @returns {JSX.Element} The rendered counter component.
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min = null,
  max = null,
  ariaLabelIncrement = "Increment",
  ariaLabelDecrement = "Decrement",
  onCountChange,
  className,
  style,
}) => {
  const [count, setCount] = useState(initialCount);
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
    setCount((prevCount) => {
      let newValue = prevCount + incrementStep;
      if (max !== null && newValue > max) {
        newValue = max; // Cap at max value
      }
      return newValue;
    });
  }, [incrementStep, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      let newValue = prevCount - incrementStep;
      if (min !== null && newValue < min) {
        newValue = min; // Cap at min value
      }
      return newValue;
    });
  }, [incrementStep, min]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault(); // Prevent scrolling
        increment();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault(); // Prevent scrolling
        decrement();
      }
    },
    [increment, decrement]
  );

  const isIncrementDisabled = max !== null && count >= max;
  const isDecrementDisabled = min !== null && count <= min;

  return (
    <div
      className={className}
      style={style}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
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