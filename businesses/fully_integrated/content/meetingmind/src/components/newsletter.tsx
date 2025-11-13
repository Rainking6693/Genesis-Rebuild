import React, { useState, useCallback, useRef, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
  /**
   * A function to format the count for display.
   * @param count The current count value.
   * @returns The formatted count string.
   */
  formatCount?: (count: number) => string;
  /**
   *  Callback function when increment/decrement is blocked due to min/max limits.
   */
  onLimitReached?: (type: 'min' | 'max') => void;
}

/**
 * A simple counter component with increment and decrement buttons.
 * Includes configurable min/max values, accessibility improvements,
 * and a callback for when the count changes.
 *
 * @param {CounterProps} props - The component's props.
 * @param {number} props.initialCount - The initial value of the counter (default: 0).
 * @param {number} props.incrementStep - The amount to increment/decrement by (default: 1).
 * @param {number} props.min - The minimum allowed value (default: undefined, no minimum).
 * @param {number} props.max - The maximum allowed value (default: undefined, no maximum).
 * @param {string} props.ariaLabelIncrement - Aria label for increment button (default: "Increment").
 * @param {string} props.ariaLabelDecrement - Aria label for decrement button (default: "Decrement").
 * @param {function} props.onCountChange - Callback function when count changes.
 * @param {function} props.formatCount - Function to format the count for display.
 * @param {function} props.onLimitReached - Callback when min/max limit is reached.
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min,
  max,
  ariaLabelIncrement = "Increment",
  ariaLabelDecrement = "Decrement",
  onCountChange,
  formatCount = (count) => count.toString(),
  onLimitReached,
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
      const newValue = prevCount + incrementStep;
      if (max !== undefined && newValue > max) {
        onLimitReached?.('max');
        return prevCount;
      }
      return newValue;
    });
  }, [incrementStep, max, onLimitReached]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newValue = prevCount - incrementStep;
      if (min !== undefined && newValue < min) {
        onLimitReached?.('min');
        return prevCount;
      }
      return newValue;
    });
  }, [incrementStep, min, onLimitReached]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        increment();
      } else if (event.key === 'ArrowDown') {
        decrement();
      }
    },
    [increment, decrement]
  );

  const isIncrementDisabled = max !== undefined && countRef.current >= max;
  const isDecrementDisabled = min !== undefined && countRef.current <= min;

  return (
    <div onKeyDown={handleKeyDown} tabIndex={0}>
      <p aria-live="polite">Count: {formatCount(count)}</p>
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
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
  /**
   * A function to format the count for display.
   * @param count The current count value.
   * @returns The formatted count string.
   */
  formatCount?: (count: number) => string;
  /**
   *  Callback function when increment/decrement is blocked due to min/max limits.
   */
  onLimitReached?: (type: 'min' | 'max') => void;
}

/**
 * A simple counter component with increment and decrement buttons.
 * Includes configurable min/max values, accessibility improvements,
 * and a callback for when the count changes.
 *
 * @param {CounterProps} props - The component's props.
 * @param {number} props.initialCount - The initial value of the counter (default: 0).
 * @param {number} props.incrementStep - The amount to increment/decrement by (default: 1).
 * @param {number} props.min - The minimum allowed value (default: undefined, no minimum).
 * @param {number} props.max - The maximum allowed value (default: undefined, no maximum).
 * @param {string} props.ariaLabelIncrement - Aria label for increment button (default: "Increment").
 * @param {string} props.ariaLabelDecrement - Aria label for decrement button (default: "Decrement").
 * @param {function} props.onCountChange - Callback function when count changes.
 * @param {function} props.formatCount - Function to format the count for display.
 * @param {function} props.onLimitReached - Callback when min/max limit is reached.
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min,
  max,
  ariaLabelIncrement = "Increment",
  ariaLabelDecrement = "Decrement",
  onCountChange,
  formatCount = (count) => count.toString(),
  onLimitReached,
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
      const newValue = prevCount + incrementStep;
      if (max !== undefined && newValue > max) {
        onLimitReached?.('max');
        return prevCount;
      }
      return newValue;
    });
  }, [incrementStep, max, onLimitReached]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newValue = prevCount - incrementStep;
      if (min !== undefined && newValue < min) {
        onLimitReached?.('min');
        return prevCount;
      }
      return newValue;
    });
  }, [incrementStep, min, onLimitReached]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        increment();
      } else if (event.key === 'ArrowDown') {
        decrement();
      }
    },
    [increment, decrement]
  );

  const isIncrementDisabled = max !== undefined && countRef.current >= max;
  const isDecrementDisabled = min !== undefined && countRef.current <= min;

  return (
    <div onKeyDown={handleKeyDown} tabIndex={0}>
      <p aria-live="polite">Count: {formatCount(count)}</p>
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