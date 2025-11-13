import React, { useState, useCallback, useMemo, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (newCount: number) => void;
  /**
   * Optional callback function to handle errors, such as exceeding min/max values.
   * @param {string} message - The error message.
   */
  onError?: (message: string) => void;
  /**
   *  Debounce time in milliseconds for the onCountChange callback.  Defaults to 0 (no debounce).
   */
  debounceMs?: number;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
  onError,
  debounceMs = 0,
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const [debouncedCount, setDebouncedCount] = useState<number>(initialCount);

  // Validate props on initial render and when they change
  useEffect(() => {
    if (min > max) {
      const errorMessage = 'Error: min prop cannot be greater than max prop.';
      console.error(errorMessage);
      onError?.(errorMessage); // Use optional chaining
    }
    if (incrementStep <= 0) {
      const errorMessage = 'Error: incrementStep must be a positive number.';
      console.error(errorMessage);
      onError?.(errorMessage);
    }
    if (initialCount < min || initialCount > max) {
      const errorMessage = 'Error: initialCount is out of min/max bounds.';
      console.error(errorMessage);
      onError?.(errorMessage);
    }
  }, [min, max, incrementStep, initialCount, onError]);

  // Use useMemo to prevent unnecessary re-renders if min/max don't change
  const validatedMin = useMemo(() => min, [min]);
  const validatedMax = useMemo(() => max, [max]);

  // Debounce the onCountChange callback
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedCount(count);
    }, debounceMs);

    return () => clearTimeout(timerId);
  }, [count, debounceMs]);

  // Call onCountChange with the debounced value
  useEffect(() => {
    if (onCountChange) {
      onCountChange(debouncedCount);
    }
  }, [debouncedCount, onCountChange]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newValue = prevCount + incrementStep;
      if (newValue > validatedMax) {
        const errorMessage = `Maximum value (${validatedMax}) reached.`;
        onError?.(errorMessage);
        return prevCount;
      }
      return newValue;
    });
  }, [incrementStep, validatedMax, onError]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newValue = prevCount - incrementStep;
      if (newValue < validatedMin) {
        const errorMessage = `Minimum value (${validatedMin}) reached.`;
        onError?.(errorMessage);
        return prevCount;
      }
      return newValue;
    });
  }, [incrementStep, validatedMin, onError]);

  const isIncrementDisabled = useMemo(() => count >= validatedMax, [count, validatedMax]);
  const isDecrementDisabled = useMemo(() => count <= validatedMin, [count, validatedMin]);

  // Accessibility improvements:  Use role="status" for live updates, add tabindex for keyboard navigation
  return (
    <div role="group" aria-label="Counter">
      <p role="status" aria-live="polite">
        Count: {count}
      </p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={isIncrementDisabled}
        tabIndex={0} // Make button focusable
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={isDecrementDisabled}
        tabIndex={0} // Make button focusable
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useMemo, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (newCount: number) => void;
  /**
   * Optional callback function to handle errors, such as exceeding min/max values.
   * @param {string} message - The error message.
   */
  onError?: (message: string) => void;
  /**
   *  Debounce time in milliseconds for the onCountChange callback.  Defaults to 0 (no debounce).
   */
  debounceMs?: number;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
  onError,
  debounceMs = 0,
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const [debouncedCount, setDebouncedCount] = useState<number>(initialCount);

  // Validate props on initial render and when they change
  useEffect(() => {
    if (min > max) {
      const errorMessage = 'Error: min prop cannot be greater than max prop.';
      console.error(errorMessage);
      onError?.(errorMessage); // Use optional chaining
    }
    if (incrementStep <= 0) {
      const errorMessage = 'Error: incrementStep must be a positive number.';
      console.error(errorMessage);
      onError?.(errorMessage);
    }
    if (initialCount < min || initialCount > max) {
      const errorMessage = 'Error: initialCount is out of min/max bounds.';
      console.error(errorMessage);
      onError?.(errorMessage);
    }
  }, [min, max, incrementStep, initialCount, onError]);

  // Use useMemo to prevent unnecessary re-renders if min/max don't change
  const validatedMin = useMemo(() => min, [min]);
  const validatedMax = useMemo(() => max, [max]);

  // Debounce the onCountChange callback
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedCount(count);
    }, debounceMs);

    return () => clearTimeout(timerId);
  }, [count, debounceMs]);

  // Call onCountChange with the debounced value
  useEffect(() => {
    if (onCountChange) {
      onCountChange(debouncedCount);
    }
  }, [debouncedCount, onCountChange]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newValue = prevCount + incrementStep;
      if (newValue > validatedMax) {
        const errorMessage = `Maximum value (${validatedMax}) reached.`;
        onError?.(errorMessage);
        return prevCount;
      }
      return newValue;
    });
  }, [incrementStep, validatedMax, onError]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newValue = prevCount - incrementStep;
      if (newValue < validatedMin) {
        const errorMessage = `Minimum value (${validatedMin}) reached.`;
        onError?.(errorMessage);
        return prevCount;
      }
      return newValue;
    });
  }, [incrementStep, validatedMin, onError]);

  const isIncrementDisabled = useMemo(() => count >= validatedMax, [count, validatedMax]);
  const isDecrementDisabled = useMemo(() => count <= validatedMin, [count, validatedMin]);

  // Accessibility improvements:  Use role="status" for live updates, add tabindex for keyboard navigation
  return (
    <div role="group" aria-label="Counter">
      <p role="status" aria-live="polite">
        Count: {count}
      </p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={isIncrementDisabled}
        tabIndex={0} // Make button focusable
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={isDecrementDisabled}
        tabIndex={0} // Make button focusable
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;