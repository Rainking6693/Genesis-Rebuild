import React, { useState, useCallback, useMemo } from 'react';

interface CounterProps {
  initialCount?: number;
  min?: number;
  max?: number;
  step?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  disabled?: boolean;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  disabled = false,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  const isValidCount = useCallback((newCount: number): boolean => {
    return newCount >= min && newCount <= max;
  }, [min, max]);

  const increment = useCallback(() => {
    if (disabled) return;
    const newCount = count + step;
    if (isValidCount(newCount)) {
      setCount(newCount);
    }
  }, [count, step, isValidCount, disabled]);

  const decrement = useCallback(() => {
    if (disabled) return;
    const newCount = count - step;
    if (isValidCount(newCount)) {
      setCount(newCount);
    }
  }, [count, step, isValidCount, disabled]);

  const countDisplay = useMemo(() => {
    return count.toLocaleString(); // Add commas for readability
  }, [count]);

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {countDisplay}</p>
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
  min?: number;
  max?: number;
  step?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  disabled?: boolean;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  disabled = false,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  const isValidCount = useCallback((newCount: number): boolean => {
    return newCount >= min && newCount <= max;
  }, [min, max]);

  const increment = useCallback(() => {
    if (disabled) return;
    const newCount = count + step;
    if (isValidCount(newCount)) {
      setCount(newCount);
    }
  }, [count, step, isValidCount, disabled]);

  const decrement = useCallback(() => {
    if (disabled) return;
    const newCount = count - step;
    if (isValidCount(newCount)) {
      setCount(newCount);
    }
  }, [count, step, isValidCount, disabled]);

  const countDisplay = useMemo(() => {
    return count.toLocaleString(); // Add commas for readability
  }, [count]);

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {countDisplay}</p>
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