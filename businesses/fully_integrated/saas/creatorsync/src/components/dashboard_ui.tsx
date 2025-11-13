import React, { useState, useCallback, useEffect, useRef } from 'react';

interface CounterProps {
  initialCount?: number | string;
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
  onError?: (error: string) => void;
  className?: string;
  incrementButtonClassName?: string;
  decrementButtonClassName?: string;
  displayClassName?: string;
}

/**
 * A simple counter component with increment and decrement functionality.
 * Includes input validation, min/max limits, and error handling.
 *
 * Props:
 *   - initialCount: The initial value of the counter (default: 0). Can be a number or a string that can be parsed as a number.
 *   - incrementStep: The amount to increment/decrement the counter by (default: 1).
 *   - min: The minimum allowed value for the counter (optional).
 *   - max: The maximum allowed value for the counter (optional).
 *   - ariaLabelIncrement: Aria label for increment button (default: "Increment").
 *   - ariaLabelDecrement: Aria label for decrement button (default: "Decrement").
 *   - onCountChange: Callback function called when the count changes (optional).
 *   - onError: Callback function called when an error occurs (optional).
 *   - className: CSS class name for the container div (optional).
 *   - incrementButtonClassName: CSS class name for the increment button (optional).
 *   - decrementButtonClassName: CSS class name for the decrement button (optional).
 *   - displayClassName: CSS class name for the display paragraph (optional).
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min,
  max,
  ariaLabelIncrement = "Increment",
  ariaLabelDecrement = "Decrement",
  onCountChange,
  onError,
  className,
  incrementButtonClassName,
  decrementButtonClassName,
  displayClassName,
}) => {
  const [count, setCount] = useState<number>(() => {
    const initialValue = typeof initialCount === 'string' ? parseFloat(initialCount) : initialCount;
    return Number.isFinite(initialValue) ? initialValue : 0;
  });
  const [error, setError] = useState<string | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      validateInitialCount();
    }
  }, []);

  useEffect(() => {
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  const validateCount = useCallback((newCount: number) => {
    if (!Number.isFinite(newCount)) {
      const errorMessage = "Value must be a number.";
      setError(errorMessage);
      onError?.(errorMessage);
      return false;
    }

    if (min !== undefined && newCount < min) {
      const errorMessage = `Value cannot be less than ${min}`;
      setError(errorMessage);
      onError?.(errorMessage);
      return false;
    }

    if (max !== undefined && newCount > max) {
      const errorMessage = `Value cannot be greater than ${max}`;
      setError(errorMessage);
      onError?.(errorMessage);
      return false;
    }

    setError(null);
    return true;
  }, [min, max, onError]);

  const validateInitialCount = useCallback(() => {
    const initialValue = typeof initialCount === 'string' ? parseFloat(initialCount) : initialCount;

    if (!Number.isFinite(initialValue)) {
      const errorMessage = "Initial count must be a number.";
      setError(errorMessage);
      onError?.(errorMessage);
      setCount(0);
      return;
    }

    if (!validateCount(initialValue)) {
      let resetValue = 0;
      if (min !== undefined) {
        resetValue = min;
      } else if (max !== undefined) {
        resetValue = max;
      }
      setCount(resetValue);
    } else {
      setCount(initialValue);
    }
  }, [initialCount, min, max, onError, validateCount]);

  const increment = useCallback(() => {
    const newCount = count + incrementStep;
    if (validateCount(newCount)) {
      setCount(newCount);
    }
  }, [count, incrementStep, validateCount]);

  const decrement = useCallback(() => {
    const newCount = count - incrementStep;
    if (validateCount(newCount)) {
      setCount(newCount);
    }
  }, [count, incrementStep, validateCount]);

  const handleIncrement = useCallback(() => {
    increment();
  }, [increment]);

  const handleDecrement = useCallback(() => {
    decrement();
  }, [decrement]);

  return (
    <div className={className}>
      {error && (
        <div role="alert" style={{ color: 'red' }}>
          {error}
        </div>
      )}
      <p className={displayClassName} aria-live="polite">
        Count: {count}
      </p>
      <button
        onClick={handleIncrement}
        aria-label={ariaLabelIncrement}
        disabled={max !== undefined && count >= max}
        className={incrementButtonClassName}
      >
        {ariaLabelIncrement}
      </button>
      <button
        onClick={handleDecrement}
        aria-label={ariaLabelDecrement}
        disabled={min !== undefined && count <= min}
        className={decrementButtonClassName}
      >
        {ariaLabelDecrement}
      </button>
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useEffect, useRef } from 'react';

interface CounterProps {
  initialCount?: number | string;
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
  onError?: (error: string) => void;
  className?: string;
  incrementButtonClassName?: string;
  decrementButtonClassName?: string;
  displayClassName?: string;
}

/**
 * A simple counter component with increment and decrement functionality.
 * Includes input validation, min/max limits, and error handling.
 *
 * Props:
 *   - initialCount: The initial value of the counter (default: 0). Can be a number or a string that can be parsed as a number.
 *   - incrementStep: The amount to increment/decrement the counter by (default: 1).
 *   - min: The minimum allowed value for the counter (optional).
 *   - max: The maximum allowed value for the counter (optional).
 *   - ariaLabelIncrement: Aria label for increment button (default: "Increment").
 *   - ariaLabelDecrement: Aria label for decrement button (default: "Decrement").
 *   - onCountChange: Callback function called when the count changes (optional).
 *   - onError: Callback function called when an error occurs (optional).
 *   - className: CSS class name for the container div (optional).
 *   - incrementButtonClassName: CSS class name for the increment button (optional).
 *   - decrementButtonClassName: CSS class name for the decrement button (optional).
 *   - displayClassName: CSS class name for the display paragraph (optional).
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min,
  max,
  ariaLabelIncrement = "Increment",
  ariaLabelDecrement = "Decrement",
  onCountChange,
  onError,
  className,
  incrementButtonClassName,
  decrementButtonClassName,
  displayClassName,
}) => {
  const [count, setCount] = useState<number>(() => {
    const initialValue = typeof initialCount === 'string' ? parseFloat(initialCount) : initialCount;
    return Number.isFinite(initialValue) ? initialValue : 0;
  });
  const [error, setError] = useState<string | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      validateInitialCount();
    }
  }, []);

  useEffect(() => {
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  const validateCount = useCallback((newCount: number) => {
    if (!Number.isFinite(newCount)) {
      const errorMessage = "Value must be a number.";
      setError(errorMessage);
      onError?.(errorMessage);
      return false;
    }

    if (min !== undefined && newCount < min) {
      const errorMessage = `Value cannot be less than ${min}`;
      setError(errorMessage);
      onError?.(errorMessage);
      return false;
    }

    if (max !== undefined && newCount > max) {
      const errorMessage = `Value cannot be greater than ${max}`;
      setError(errorMessage);
      onError?.(errorMessage);
      return false;
    }

    setError(null);
    return true;
  }, [min, max, onError]);

  const validateInitialCount = useCallback(() => {
    const initialValue = typeof initialCount === 'string' ? parseFloat(initialCount) : initialCount;

    if (!Number.isFinite(initialValue)) {
      const errorMessage = "Initial count must be a number.";
      setError(errorMessage);
      onError?.(errorMessage);
      setCount(0);
      return;
    }

    if (!validateCount(initialValue)) {
      let resetValue = 0;
      if (min !== undefined) {
        resetValue = min;
      } else if (max !== undefined) {
        resetValue = max;
      }
      setCount(resetValue);
    } else {
      setCount(initialValue);
    }
  }, [initialCount, min, max, onError, validateCount]);

  const increment = useCallback(() => {
    const newCount = count + incrementStep;
    if (validateCount(newCount)) {
      setCount(newCount);
    }
  }, [count, incrementStep, validateCount]);

  const decrement = useCallback(() => {
    const newCount = count - incrementStep;
    if (validateCount(newCount)) {
      setCount(newCount);
    }
  }, [count, incrementStep, validateCount]);

  const handleIncrement = useCallback(() => {
    increment();
  }, [increment]);

  const handleDecrement = useCallback(() => {
    decrement();
  }, [decrement]);

  return (
    <div className={className}>
      {error && (
        <div role="alert" style={{ color: 'red' }}>
          {error}
        </div>
      )}
      <p className={displayClassName} aria-live="polite">
        Count: {count}
      </p>
      <button
        onClick={handleIncrement}
        aria-label={ariaLabelIncrement}
        disabled={max !== undefined && count >= max}
        className={incrementButtonClassName}
      >
        {ariaLabelIncrement}
      </button>
      <button
        onClick={handleDecrement}
        aria-label={ariaLabelDecrement}
        disabled={min !== undefined && count <= min}
        className={decrementButtonClassName}
      >
        {ariaLabelDecrement}
      </button>
    </div>
  );
};

export default Counter;