import React, { useState, useCallback, useMemo } from 'react';

interface CounterProps {
  /**
   * The initial value of the counter. Defaults to 0.
   */
  initialCount?: number;
  /**
   * The amount to increment or decrement the counter by. Defaults to 1.  Must be a positive number.
   */
  incrementBy?: number;
  /**
   * A maximum value the counter can reach.  If undefined, there is no maximum.
   */
  maxCount?: number;
  /**
   * A minimum value the counter can reach. If undefined, there is no minimum.
   */
  minCount?: number;
  /**
   *  A callback function that is called when the count changes.
   *  @param newCount The new count value.
   */
  onCountChange?: (newCount: number) => void;
  /**
   *  A callback function that is called when the counter reaches the maximum value.
   */
  onMaxCountReached?: () => void;
  /**
   *  A callback function that is called when the counter reaches the minimum value.
   */
  onMinCountReached?: () => void;
  /**
   *  A label for the increment button.  Defaults to "Increment".
   */
  incrementButtonLabel?: string;
  /**
   *  A label for the decrement button.  Defaults to "Decrement".
   */
  decrementButtonLabel?: string;
  /**
   *  A CSS class to apply to the container div.
   */
  className?: string;
  /**
   *  A CSS class to apply to the count paragraph.
   */
  countClassName?: string;
  /**
   *  A CSS class to apply to the increment button.
   */
  incrementButtonClassName?: string;
  /**
   *  A CSS class to apply to the decrement button.
   */
  decrementButtonClassName?: string;
  /**
   *  A boolean to disable the increment button.
   */
  disableIncrement?: boolean;
  /**
   *  A boolean to disable the decrement button.
   */
  disableDecrement?: boolean;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  maxCount,
  minCount,
  onCountChange,
  onMaxCountReached,
  onMinCountReached,
  incrementButtonLabel = 'Increment',
  decrementButtonLabel = 'Decrement',
  className,
  countClassName,
  incrementButtonClassName,
  decrementButtonClassName,
  disableIncrement,
  disableDecrement,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Validate incrementBy prop
  const validatedIncrementBy = useMemo(() => {
    if (typeof incrementBy !== 'number' || incrementBy <= 0) {
      console.warn(
        'Counter: incrementBy must be a positive number.  Using default value of 1.'
      );
      return 1;
    }
    return incrementBy;
  }, [incrementBy]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + validatedIncrementBy;

      if (maxCount !== undefined && newCount > maxCount) {
        onMaxCountReached?.();
        return prevCount; // Don't increment if it exceeds maxCount
      }

      onCountChange?.(newCount);
      return newCount;
    });
  }, [validatedIncrementBy, maxCount, onCountChange, onMaxCountReached]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - validatedIncrementBy;

      if (minCount !== undefined && newCount < minCount) {
        onMinCountReached?.();
        return prevCount; // Don't decrement if it goes below minCount
      }

      onCountChange?.(newCount);
      return newCount;
    });
  }, [validatedIncrementBy, minCount, onCountChange, onMinCountReached]);

  const isIncrementDisabled = useMemo(() => {
    if (disableIncrement) return true;
    if (maxCount !== undefined && count >= maxCount) return true;
    return false;
  }, [count, maxCount, disableIncrement]);

  const isDecrementDisabled = useMemo(() => {
    if (disableDecrement) return true;
    if (minCount !== undefined && count <= minCount) return true;
    return false;
  }, [count, minCount, disableDecrement]);

  return (
    <div className={className}>
      <p className={countClassName} aria-live="polite">
        Count: {count}
      </p>
      <button
        onClick={increment}
        disabled={isIncrementDisabled}
        className={incrementButtonClassName}
        aria-label="Increment counter"
      >
        {incrementButtonLabel}
      </button>
      <button
        onClick={decrement}
        disabled={isDecrementDisabled}
        className={decrementButtonClassName}
        aria-label="Decrement counter"
      >
        {decrementButtonLabel}
      </button>
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useMemo } from 'react';

interface CounterProps {
  /**
   * The initial value of the counter. Defaults to 0.
   */
  initialCount?: number;
  /**
   * The amount to increment or decrement the counter by. Defaults to 1.  Must be a positive number.
   */
  incrementBy?: number;
  /**
   * A maximum value the counter can reach.  If undefined, there is no maximum.
   */
  maxCount?: number;
  /**
   * A minimum value the counter can reach. If undefined, there is no minimum.
   */
  minCount?: number;
  /**
   *  A callback function that is called when the count changes.
   *  @param newCount The new count value.
   */
  onCountChange?: (newCount: number) => void;
  /**
   *  A callback function that is called when the counter reaches the maximum value.
   */
  onMaxCountReached?: () => void;
  /**
   *  A callback function that is called when the counter reaches the minimum value.
   */
  onMinCountReached?: () => void;
  /**
   *  A label for the increment button.  Defaults to "Increment".
   */
  incrementButtonLabel?: string;
  /**
   *  A label for the decrement button.  Defaults to "Decrement".
   */
  decrementButtonLabel?: string;
  /**
   *  A CSS class to apply to the container div.
   */
  className?: string;
  /**
   *  A CSS class to apply to the count paragraph.
   */
  countClassName?: string;
  /**
   *  A CSS class to apply to the increment button.
   */
  incrementButtonClassName?: string;
  /**
   *  A CSS class to apply to the decrement button.
   */
  decrementButtonClassName?: string;
  /**
   *  A boolean to disable the increment button.
   */
  disableIncrement?: boolean;
  /**
   *  A boolean to disable the decrement button.
   */
  disableDecrement?: boolean;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  maxCount,
  minCount,
  onCountChange,
  onMaxCountReached,
  onMinCountReached,
  incrementButtonLabel = 'Increment',
  decrementButtonLabel = 'Decrement',
  className,
  countClassName,
  incrementButtonClassName,
  decrementButtonClassName,
  disableIncrement,
  disableDecrement,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Validate incrementBy prop
  const validatedIncrementBy = useMemo(() => {
    if (typeof incrementBy !== 'number' || incrementBy <= 0) {
      console.warn(
        'Counter: incrementBy must be a positive number.  Using default value of 1.'
      );
      return 1;
    }
    return incrementBy;
  }, [incrementBy]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + validatedIncrementBy;

      if (maxCount !== undefined && newCount > maxCount) {
        onMaxCountReached?.();
        return prevCount; // Don't increment if it exceeds maxCount
      }

      onCountChange?.(newCount);
      return newCount;
    });
  }, [validatedIncrementBy, maxCount, onCountChange, onMaxCountReached]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - validatedIncrementBy;

      if (minCount !== undefined && newCount < minCount) {
        onMinCountReached?.();
        return prevCount; // Don't decrement if it goes below minCount
      }

      onCountChange?.(newCount);
      return newCount;
    });
  }, [validatedIncrementBy, minCount, onCountChange, onMinCountReached]);

  const isIncrementDisabled = useMemo(() => {
    if (disableIncrement) return true;
    if (maxCount !== undefined && count >= maxCount) return true;
    return false;
  }, [count, maxCount, disableIncrement]);

  const isDecrementDisabled = useMemo(() => {
    if (disableDecrement) return true;
    if (minCount !== undefined && count <= minCount) return true;
    return false;
  }, [count, minCount, disableDecrement]);

  return (
    <div className={className}>
      <p className={countClassName} aria-live="polite">
        Count: {count}
      </p>
      <button
        onClick={increment}
        disabled={isIncrementDisabled}
        className={incrementButtonClassName}
        aria-label="Increment counter"
      >
        {incrementButtonLabel}
      </button>
      <button
        onClick={decrement}
        disabled={isDecrementDisabled}
        className={decrementButtonClassName}
        aria-label="Decrement counter"
      >
        {decrementButtonLabel}
      </button>
    </div>
  );
};

export default Counter;