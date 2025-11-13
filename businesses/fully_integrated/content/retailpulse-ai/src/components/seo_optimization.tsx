import React, { useState, useCallback, useMemo } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  disabled?: boolean;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  disabled = false,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Memoize incrementStep to prevent unnecessary re-renders if it's a complex calculation.
  const safeIncrementStep = useMemo(() => Math.abs(incrementStep), [incrementStep]);

  // Use useCallback to memoize the increment function.  This prevents unnecessary re-renders
  // of child components that might receive this function as a prop.  Also handles edge cases.
  const increment = useCallback(() => {
    if (disabled) return;

    setCount((prevCount) => {
      const nextCount = prevCount + safeIncrementStep;
      return nextCount <= max ? nextCount : prevCount; // Prevent exceeding max
    });
  }, [safeIncrementStep, max, disabled]);

  // Use useCallback to memoize the decrement function.  Handles edge cases.
  const decrement = useCallback(() => {
    if (disabled) return;

    setCount((prevCount) => {
      const nextCount = prevCount - safeIncrementStep;
      return nextCount >= min ? nextCount : prevCount; // Prevent going below min
    });
  }, [safeIncrementStep, min, disabled]);

  // Memoize the count display to avoid unnecessary re-renders.
  const countDisplay = useMemo(() => `Count: ${count}`, [count]);

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">{countDisplay}</p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={disabled || count >= max}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={disabled || count <= min}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useMemo } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  disabled?: boolean;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  disabled = false,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Memoize incrementStep to prevent unnecessary re-renders if it's a complex calculation.
  const safeIncrementStep = useMemo(() => Math.abs(incrementStep), [incrementStep]);

  // Use useCallback to memoize the increment function.  This prevents unnecessary re-renders
  // of child components that might receive this function as a prop.  Also handles edge cases.
  const increment = useCallback(() => {
    if (disabled) return;

    setCount((prevCount) => {
      const nextCount = prevCount + safeIncrementStep;
      return nextCount <= max ? nextCount : prevCount; // Prevent exceeding max
    });
  }, [safeIncrementStep, max, disabled]);

  // Use useCallback to memoize the decrement function.  Handles edge cases.
  const decrement = useCallback(() => {
    if (disabled) return;

    setCount((prevCount) => {
      const nextCount = prevCount - safeIncrementStep;
      return nextCount >= min ? nextCount : prevCount; // Prevent going below min
    });
  }, [safeIncrementStep, min, disabled]);

  // Memoize the count display to avoid unnecessary re-renders.
  const countDisplay = useMemo(() => `Count: ${count}`, [count]);

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">{countDisplay}</p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={disabled || count >= max}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={disabled || count <= min}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;