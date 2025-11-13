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
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Use useMemo to avoid unnecessary recalculations
  const incrementDisabled = useMemo(() => count >= max, [count, max]);
  const decrementDisabled = useMemo(() => count <= min, [count, min]);

  // Use useCallback to memoize the increment function
  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + incrementBy;
      if (newCount > max) {
        return prevCount; // Prevent exceeding the maximum
      }
      onCountChange?.(newCount); // Optional callback for count changes
      return newCount;
    });
  }, [incrementBy, max, onCountChange]);

  // Use useCallback to memoize the decrement function
  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - incrementBy;
      if (newCount < min) {
        return prevCount; // Prevent going below the minimum
      }
      onCountChange?.(newCount); // Optional callback for count changes
      return newCount;
    });
  }, [incrementBy, min, onCountChange]);

  const countDisplay = useMemo(() => {
    if (count < min) {
      return min;
    }
    if (count > max) {
      return max;
    }
    return count;
  }, [count, min, max]);

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {countDisplay}</p>
      <button
        onClick={increment}
        disabled={incrementDisabled}
        aria-label={ariaLabelIncrement}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        disabled={decrementDisabled}
        aria-label={ariaLabelDecrement}
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
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Use useMemo to avoid unnecessary recalculations
  const incrementDisabled = useMemo(() => count >= max, [count, max]);
  const decrementDisabled = useMemo(() => count <= min, [count, min]);

  // Use useCallback to memoize the increment function
  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + incrementBy;
      if (newCount > max) {
        return prevCount; // Prevent exceeding the maximum
      }
      onCountChange?.(newCount); // Optional callback for count changes
      return newCount;
    });
  }, [incrementBy, max, onCountChange]);

  // Use useCallback to memoize the decrement function
  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - incrementBy;
      if (newCount < min) {
        return prevCount; // Prevent going below the minimum
      }
      onCountChange?.(newCount); // Optional callback for count changes
      return newCount;
    });
  }, [incrementBy, min, onCountChange]);

  const countDisplay = useMemo(() => {
    if (count < min) {
      return min;
    }
    if (count > max) {
      return max;
    }
    return count;
  }, [count, min, max]);

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {countDisplay}</p>
      <button
        onClick={increment}
        disabled={incrementDisabled}
        aria-label={ariaLabelIncrement}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        disabled={decrementDisabled}
        aria-label={ariaLabelDecrement}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;