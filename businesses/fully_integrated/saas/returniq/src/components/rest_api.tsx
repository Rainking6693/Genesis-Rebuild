import React, { useState, useCallback, useMemo, useEffect } from 'react';

interface CounterProps {
  /**
   * The initial value of the counter. Defaults to 0.
   */
  initialCount?: number;
  /**
   * The amount to increment or decrement the counter by. Defaults to 1.  Must be a positive number.
   */
  incrementStep?: number;
  /**
   *  A callback function that is called when the count changes.
   *  @param newCount The new value of the count.
   */
  onCountChange?: (newCount: number) => void;
  /**
   *  A maximum value the counter can reach.  If undefined, there is no maximum.
   */
  maxValue?: number;
  /**
   * A minimum value the counter can reach. If undefined, there is no minimum.
   */
  minValue?: number;
  /**
   *  A CSS class to apply to the container div.
   */
  className?: string;
  /**
   *  A CSS class to apply to the count display paragraph.
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
   *  A label for the increment button.  Defaults to "Increment".
   */
  incrementButtonLabel?: string;
  /**
   *  A label for the decrement button.  Defaults to "Decrement".
   */
  decrementButtonLabel?: string;
  /**
   *  A title attribute for the increment button, for accessibility.
   */
  incrementButtonTitle?: string;
  /**
   *  A title attribute for the decrement button, for accessibility.
   */
  decrementButtonTitle?: string;
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
  incrementStep = 1,
  onCountChange,
  maxValue,
  minValue,
  className,
  countClassName,
  incrementButtonClassName,
  decrementButtonClassName,
  incrementButtonLabel = 'Increment',
  decrementButtonLabel = 'Decrement',
  incrementButtonTitle = 'Increment the counter',
  decrementButtonTitle = 'Decrement the counter',
  disableIncrement = false,
  disableDecrement = false,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Validate incrementStep
  const validatedIncrementStep = useMemo(() => {
    if (typeof incrementStep !== 'number' || incrementStep <= 0) {
      console.warn(
        `Invalid incrementStep value: ${incrementStep}.  Must be a positive number.  Using default value of 1.`
      );
      return 1;
    }
    return incrementStep;
  }, [incrementStep]);

  // Callback for incrementing the count
  const increment = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount + validatedIncrementStep;
      if (maxValue !== undefined && nextCount > maxValue) {
        return prevCount; // Don't exceed maxValue
      }
      return nextCount;
    });
  }, [validatedIncrementStep, maxValue]);

  // Callback for decrementing the count
  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount - validatedIncrementStep;
      if (minValue !== undefined && nextCount < minValue) {
        return prevCount; // Don't go below minValue
      }
      return nextCount;
    });
  }, [validatedIncrementStep, minValue]);

  // useEffect to call the onCountChange callback whenever the count changes
  useEffect(() => {
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  const isIncrementDisabled = useMemo(() => {
    if (disableIncrement) return true;
    if (maxValue !== undefined && count >= maxValue) return true;
    return false;
  }, [count, maxValue, disableIncrement]);

  const isDecrementDisabled = useMemo(() => {
    if (disableDecrement) return true;
    if (minValue !== undefined && count <= minValue) return true;
    return false;
  }, [count, minValue, disableDecrement]);

  return (
    <div className={className}>
      <p className={countClassName} aria-live="polite">
        Count: {count}
      </p>
      <button
        onClick={increment}
        className={incrementButtonClassName}
        title={incrementButtonTitle}
        disabled={isIncrementDisabled}
      >
        {incrementButtonLabel}
      </button>
      <button
        onClick={decrement}
        className={decrementButtonClassName}
        title={decrementButtonTitle}
        disabled={isDecrementDisabled}
      >
        {decrementButtonLabel}
      </button>
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useMemo, useEffect } from 'react';

interface CounterProps {
  /**
   * The initial value of the counter. Defaults to 0.
   */
  initialCount?: number;
  /**
   * The amount to increment or decrement the counter by. Defaults to 1.  Must be a positive number.
   */
  incrementStep?: number;
  /**
   *  A callback function that is called when the count changes.
   *  @param newCount The new value of the count.
   */
  onCountChange?: (newCount: number) => void;
  /**
   *  A maximum value the counter can reach.  If undefined, there is no maximum.
   */
  maxValue?: number;
  /**
   * A minimum value the counter can reach. If undefined, there is no minimum.
   */
  minValue?: number;
  /**
   *  A CSS class to apply to the container div.
   */
  className?: string;
  /**
   *  A CSS class to apply to the count display paragraph.
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
   *  A label for the increment button.  Defaults to "Increment".
   */
  incrementButtonLabel?: string;
  /**
   *  A label for the decrement button.  Defaults to "Decrement".
   */
  decrementButtonLabel?: string;
  /**
   *  A title attribute for the increment button, for accessibility.
   */
  incrementButtonTitle?: string;
  /**
   *  A title attribute for the decrement button, for accessibility.
   */
  decrementButtonTitle?: string;
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
  incrementStep = 1,
  onCountChange,
  maxValue,
  minValue,
  className,
  countClassName,
  incrementButtonClassName,
  decrementButtonClassName,
  incrementButtonLabel = 'Increment',
  decrementButtonLabel = 'Decrement',
  incrementButtonTitle = 'Increment the counter',
  decrementButtonTitle = 'Decrement the counter',
  disableIncrement = false,
  disableDecrement = false,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Validate incrementStep
  const validatedIncrementStep = useMemo(() => {
    if (typeof incrementStep !== 'number' || incrementStep <= 0) {
      console.warn(
        `Invalid incrementStep value: ${incrementStep}.  Must be a positive number.  Using default value of 1.`
      );
      return 1;
    }
    return incrementStep;
  }, [incrementStep]);

  // Callback for incrementing the count
  const increment = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount + validatedIncrementStep;
      if (maxValue !== undefined && nextCount > maxValue) {
        return prevCount; // Don't exceed maxValue
      }
      return nextCount;
    });
  }, [validatedIncrementStep, maxValue]);

  // Callback for decrementing the count
  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount - validatedIncrementStep;
      if (minValue !== undefined && nextCount < minValue) {
        return prevCount; // Don't go below minValue
      }
      return nextCount;
    });
  }, [validatedIncrementStep, minValue]);

  // useEffect to call the onCountChange callback whenever the count changes
  useEffect(() => {
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  const isIncrementDisabled = useMemo(() => {
    if (disableIncrement) return true;
    if (maxValue !== undefined && count >= maxValue) return true;
    return false;
  }, [count, maxValue, disableIncrement]);

  const isDecrementDisabled = useMemo(() => {
    if (disableDecrement) return true;
    if (minValue !== undefined && count <= minValue) return true;
    return false;
  }, [count, minValue, disableDecrement]);

  return (
    <div className={className}>
      <p className={countClassName} aria-live="polite">
        Count: {count}
      </p>
      <button
        onClick={increment}
        className={incrementButtonClassName}
        title={incrementButtonTitle}
        disabled={isIncrementDisabled}
      >
        {incrementButtonLabel}
      </button>
      <button
        onClick={decrement}
        className={decrementButtonClassName}
        title={decrementButtonTitle}
        disabled={isDecrementDisabled}
      >
        {decrementButtonLabel}
      </button>
    </div>
  );
};

export default Counter;