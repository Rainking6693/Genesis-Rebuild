import React, { useState, useCallback, useRef, useEffect } from 'react';

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
  const [count, setCount] = useState(initialCount);
  const countRef = useRef(count);

  useEffect(() => {
    countRef.current = count;
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + incrementBy;
      if (newCount > max) {
        return prevCount; // Or handle differently, e.g., wrap around
      }
      return newCount;
    });
  }, [incrementBy, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - incrementBy;
      if (newCount < min) {
        return prevCount; // Or handle differently, e.g., wrap around
      }
      return newCount;
    });
  }, [incrementBy, min]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowUp') {
        increment();
      } else if (event.key === 'ArrowDown') {
        decrement();
      }
    },
    [increment, decrement]
  );

  const isIncrementDisabled = countRef.current >= max;
  const isDecrementDisabled = countRef.current <= min;

  return (
    <div
      role="group"
      aria-label="Counter"
      onKeyDown={handleKeyDown}
      tabIndex={0} // Make the div focusable for keyboard navigation
    >
      <p aria-live="polite">Count: {count}</p>
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

import React, { useState, useCallback, useRef, useEffect } from 'react';

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
  const [count, setCount] = useState(initialCount);
  const countRef = useRef(count);

  useEffect(() => {
    countRef.current = count;
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + incrementBy;
      if (newCount > max) {
        return prevCount; // Or handle differently, e.g., wrap around
      }
      return newCount;
    });
  }, [incrementBy, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - incrementBy;
      if (newCount < min) {
        return prevCount; // Or handle differently, e.g., wrap around
      }
      return newCount;
    });
  }, [incrementBy, min]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowUp') {
        increment();
      } else if (event.key === 'ArrowDown') {
        decrement();
      }
    },
    [increment, decrement]
  );

  const isIncrementDisabled = countRef.current >= max;
  const isDecrementDisabled = countRef.current <= min;

  return (
    <div
      role="group"
      aria-label="Counter"
      onKeyDown={handleKeyDown}
      tabIndex={0} // Make the div focusable for keyboard navigation
    >
      <p aria-live="polite">Count: {count}</p>
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