import React, { useState, useCallback, useMemo, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementBy?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
  /**
   * A unique identifier for the counter.  Useful when multiple counters exist and need to be distinguished.
   */
  counterId?: string;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
  counterId,
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const [error, setError] = useState<string | null>(null);

  // Validate props on mount and when they change
  useEffect(() => {
    if (typeof initialCount !== 'number' || !Number.isFinite(initialCount)) {
      console.error('Invalid initialCount value. Using default value of 0.');
      setError('Invalid initialCount');
    } else if (typeof min !== 'number' || !Number.isFinite(min)) {
      console.error('Invalid min value. Using default value of Number.MIN_SAFE_INTEGER.');
      setError('Invalid min');
    } else if (typeof max !== 'number' || !Number.isFinite(max)) {
      console.error('Invalid max value. Using default value of Number.MAX_SAFE_INTEGER.');
      setError('Invalid max');
    } else if (min >= max) {
      console.error('Invalid min and max values. Min must be less than max.');
      setError('Invalid min/max');
    } else {
      setError(null); // Clear any previous error
    }
  }, [initialCount, min, max]);

  // Validate incrementBy prop
  const validatedIncrementBy = useMemo(() => {
    if (typeof incrementBy !== 'number' || !Number.isFinite(incrementBy) || incrementBy === 0) {
      console.warn('Invalid incrementBy value. Using default value of 1.');
      return 1;
    }
    return incrementBy;
  }, [incrementBy]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      if (error) return prevCount; // Prevent increment if there's an error with props

      const newCount = prevCount + validatedIncrementBy;
      if (newCount <= max) {
        onCountChange?.(newCount); // Optional callback
        return newCount;
      } else {
        return prevCount; // Prevent exceeding max
      }
    });
  }, [validatedIncrementBy, max, onCountChange, error]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      if (error) return prevCount; // Prevent decrement if there's an error with props

      const newCount = prevCount - validatedIncrementBy;
      if (newCount >= min) {
        onCountChange?.(newCount); // Optional callback
        return newCount;
      } else {
        return prevCount; // Prevent going below min
      }
    });
  }, [validatedIncrementBy, min, onCountChange, error]);

  const isIncrementDisabled = useMemo(() => error || count >= max, [count, max, error]);
  const isDecrementDisabled = useMemo(() => error || count <= min, [count, min, error]);

  const counterLabel = useMemo(() => {
    return counterId ? `Counter ${counterId}` : 'Counter';
  }, [counterId]);

  return (
    <div role="group" aria-label={counterLabel}>
      {error && (
        <div style={{ color: 'red' }} role="alert">
          Error: {error}
        </div>
      )}
      <p aria-live="polite">
        Count: {count}
      </p>
      <button
        onClick={increment}
        disabled={isIncrementDisabled}
        aria-label={ariaLabelIncrement}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        disabled={isDecrementDisabled}
        aria-label={ariaLabelDecrement}
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
  incrementBy?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
  /**
   * A unique identifier for the counter.  Useful when multiple counters exist and need to be distinguished.
   */
  counterId?: string;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
  counterId,
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const [error, setError] = useState<string | null>(null);

  // Validate props on mount and when they change
  useEffect(() => {
    if (typeof initialCount !== 'number' || !Number.isFinite(initialCount)) {
      console.error('Invalid initialCount value. Using default value of 0.');
      setError('Invalid initialCount');
    } else if (typeof min !== 'number' || !Number.isFinite(min)) {
      console.error('Invalid min value. Using default value of Number.MIN_SAFE_INTEGER.');
      setError('Invalid min');
    } else if (typeof max !== 'number' || !Number.isFinite(max)) {
      console.error('Invalid max value. Using default value of Number.MAX_SAFE_INTEGER.');
      setError('Invalid max');
    } else if (min >= max) {
      console.error('Invalid min and max values. Min must be less than max.');
      setError('Invalid min/max');
    } else {
      setError(null); // Clear any previous error
    }
  }, [initialCount, min, max]);

  // Validate incrementBy prop
  const validatedIncrementBy = useMemo(() => {
    if (typeof incrementBy !== 'number' || !Number.isFinite(incrementBy) || incrementBy === 0) {
      console.warn('Invalid incrementBy value. Using default value of 1.');
      return 1;
    }
    return incrementBy;
  }, [incrementBy]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      if (error) return prevCount; // Prevent increment if there's an error with props

      const newCount = prevCount + validatedIncrementBy;
      if (newCount <= max) {
        onCountChange?.(newCount); // Optional callback
        return newCount;
      } else {
        return prevCount; // Prevent exceeding max
      }
    });
  }, [validatedIncrementBy, max, onCountChange, error]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      if (error) return prevCount; // Prevent decrement if there's an error with props

      const newCount = prevCount - validatedIncrementBy;
      if (newCount >= min) {
        onCountChange?.(newCount); // Optional callback
        return newCount;
      } else {
        return prevCount; // Prevent going below min
      }
    });
  }, [validatedIncrementBy, min, onCountChange, error]);

  const isIncrementDisabled = useMemo(() => error || count >= max, [count, max, error]);
  const isDecrementDisabled = useMemo(() => error || count <= min, [count, min, error]);

  const counterLabel = useMemo(() => {
    return counterId ? `Counter ${counterId}` : 'Counter';
  }, [counterId]);

  return (
    <div role="group" aria-label={counterLabel}>
      {error && (
        <div style={{ color: 'red' }} role="alert">
          Error: {error}
        </div>
      )}
      <p aria-live="polite">
        Count: {count}
      </p>
      <button
        onClick={increment}
        disabled={isIncrementDisabled}
        aria-label={ariaLabelIncrement}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        disabled={isDecrementDisabled}
        aria-label={ariaLabelDecrement}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;