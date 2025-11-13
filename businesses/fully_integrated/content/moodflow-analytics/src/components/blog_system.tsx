import React, { useState, useCallback, useEffect, useRef } from 'react';

interface Props {
  initialCount?: number;
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelPrefix?: string;
  onCountChange?: (count: number) => void;
  /** Custom class name for styling. */
  className?: string;
  /** Custom style object for styling. */
  style?: React.CSSProperties;
  /** A function to format the count value for display. */
  formatCount?: (count: number) => React.ReactNode;
  /** Debounce time in milliseconds for the onCountChange callback. */
  debounceTime?: number;
}

/**
 * A robust and accessible counter component.
 *
 * Allows incrementing and decrementing a count value.  The initial count and
 * increment step can be customized via props.  Includes optional min/max values
 * to prevent under/overflow.  Also includes an optional callback for when the count changes.
 */
const Counter: React.FC<Props> = ({
  initialCount = 0,
  incrementStep = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelPrefix = 'Counter',
  onCountChange,
  className,
  style,
  formatCount = (count) => count,
  debounceTime = 0,
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const [debouncedCount, setDebouncedCount] = useState<number>(initialCount);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Validate props on mount
  useEffect(() => {
    if (typeof initialCount !== 'number' || !Number.isFinite(initialCount)) {
      console.warn('Counter: initialCount must be a finite number. Using default value 0.');
    }
    if (typeof incrementStep !== 'number' || !Number.isFinite(incrementStep)) {
      console.warn('Counter: incrementStep must be a finite number. Using default value 1.');
    }
    if (typeof min !== 'number' || !Number.isFinite(min)) {
      console.warn('Counter: min must be a finite number. Using default value -Infinity.');
    }
    if (typeof max !== 'number' || !Number.isFinite(max)) {
      console.warn('Counter: max must be a finite number. Using default value Infinity.');
    }
    if (min >= max) {
      console.warn('Counter: min must be less than max.  Component may not function correctly.');
    }
  }, [initialCount, incrementStep, min, max]);

  // Use useCallback to prevent unnecessary re-renders of the increment/decrement functions
  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newValue = prevCount + incrementStep;
      if (newValue <= max) {
        return newValue;
      }
      return prevCount; // Don't increment if it exceeds the max
    });
  }, [incrementStep, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newValue = prevCount - incrementStep;
      if (newValue >= min) {
        return newValue;
      }
      return prevCount; // Don't decrement if it goes below the min
    });
  }, [incrementStep, min]);

  // Handle edge case where initialCount is outside min/max
  const validatedCount = Math.max(min, Math.min(max, count));

  // useEffect to update the state if initialCount prop changes and is outside the min/max bounds
  useEffect(() => {
    if (initialCount < min) {
      setCount(min);
    } else if (initialCount > max) {
      setCount(max);
    } else if (initialCount !== count) {
      setCount(initialCount);
    }
  }, [initialCount, min, max, count]);

  // Debounce the onCountChange callback
  useEffect(() => {
    if (debounceTime > 0) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setDebouncedCount(validatedCount);
      }, debounceTime);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    } else {
      setDebouncedCount(validatedCount);
    }
  }, [validatedCount, debounceTime]);

  // Call onCountChange when debouncedCount changes
  useEffect(() => {
    if (onCountChange) {
      onCountChange(debouncedCount);
    }
  }, [debouncedCount, onCountChange]);

  const isDecrementDisabled = validatedCount <= min;
  const isIncrementDisabled = validatedCount >= max;

  return (
    <div
      role="group"
      aria-label={ariaLabelPrefix}
      className={className}
      style={style}
    >
      <p aria-live="polite" data-testid="counter-value">
        Count: {formatCount(Number.isFinite(validatedCount) ? validatedCount : NaN)}
      </p>
      <button
        onClick={decrement}
        aria-label={`${ariaLabelPrefix} Decrement`}
        disabled={isDecrementDisabled}
        data-testid="decrement-button"
      >
        Decrement
      </button>
      <button
        onClick={increment}
        aria-label={`${ariaLabelPrefix} Increment`}
        disabled={isIncrementDisabled}
        data-testid="increment-button"
      >
        Increment
      </button>
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useEffect, useRef } from 'react';

interface Props {
  initialCount?: number;
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelPrefix?: string;
  onCountChange?: (count: number) => void;
  /** Custom class name for styling. */
  className?: string;
  /** Custom style object for styling. */
  style?: React.CSSProperties;
  /** A function to format the count value for display. */
  formatCount?: (count: number) => React.ReactNode;
  /** Debounce time in milliseconds for the onCountChange callback. */
  debounceTime?: number;
}

/**
 * A robust and accessible counter component.
 *
 * Allows incrementing and decrementing a count value.  The initial count and
 * increment step can be customized via props.  Includes optional min/max values
 * to prevent under/overflow.  Also includes an optional callback for when the count changes.
 */
const Counter: React.FC<Props> = ({
  initialCount = 0,
  incrementStep = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelPrefix = 'Counter',
  onCountChange,
  className,
  style,
  formatCount = (count) => count,
  debounceTime = 0,
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const [debouncedCount, setDebouncedCount] = useState<number>(initialCount);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Validate props on mount
  useEffect(() => {
    if (typeof initialCount !== 'number' || !Number.isFinite(initialCount)) {
      console.warn('Counter: initialCount must be a finite number. Using default value 0.');
    }
    if (typeof incrementStep !== 'number' || !Number.isFinite(incrementStep)) {
      console.warn('Counter: incrementStep must be a finite number. Using default value 1.');
    }
    if (typeof min !== 'number' || !Number.isFinite(min)) {
      console.warn('Counter: min must be a finite number. Using default value -Infinity.');
    }
    if (typeof max !== 'number' || !Number.isFinite(max)) {
      console.warn('Counter: max must be a finite number. Using default value Infinity.');
    }
    if (min >= max) {
      console.warn('Counter: min must be less than max.  Component may not function correctly.');
    }
  }, [initialCount, incrementStep, min, max]);

  // Use useCallback to prevent unnecessary re-renders of the increment/decrement functions
  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newValue = prevCount + incrementStep;
      if (newValue <= max) {
        return newValue;
      }
      return prevCount; // Don't increment if it exceeds the max
    });
  }, [incrementStep, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newValue = prevCount - incrementStep;
      if (newValue >= min) {
        return newValue;
      }
      return prevCount; // Don't decrement if it goes below the min
    });
  }, [incrementStep, min]);

  // Handle edge case where initialCount is outside min/max
  const validatedCount = Math.max(min, Math.min(max, count));

  // useEffect to update the state if initialCount prop changes and is outside the min/max bounds
  useEffect(() => {
    if (initialCount < min) {
      setCount(min);
    } else if (initialCount > max) {
      setCount(max);
    } else if (initialCount !== count) {
      setCount(initialCount);
    }
  }, [initialCount, min, max, count]);

  // Debounce the onCountChange callback
  useEffect(() => {
    if (debounceTime > 0) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setDebouncedCount(validatedCount);
      }, debounceTime);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    } else {
      setDebouncedCount(validatedCount);
    }
  }, [validatedCount, debounceTime]);

  // Call onCountChange when debouncedCount changes
  useEffect(() => {
    if (onCountChange) {
      onCountChange(debouncedCount);
    }
  }, [debouncedCount, onCountChange]);

  const isDecrementDisabled = validatedCount <= min;
  const isIncrementDisabled = validatedCount >= max;

  return (
    <div
      role="group"
      aria-label={ariaLabelPrefix}
      className={className}
      style={style}
    >
      <p aria-live="polite" data-testid="counter-value">
        Count: {formatCount(Number.isFinite(validatedCount) ? validatedCount : NaN)}
      </p>
      <button
        onClick={decrement}
        aria-label={`${ariaLabelPrefix} Decrement`}
        disabled={isDecrementDisabled}
        data-testid="decrement-button"
      >
        Decrement
      </button>
      <button
        onClick={increment}
        aria-label={`${ariaLabelPrefix} Increment`}
        disabled={isIncrementDisabled}
        data-testid="increment-button"
      >
        Increment
      </button>
    </div>
  );
};

export default Counter;