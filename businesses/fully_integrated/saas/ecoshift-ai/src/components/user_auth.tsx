import React, { useState, useEffect, useCallback, useRef } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementBy?: number;
  min?: number;
  max?: number;
  onCountChange?: (count: number) => void;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  disabled?: boolean;
  errorTimeout?: number; // Timeout for error messages (in ms)
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  min,
  max,
  onCountChange,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  disabled = false,
  errorTimeout = 3000, // Default error timeout
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const [error, setError] = useState<string | null>(null);
  const isFirstRender = useRef(true);
  const errorTimeoutRef = useRef<number | null>(null);

  // Clear any existing timeout when the component unmounts or error changes
  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  const validateCount = useCallback((newCount: number): number => {
    if (min !== undefined && newCount < min) {
      const errorMessage = `Minimum value is ${min}`;
      setError(errorMessage);

      // Clear any existing timeout
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }

      // Set a timeout to clear the error message
      errorTimeoutRef.current = window.setTimeout(() => {
        setError(null);
        errorTimeoutRef.current = null;
      }, errorTimeout);

      return min;
    }

    if (max !== undefined && newCount > max) {
      const errorMessage = `Maximum value is ${max}`;
      setError(errorMessage);

      // Clear any existing timeout
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }

      // Set a timeout to clear the error message
      errorTimeoutRef.current = window.setTimeout(() => {
        setError(null);
        errorTimeoutRef.current = null;
      }, errorTimeout);

      return max;
    }

    setError(null);
    return newCount;
  }, [min, max, errorTimeout]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      const initialValidatedCount = validateCount(initialCount);
      setCount(initialValidatedCount);
      return;
    }

    const validatedCount = validateCount(count);
    if (validatedCount !== count) {
      setCount(validatedCount);
    }
  }, [count, min, max, validateCount, initialCount]);

  useEffect(() => {
    if (onCountChange) {
      try {
        onCountChange(count);
      } catch (e: any) { // Explicitly type 'e' as 'any' or 'Error'
        console.error('Error in onCountChange callback:', e);
        // Optionally, set an error state to display to the user
        setError(`Callback error: ${e.message || 'Unknown error'}`);

          // Clear any existing timeout
          if (errorTimeoutRef.current) {
            clearTimeout(errorTimeoutRef.current);
          }

          // Set a timeout to clear the error message
          errorTimeoutRef.current = window.setTimeout(() => {
            setError(null);
            errorTimeoutRef.current = null;
          }, errorTimeout);
      }
    }
  }, [count, onCountChange, errorTimeout]);

  const increment = useCallback(() => {
    if (disabled) return;
    setCount((prevCount) => {
      const newCount = prevCount + incrementBy;
      return validateCount(newCount);
    });
  }, [incrementBy, validateCount, disabled]);

  const decrement = useCallback(() => {
    if (disabled) return;
    setCount((prevCount) => {
      const newCount = prevCount - incrementBy;
      return validateCount(newCount);
    });
  }, [incrementBy, validateCount, disabled]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault(); // Prevent scrolling
        const target = event.target as HTMLButtonElement; // Type assertion
        if (target.name === 'increment') {
          increment();
        } else if (target.name === 'decrement') {
          decrement();
        }
      }
    },
    [increment, decrement, disabled]
  );

  const countDisplay = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (countDisplay.current) {
      countDisplay.current.focus(); // Set focus to the count display for screen readers
    }
  }, [count]);

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite" tabIndex={0} ref={countDisplay}>
        Count: {count}
      </p>
      {error && (
        <div role="alert" style={{ color: 'red' }}>
          {error}
        </div>
      )}
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={disabled}
        onKeyDown={handleKeyDown}
        name="increment"
      >
        {ariaLabelIncrement}
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={disabled}
        onKeyDown={handleKeyDown}
        name="decrement"
      >
        {ariaLabelDecrement}
      </button>
    </div>
  );
};

export default Counter;

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementBy?: number;
  min?: number;
  max?: number;
  onCountChange?: (count: number) => void;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  disabled?: boolean;
  errorTimeout?: number; // Timeout for error messages (in ms)
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  min,
  max,
  onCountChange,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  disabled = false,
  errorTimeout = 3000, // Default error timeout
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const [error, setError] = useState<string | null>(null);
  const isFirstRender = useRef(true);
  const errorTimeoutRef = useRef<number | null>(null);

  // Clear any existing timeout when the component unmounts or error changes
  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  const validateCount = useCallback((newCount: number): number => {
    if (min !== undefined && newCount < min) {
      const errorMessage = `Minimum value is ${min}`;
      setError(errorMessage);

      // Clear any existing timeout
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }

      // Set a timeout to clear the error message
      errorTimeoutRef.current = window.setTimeout(() => {
        setError(null);
        errorTimeoutRef.current = null;
      }, errorTimeout);

      return min;
    }

    if (max !== undefined && newCount > max) {
      const errorMessage = `Maximum value is ${max}`;
      setError(errorMessage);

      // Clear any existing timeout
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }

      // Set a timeout to clear the error message
      errorTimeoutRef.current = window.setTimeout(() => {
        setError(null);
        errorTimeoutRef.current = null;
      }, errorTimeout);

      return max;
    }

    setError(null);
    return newCount;
  }, [min, max, errorTimeout]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      const initialValidatedCount = validateCount(initialCount);
      setCount(initialValidatedCount);
      return;
    }

    const validatedCount = validateCount(count);
    if (validatedCount !== count) {
      setCount(validatedCount);
    }
  }, [count, min, max, validateCount, initialCount]);

  useEffect(() => {
    if (onCountChange) {
      try {
        onCountChange(count);
      } catch (e: any) { // Explicitly type 'e' as 'any' or 'Error'
        console.error('Error in onCountChange callback:', e);
        // Optionally, set an error state to display to the user
        setError(`Callback error: ${e.message || 'Unknown error'}`);

          // Clear any existing timeout
          if (errorTimeoutRef.current) {
            clearTimeout(errorTimeoutRef.current);
          }

          // Set a timeout to clear the error message
          errorTimeoutRef.current = window.setTimeout(() => {
            setError(null);
            errorTimeoutRef.current = null;
          }, errorTimeout);
      }
    }
  }, [count, onCountChange, errorTimeout]);

  const increment = useCallback(() => {
    if (disabled) return;
    setCount((prevCount) => {
      const newCount = prevCount + incrementBy;
      return validateCount(newCount);
    });
  }, [incrementBy, validateCount, disabled]);

  const decrement = useCallback(() => {
    if (disabled) return;
    setCount((prevCount) => {
      const newCount = prevCount - incrementBy;
      return validateCount(newCount);
    });
  }, [incrementBy, validateCount, disabled]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault(); // Prevent scrolling
        const target = event.target as HTMLButtonElement; // Type assertion
        if (target.name === 'increment') {
          increment();
        } else if (target.name === 'decrement') {
          decrement();
        }
      }
    },
    [increment, decrement, disabled]
  );

  const countDisplay = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (countDisplay.current) {
      countDisplay.current.focus(); // Set focus to the count display for screen readers
    }
  }, [count]);

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite" tabIndex={0} ref={countDisplay}>
        Count: {count}
      </p>
      {error && (
        <div role="alert" style={{ color: 'red' }}>
          {error}
        </div>
      )}
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={disabled}
        onKeyDown={handleKeyDown}
        name="increment"
      >
        {ariaLabelIncrement}
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={disabled}
        onKeyDown={handleKeyDown}
        name="decrement"
      >
        {ariaLabelDecrement}
      </button>
    </div>
  );
};

export default Counter;