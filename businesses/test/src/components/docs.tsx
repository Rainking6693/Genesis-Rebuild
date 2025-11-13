import React, { useState, useCallback, useEffect, useRef } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  min?: number;
  max?: number;
  onCountChange?: (count: number) => void;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  disabled?: boolean;
  /**
   * A unique identifier for the counter.  Useful when multiple counters exist on the same page.
   */
  id?: string;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min = -Infinity,
  max = Infinity,
  onCountChange,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  disabled = false,
  id,
}) => {
  const [count, setCount] = useState(initialCount);
  const isMounted = useRef(false);
  const [error, setError] = useState<string | null>(null); // State for error handling

  useEffect(() => {
    // Validate props on initial render and when props change
    if (min > max) {
      setError('Error: Min value cannot be greater than max value.');
      return;
    } else {
      setError(null); // Clear any previous error
    }

    if (initialCount < min) {
      setCount(min);
    }

    if (initialCount > max) {
      setCount(max);
    }
  }, [min, max, initialCount]);

  useEffect(() => {
    if (isMounted.current) {
      try {
        if (onCountChange) {
          onCountChange(count);
        }
      } catch (e) {
        console.error('Error in onCountChange callback:', e);
        // Optionally set an error state to display to the user
        setError('An error occurred while updating the count.');
      }
    } else {
      isMounted.current = true;
    }
  }, [count, onCountChange]);

  const increment = useCallback(() => {
    if (disabled) return;

    setCount((prevCount) => {
      const newCount = prevCount + incrementStep;
      if (newCount <= max) {
        return newCount;
      }
      return prevCount; // Prevent incrementing beyond max
    });
  }, [incrementStep, max, disabled]);

  const decrement = useCallback(() => {
    if (disabled) return;

    setCount((prevCount) => {
      const newCount = prevCount - incrementStep;
      if (newCount >= min) {
        return newCount;
      }
      return prevCount; // Prevent decrementing below min
    });
  }, [incrementStep, min, disabled]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault(); // Prevent scrolling
        (event.target as HTMLButtonElement).click(); // Trigger click event
      }
    },
    [disabled]
  );

  const counterId = id ? `counter-${id}` : 'counter'; // Generate a unique ID

  return (
    <div role="group" aria-labelledby={`${counterId}-label`}>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <p id={`${counterId}-label`} aria-live="polite">
        Count: {count}
      </p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={disabled || count >= max}
        onKeyDown={handleKeyDown}
        aria-describedby={disabled || count >= max ? `${counterId}-increment-limit` : undefined}
      >
        Increment
      </button>
      {disabled || count >= max ? (
        <span id={`${counterId}-increment-limit`} aria-hidden="true">
          {disabled ? 'Counter is disabled' : 'Maximum value reached'}
        </span>
      ) : null}
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={disabled || count <= min}
        onKeyDown={handleKeyDown}
        aria-describedby={disabled || count <= min ? `${counterId}-decrement-limit` : undefined}
      >
        Decrement
      </button>
      {disabled || count <= min ? (
        <span id={`${counterId}-decrement-limit`} aria-hidden="true">
          {disabled ? 'Counter is disabled' : 'Minimum value reached'}
        </span>
      ) : null}
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useEffect, useRef } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  min?: number;
  max?: number;
  onCountChange?: (count: number) => void;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  disabled?: boolean;
  /**
   * A unique identifier for the counter.  Useful when multiple counters exist on the same page.
   */
  id?: string;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min = -Infinity,
  max = Infinity,
  onCountChange,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  disabled = false,
  id,
}) => {
  const [count, setCount] = useState(initialCount);
  const isMounted = useRef(false);
  const [error, setError] = useState<string | null>(null); // State for error handling

  useEffect(() => {
    // Validate props on initial render and when props change
    if (min > max) {
      setError('Error: Min value cannot be greater than max value.');
      return;
    } else {
      setError(null); // Clear any previous error
    }

    if (initialCount < min) {
      setCount(min);
    }

    if (initialCount > max) {
      setCount(max);
    }
  }, [min, max, initialCount]);

  useEffect(() => {
    if (isMounted.current) {
      try {
        if (onCountChange) {
          onCountChange(count);
        }
      } catch (e) {
        console.error('Error in onCountChange callback:', e);
        // Optionally set an error state to display to the user
        setError('An error occurred while updating the count.');
      }
    } else {
      isMounted.current = true;
    }
  }, [count, onCountChange]);

  const increment = useCallback(() => {
    if (disabled) return;

    setCount((prevCount) => {
      const newCount = prevCount + incrementStep;
      if (newCount <= max) {
        return newCount;
      }
      return prevCount; // Prevent incrementing beyond max
    });
  }, [incrementStep, max, disabled]);

  const decrement = useCallback(() => {
    if (disabled) return;

    setCount((prevCount) => {
      const newCount = prevCount - incrementStep;
      if (newCount >= min) {
        return newCount;
      }
      return prevCount; // Prevent decrementing below min
    });
  }, [incrementStep, min, disabled]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault(); // Prevent scrolling
        (event.target as HTMLButtonElement).click(); // Trigger click event
      }
    },
    [disabled]
  );

  const counterId = id ? `counter-${id}` : 'counter'; // Generate a unique ID

  return (
    <div role="group" aria-labelledby={`${counterId}-label`}>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <p id={`${counterId}-label`} aria-live="polite">
        Count: {count}
      </p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={disabled || count >= max}
        onKeyDown={handleKeyDown}
        aria-describedby={disabled || count >= max ? `${counterId}-increment-limit` : undefined}
      >
        Increment
      </button>
      {disabled || count >= max ? (
        <span id={`${counterId}-increment-limit`} aria-hidden="true">
          {disabled ? 'Counter is disabled' : 'Maximum value reached'}
        </span>
      ) : null}
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={disabled || count <= min}
        onKeyDown={handleKeyDown}
        aria-describedby={disabled || count <= min ? `${counterId}-decrement-limit` : undefined}
      >
        Decrement
      </button>
      {disabled || count <= min ? (
        <span id={`${counterId}-decrement-limit`} aria-hidden="true">
          {disabled ? 'Counter is disabled' : 'Minimum value reached'}
        </span>
      ) : null}
    </div>
  );
};

export default Counter;