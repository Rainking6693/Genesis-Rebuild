import React, { useState, useCallback, useRef, useEffect } from 'react';

interface Props {
  initialCount?: number;
  incrementBy?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
}

const Counter: React.FC<Props> = ({
  initialCount = 0,
  incrementBy = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const countRef = useRef<number>(initialCount); // useRef for accessing the most recent count value inside callbacks

  useEffect(() => {
    setCount(initialCount); // Reset count when initialCount prop changes
    countRef.current = initialCount;
  }, [initialCount]);

  useEffect(() => {
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + incrementBy;
      if (newCount > max) {
        return prevCount; // Prevent exceeding max
      }
      countRef.current = newCount;
      return newCount;
    });
  }, [incrementBy, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - incrementBy;
      if (newCount < min) {
        return prevCount; // Prevent going below min
      }
      countRef.current = newCount;
      return newCount;
    });
  }, [incrementBy, min]);

  // Accessibility improvements:  aria-live for screen readers
  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {count}</p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={count >= max}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={count <= min}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useRef, useEffect } from 'react';

interface Props {
  initialCount?: number;
  incrementBy?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
}

const Counter: React.FC<Props> = ({
  initialCount = 0,
  incrementBy = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const countRef = useRef<number>(initialCount); // useRef for accessing the most recent count value inside callbacks

  useEffect(() => {
    setCount(initialCount); // Reset count when initialCount prop changes
    countRef.current = initialCount;
  }, [initialCount]);

  useEffect(() => {
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + incrementBy;
      if (newCount > max) {
        return prevCount; // Prevent exceeding max
      }
      countRef.current = newCount;
      return newCount;
    });
  }, [incrementBy, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - incrementBy;
      if (newCount < min) {
        return prevCount; // Prevent going below min
      }
      countRef.current = newCount;
      return newCount;
    });
  }, [incrementBy, min]);

  // Accessibility improvements:  aria-live for screen readers
  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {count}</p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={count >= max}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={count <= min}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;