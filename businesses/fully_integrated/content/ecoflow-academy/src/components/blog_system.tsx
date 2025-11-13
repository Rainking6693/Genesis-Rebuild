import React, { useState, useCallback, useEffect } from 'react';

interface CounterProps {
  /** The initial value of the counter. Defaults to 0. */
  initialCount?: number;
  /** The amount to increment or decrement the counter by. Defaults to 1. Must be a positive number. */
  incrementBy?: number;
  /** A callback function to be executed after the count changes.  Receives the new count as an argument. */
  onCountChange?: (newCount: number) => void;
  /** Aria label for the increment button.  Important for accessibility. */
  incrementAriaLabel?: string;
  /** Aria label for the decrement button. Important for accessibility. */
  decrementAriaLabel?: string;
  /** A maximum value the counter can reach.  Optional. */
  maxValue?: number;
  /** A minimum value the counter can reach. Optional. */
  minValue?: number;
  /** Disables the increment button. */
  disableIncrement?: boolean;
  /** Disables the decrement button. */
  disableDecrement?: boolean;
  /** Custom CSS class name for the counter container. */
  className?: string;
  /** Custom CSS class name for the count display. */
  countClassName?: string;
  /** Custom CSS class name for the increment button. */
  incrementButtonClassName?: string;
  /** Custom CSS class name for the decrement button. */
  decrementButtonClassName?: string;
}

/**
 * A flexible counter component suitable for various applications within a content business,
 * such as tracking comment counts, upvotes, or displaying progress.
 *
 *  - **Resiliency:** Handles edge cases like invalid `incrementBy` values and optional min/max values.
 *  - **Accessibility:** Includes `aria-label` attributes for improved screen reader support.
 *  - **Maintainability:** Uses `useCallback` to prevent unnecessary re-renders and improves code readability.
 *  - **Flexibility:**  Offers optional `onCountChange` callback, `minValue`, `maxValue`, and disable props.
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  onCountChange,
  incrementAriaLabel = 'Increment',
  decrementAriaLabel = 'Decrement',
  maxValue,
  minValue,
  disableIncrement = false,
  disableDecrement = false,
  className = '',
  countClassName = '',
  incrementButtonClassName = '',
  decrementButtonClassName = '',
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const [internalIncrementBy, setInternalIncrementBy] = useState(Math.abs(incrementBy));

  useEffect(() => {
    if (incrementBy <= 0) {
      console.warn("incrementBy must be a positive number.  Using absolute value.");
    }
    setInternalIncrementBy(Math.abs(incrementBy));
  }, [incrementBy]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      let newCount = prevCount + internalIncrementBy;
      if (maxValue !== undefined && newCount > maxValue) {
        newCount = maxValue;
      }

      if (newCount !== prevCount) {
        onCountChange?.(newCount);
      }
      return newCount;
    });
  }, [internalIncrementBy, maxValue, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      let newCount = prevCount - internalIncrementBy;
      if (minValue !== undefined && newCount < minValue) {
        newCount = minValue;
      }

      if (newCount !== prevCount) {
        onCountChange?.(newCount);
      }
      return newCount;
    });
  }, [internalIncrementBy, minValue, onCountChange]);

  const isIncrementDisabled = disableIncrement || (maxValue !== undefined && count >= maxValue);
  const isDecrementDisabled = disableDecrement || (minValue !== undefined && count <= minValue);

  return (
    <div className={`counter-container ${className}`}>
      <p aria-live="polite" className={`counter-count ${countClassName}`}>Count: {count}</p>
      <button
        onClick={increment}
        aria-label={incrementAriaLabel}
        disabled={isIncrementDisabled}
        className={`counter-increment-button ${incrementButtonClassName}`}
      >
        {incrementAriaLabel}
      </button>
      <button
        onClick={decrement}
        aria-label={decrementAriaLabel}
        disabled={isDecrementDisabled}
        className={`counter-decrement-button ${decrementButtonClassName}`}
      >
        {decrementAriaLabel}
      </button>
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useEffect } from 'react';

interface CounterProps {
  /** The initial value of the counter. Defaults to 0. */
  initialCount?: number;
  /** The amount to increment or decrement the counter by. Defaults to 1. Must be a positive number. */
  incrementBy?: number;
  /** A callback function to be executed after the count changes.  Receives the new count as an argument. */
  onCountChange?: (newCount: number) => void;
  /** Aria label for the increment button.  Important for accessibility. */
  incrementAriaLabel?: string;
  /** Aria label for the decrement button. Important for accessibility. */
  decrementAriaLabel?: string;
  /** A maximum value the counter can reach.  Optional. */
  maxValue?: number;
  /** A minimum value the counter can reach. Optional. */
  minValue?: number;
  /** Disables the increment button. */
  disableIncrement?: boolean;
  /** Disables the decrement button. */
  disableDecrement?: boolean;
  /** Custom CSS class name for the counter container. */
  className?: string;
  /** Custom CSS class name for the count display. */
  countClassName?: string;
  /** Custom CSS class name for the increment button. */
  incrementButtonClassName?: string;
  /** Custom CSS class name for the decrement button. */
  decrementButtonClassName?: string;
}

/**
 * A flexible counter component suitable for various applications within a content business,
 * such as tracking comment counts, upvotes, or displaying progress.
 *
 *  - **Resiliency:** Handles edge cases like invalid `incrementBy` values and optional min/max values.
 *  - **Accessibility:** Includes `aria-label` attributes for improved screen reader support.
 *  - **Maintainability:** Uses `useCallback` to prevent unnecessary re-renders and improves code readability.
 *  - **Flexibility:**  Offers optional `onCountChange` callback, `minValue`, `maxValue`, and disable props.
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  onCountChange,
  incrementAriaLabel = 'Increment',
  decrementAriaLabel = 'Decrement',
  maxValue,
  minValue,
  disableIncrement = false,
  disableDecrement = false,
  className = '',
  countClassName = '',
  incrementButtonClassName = '',
  decrementButtonClassName = '',
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const [internalIncrementBy, setInternalIncrementBy] = useState(Math.abs(incrementBy));

  useEffect(() => {
    if (incrementBy <= 0) {
      console.warn("incrementBy must be a positive number.  Using absolute value.");
    }
    setInternalIncrementBy(Math.abs(incrementBy));
  }, [incrementBy]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      let newCount = prevCount + internalIncrementBy;
      if (maxValue !== undefined && newCount > maxValue) {
        newCount = maxValue;
      }

      if (newCount !== prevCount) {
        onCountChange?.(newCount);
      }
      return newCount;
    });
  }, [internalIncrementBy, maxValue, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      let newCount = prevCount - internalIncrementBy;
      if (minValue !== undefined && newCount < minValue) {
        newCount = minValue;
      }

      if (newCount !== prevCount) {
        onCountChange?.(newCount);
      }
      return newCount;
    });
  }, [internalIncrementBy, minValue, onCountChange]);

  const isIncrementDisabled = disableIncrement || (maxValue !== undefined && count >= maxValue);
  const isDecrementDisabled = disableDecrement || (minValue !== undefined && count <= minValue);

  return (
    <div className={`counter-container ${className}`}>
      <p aria-live="polite" className={`counter-count ${countClassName}`}>Count: {count}</p>
      <button
        onClick={increment}
        aria-label={incrementAriaLabel}
        disabled={isIncrementDisabled}
        className={`counter-increment-button ${incrementButtonClassName}`}
      >
        {incrementAriaLabel}
      </button>
      <button
        onClick={decrement}
        aria-label={decrementAriaLabel}
        disabled={isDecrementDisabled}
        className={`counter-decrement-button ${decrementButtonClassName}`}
      >
        {decrementAriaLabel}
      </button>
    </div>
  );
};

export default Counter;