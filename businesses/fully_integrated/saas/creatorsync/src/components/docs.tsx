import React, { useState, useCallback, useRef, useEffect } from 'react';

interface CounterProps {
  /** The initial value of the counter (default: 0). */
  initialCount?: number;
  /** The amount to increment/decrement the counter by (default: 1). Must be a positive number. */
  incrementBy?: number;
  /** The minimum allowed value for the counter. */
  min?: number;
  /** The maximum allowed value for the counter. */
  max?: number;
  /** Aria label for increment button. */
  ariaLabelIncrement?: string;
  /** Aria label for decrement button. */
  ariaLabelDecrement?: string;
  /** Callback function when count changes. */
  onCountChange?: (count: number) => void;
  /** Custom class name for the container div. */
  containerClassName?: string;
  /** Custom class name for the count display paragraph. */
  countClassName?: string;
  /** Custom class name for the increment button. */
  incrementButtonClassName?: string;
  /** Custom class name for the decrement button. */
  decrementButtonClassName?: string;
}

/**
 * A simple counter component with increment and decrement functionality.
 * Includes optional min/max values and callback for count changes.
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  min,
  max,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
  containerClassName,
  countClassName,
  incrementButtonClassName,
  decrementButtonClassName,
}) => {
  const [count, setCount] = useState(initialCount);
  const [isIncrementDisabled, setIsIncrementDisabled] = useState(false);
  const [isDecrementDisabled, setIsDecrementDisabled] = useState(false);
  const countRef = useRef(count);
  const incrementButtonRef = useRef<HTMLButtonElement>(null);
  const decrementButtonRef = useRef<HTMLButtonElement>(null);

  // Validate incrementBy prop
  if (incrementBy <= 0) {
    console.error("incrementBy prop must be a positive number.  Defaulting to 1.");
    incrementBy = 1;
  }

  useEffect(() => {
    countRef.current = count;
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  useEffect(() => {
    setIsIncrementDisabled(max !== undefined && count >= max);
    setIsDecrementDisabled(min !== undefined && count <= min);
  }, [count, min, max]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      let newValue = prevCount + incrementBy;
      if (max !== undefined && newValue > max) {
        newValue = max;
      }
      return newValue;
    });
  }, [incrementBy, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      let newValue = prevCount - incrementBy;
      if (min !== undefined && newValue < min) {
        newValue = min;
      }
      return newValue;
    });
  }, [incrementBy, min]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (document.activeElement === incrementButtonRef.current) {
          increment();
        } else if (document.activeElement === decrementButtonRef.current) {
          decrement();
        }
      }
    },
    [increment, decrement]
  );

  return (
    <div className={containerClassName}>
      <p className={countClassName} aria-live="polite">
        Count: {count}
      </p>
      <button
        ref={incrementButtonRef}
        className={incrementButtonClassName}
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={isIncrementDisabled}
        onKeyDown={handleKeyDown}
      >
        {ariaLabelIncrement}
      </button>
      <button
        ref={decrementButtonRef}
        className={decrementButtonClassName}
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={isDecrementDisabled}
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
  /** The initial value of the counter (default: 0). */
  initialCount?: number;
  /** The amount to increment/decrement the counter by (default: 1). Must be a positive number. */
  incrementBy?: number;
  /** The minimum allowed value for the counter. */
  min?: number;
  /** The maximum allowed value for the counter. */
  max?: number;
  /** Aria label for increment button. */
  ariaLabelIncrement?: string;
  /** Aria label for decrement button. */
  ariaLabelDecrement?: string;
  /** Callback function when count changes. */
  onCountChange?: (count: number) => void;
  /** Custom class name for the container div. */
  containerClassName?: string;
  /** Custom class name for the count display paragraph. */
  countClassName?: string;
  /** Custom class name for the increment button. */
  incrementButtonClassName?: string;
  /** Custom class name for the decrement button. */
  decrementButtonClassName?: string;
}

/**
 * A simple counter component with increment and decrement functionality.
 * Includes optional min/max values and callback for count changes.
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  min,
  max,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
  containerClassName,
  countClassName,
  incrementButtonClassName,
  decrementButtonClassName,
}) => {
  const [count, setCount] = useState(initialCount);
  const [isIncrementDisabled, setIsIncrementDisabled] = useState(false);
  const [isDecrementDisabled, setIsDecrementDisabled] = useState(false);
  const countRef = useRef(count);
  const incrementButtonRef = useRef<HTMLButtonElement>(null);
  const decrementButtonRef = useRef<HTMLButtonElement>(null);

  // Validate incrementBy prop
  if (incrementBy <= 0) {
    console.error("incrementBy prop must be a positive number.  Defaulting to 1.");
    incrementBy = 1;
  }

  useEffect(() => {
    countRef.current = count;
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  useEffect(() => {
    setIsIncrementDisabled(max !== undefined && count >= max);
    setIsDecrementDisabled(min !== undefined && count <= min);
  }, [count, min, max]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      let newValue = prevCount + incrementBy;
      if (max !== undefined && newValue > max) {
        newValue = max;
      }
      return newValue;
    });
  }, [incrementBy, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      let newValue = prevCount - incrementBy;
      if (min !== undefined && newValue < min) {
        newValue = min;
      }
      return newValue;
    });
  }, [incrementBy, min]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (document.activeElement === incrementButtonRef.current) {
          increment();
        } else if (document.activeElement === decrementButtonRef.current) {
          decrement();
        }
      }
    },
    [increment, decrement]
  );

  return (
    <div className={containerClassName}>
      <p className={countClassName} aria-live="polite">
        Count: {count}
      </p>
      <button
        ref={incrementButtonRef}
        className={incrementButtonClassName}
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={isIncrementDisabled}
        onKeyDown={handleKeyDown}
      >
        {ariaLabelIncrement}
      </button>
      <button
        ref={decrementButtonRef}
        className={decrementButtonClassName}
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={isDecrementDisabled}
        onKeyDown={handleKeyDown}
      >
        {ariaLabelDecrement}
      </button>
    </div>
  );
};

export default Counter;