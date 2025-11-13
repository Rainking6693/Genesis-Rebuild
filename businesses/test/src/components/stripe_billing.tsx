import React, { useState, useCallback, useRef, useEffect } from 'react';

interface CounterProps {
  /** Initial value of the counter. Defaults to 0. */
  initialCount?: number;
  /** Amount to increment/decrement the counter by. Defaults to 1. Must be positive. */
  incrementBy?: number;
  /** Minimum allowed value for the counter. Defaults to negative infinity. */
  min?: number;
  /** Maximum allowed value for the counter. Defaults to positive infinity. */
  max?: number;
  /** Aria label for the increment button. Defaults to 'Increment'. */
  ariaLabelIncrement?: string;
  /** Aria label for the decrement button. Defaults to 'Decrement'. */
  ariaLabelDecrement?: string;
  /** Callback function called when the count changes, debounced by `debounceDelay`. */
  onCountChange?: (count: number) => void;
  /** Debounce delay in milliseconds for the `onCountChange` callback. Defaults to 200. */
  debounceDelay?: number;
  /** Custom CSS class name for the counter container. */
  className?: string;
  /** Custom CSS class name for the increment button. */
  incrementButtonClassName?: string;
  /** Custom CSS class name for the decrement button. */
  decrementButtonClassName?: string;
  /** Custom CSS class name for the count display. */
  countDisplayClassName?: string;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
  debounceDelay = 200,
  className,
  incrementButtonClassName,
  decrementButtonClassName,
  countDisplayClassName,
}) => {
  const [count, setCount] = useState<number>(() => {
    if (typeof initialCount !== 'number' || isNaN(initialCount)) {
      console.error('Invalid initialCount prop. Must be a number.');
      return 0;
    }
    return Math.max(min, Math.min(initialCount, max)); // Ensure initialCount is within bounds
  });

  const [isIncrementing, setIsIncrementing] = useState(false);
  const [isDecrementing, setIsDecrementing] = useState(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  // Validate props using useEffect to avoid running on every render
  useEffect(() => {
    if (typeof incrementBy !== 'number' || isNaN(incrementBy) || incrementBy <= 0) {
      console.error('Invalid incrementBy prop. Must be a positive number.');
      incrementBy = 1;
    }

    if (typeof min !== 'number' || isNaN(min)) {
      console.error('Invalid min prop. Must be a number.');
    }

    if (typeof max !== 'number' || isNaN(max)) {
      console.error('Invalid max prop. Must be a number.');
    }

    if (typeof debounceDelay !== 'number' || isNaN(debounceDelay) || debounceDelay < 0) {
      console.error('Invalid debounceDelay prop. Must be a non-negative number.');
    }
  }, [incrementBy, min, max, debounceDelay]);

  const safeSetCount = useCallback(
    (newCount: number) => {
      const clampedCount = Math.max(min, Math.min(newCount, max));
      setCount(clampedCount);
      return clampedCount;
    },
    [min, max]
  );

  const increment = useCallback(() => {
    setIsIncrementing(true);
    safeSetCount(prevCount => prevCount + incrementBy);
    setTimeout(() => setIsIncrementing(false), 100); // Small delay to prevent rapid clicks
  }, [incrementBy, safeSetCount]);

  const decrement = useCallback(() => {
    setIsDecrementing(true);
    safeSetCount(prevCount => prevCount - incrementBy);
    setTimeout(() => setIsDecrementing(false), 100); // Small delay to prevent rapid clicks
  }, [incrementBy, safeSetCount]);

  // Debounced onCountChange effect
  useEffect(() => {
    if (onCountChange) {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }

      timeoutId.current = setTimeout(() => {
        onCountChange(count);
        timeoutId.current = null;
      }, debounceDelay);

      return () => {
        if (timeoutId.current) {
          clearTimeout(timeoutId.current);
        }
      };
    }
  }, [count, onCountChange, debounceDelay]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); // Prevent form submission or page scrolling
      if (document.activeElement === event.currentTarget) { // Ensure focus is still on the button
        if (event.currentTarget.id === 'increment-button') {
          increment();
        } else if (event.currentTarget.id === 'decrement-button') {
          decrement();
        }
      }
    }
  }, [increment, decrement]);

  return (
    <div role="group" aria-label="Counter" className={className}>
      <div className={countDisplayClassName}>Count: {count}</div>
      <button
        id="increment-button"
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={count >= max || isIncrementing}
        className={incrementButtonClassName}
        onKeyDown={handleKeyDown}
      >
        {ariaLabelIncrement}
      </button>
      <button
        id="decrement-button"
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={count <= min || isDecrementing}
        className={decrementButtonClassName}
        onKeyDown={handleKeyDown}
      >
        {ariaLabelDecrement}
      </button>
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useRef, useEffect } from 'react';

interface CounterProps {
  /** Initial value of the counter. Defaults to 0. */
  initialCount?: number;
  /** Amount to increment/decrement the counter by. Defaults to 1. Must be positive. */
  incrementBy?: number;
  /** Minimum allowed value for the counter. Defaults to negative infinity. */
  min?: number;
  /** Maximum allowed value for the counter. Defaults to positive infinity. */
  max?: number;
  /** Aria label for the increment button. Defaults to 'Increment'. */
  ariaLabelIncrement?: string;
  /** Aria label for the decrement button. Defaults to 'Decrement'. */
  ariaLabelDecrement?: string;
  /** Callback function called when the count changes, debounced by `debounceDelay`. */
  onCountChange?: (count: number) => void;
  /** Debounce delay in milliseconds for the `onCountChange` callback. Defaults to 200. */
  debounceDelay?: number;
  /** Custom CSS class name for the counter container. */
  className?: string;
  /** Custom CSS class name for the increment button. */
  incrementButtonClassName?: string;
  /** Custom CSS class name for the decrement button. */
  decrementButtonClassName?: string;
  /** Custom CSS class name for the count display. */
  countDisplayClassName?: string;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
  debounceDelay = 200,
  className,
  incrementButtonClassName,
  decrementButtonClassName,
  countDisplayClassName,
}) => {
  const [count, setCount] = useState<number>(() => {
    if (typeof initialCount !== 'number' || isNaN(initialCount)) {
      console.error('Invalid initialCount prop. Must be a number.');
      return 0;
    }
    return Math.max(min, Math.min(initialCount, max)); // Ensure initialCount is within bounds
  });

  const [isIncrementing, setIsIncrementing] = useState(false);
  const [isDecrementing, setIsDecrementing] = useState(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  // Validate props using useEffect to avoid running on every render
  useEffect(() => {
    if (typeof incrementBy !== 'number' || isNaN(incrementBy) || incrementBy <= 0) {
      console.error('Invalid incrementBy prop. Must be a positive number.');
      incrementBy = 1;
    }

    if (typeof min !== 'number' || isNaN(min)) {
      console.error('Invalid min prop. Must be a number.');
    }

    if (typeof max !== 'number' || isNaN(max)) {
      console.error('Invalid max prop. Must be a number.');
    }

    if (typeof debounceDelay !== 'number' || isNaN(debounceDelay) || debounceDelay < 0) {
      console.error('Invalid debounceDelay prop. Must be a non-negative number.');
    }
  }, [incrementBy, min, max, debounceDelay]);

  const safeSetCount = useCallback(
    (newCount: number) => {
      const clampedCount = Math.max(min, Math.min(newCount, max));
      setCount(clampedCount);
      return clampedCount;
    },
    [min, max]
  );

  const increment = useCallback(() => {
    setIsIncrementing(true);
    safeSetCount(prevCount => prevCount + incrementBy);
    setTimeout(() => setIsIncrementing(false), 100); // Small delay to prevent rapid clicks
  }, [incrementBy, safeSetCount]);

  const decrement = useCallback(() => {
    setIsDecrementing(true);
    safeSetCount(prevCount => prevCount - incrementBy);
    setTimeout(() => setIsDecrementing(false), 100); // Small delay to prevent rapid clicks
  }, [incrementBy, safeSetCount]);

  // Debounced onCountChange effect
  useEffect(() => {
    if (onCountChange) {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }

      timeoutId.current = setTimeout(() => {
        onCountChange(count);
        timeoutId.current = null;
      }, debounceDelay);

      return () => {
        if (timeoutId.current) {
          clearTimeout(timeoutId.current);
        }
      };
    }
  }, [count, onCountChange, debounceDelay]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); // Prevent form submission or page scrolling
      if (document.activeElement === event.currentTarget) { // Ensure focus is still on the button
        if (event.currentTarget.id === 'increment-button') {
          increment();
        } else if (event.currentTarget.id === 'decrement-button') {
          decrement();
        }
      }
    }
  }, [increment, decrement]);

  return (
    <div role="group" aria-label="Counter" className={className}>
      <div className={countDisplayClassName}>Count: {count}</div>
      <button
        id="increment-button"
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={count >= max || isIncrementing}
        className={incrementButtonClassName}
        onKeyDown={handleKeyDown}
      >
        {ariaLabelIncrement}
      </button>
      <button
        id="decrement-button"
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={count <= min || isDecrementing}
        className={decrementButtonClassName}
        onKeyDown={handleKeyDown}
      >
        {ariaLabelDecrement}
      </button>
    </div>
  );
};

export default Counter;