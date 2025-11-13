import React, { useState, useCallback, useMemo } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementBy?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Memoize incrementBy to prevent unnecessary re-renders if it doesn't change
  const incrementValue = useMemo(() => incrementBy, [incrementBy]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + incrementValue;
      if (newCount <= max) {
        onCountChange?.(newCount); // Optional callback for count changes
        return newCount;
      } else {
        return prevCount; // Prevent exceeding max
      }
    });
  }, [incrementValue, max, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - incrementValue;
      if (newCount >= min) {
        onCountChange?.(newCount); // Optional callback for count changes
        return newCount;
      } else {
        return prevCount; // Prevent going below min
      }
    });
  }, [incrementValue, min, onCountChange]);

  // Memoize the count display to avoid unnecessary re-renders
  const countDisplay = useMemo(() => `Count: ${count}`, [count]);

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">{countDisplay}</p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={count >= max} // Disable increment if at max
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={count <= min} // Disable decrement if at min
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
  incrementBy?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Memoize incrementBy to prevent unnecessary re-renders if it doesn't change
  const incrementValue = useMemo(() => incrementBy, [incrementBy]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + incrementValue;
      if (newCount <= max) {
        onCountChange?.(newCount); // Optional callback for count changes
        return newCount;
      } else {
        return prevCount; // Prevent exceeding max
      }
    });
  }, [incrementValue, max, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - incrementValue;
      if (newCount >= min) {
        onCountChange?.(newCount); // Optional callback for count changes
        return newCount;
      } else {
        return prevCount; // Prevent going below min
      }
    });
  }, [incrementValue, min, onCountChange]);

  // Memoize the count display to avoid unnecessary re-renders
  const countDisplay = useMemo(() => `Count: ${count}`, [count]);

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">{countDisplay}</p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={count >= max} // Disable increment if at max
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={count <= min} // Disable decrement if at min
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;