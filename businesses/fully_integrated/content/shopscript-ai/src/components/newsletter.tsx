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
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
}) => {
  const [count, setCount] = useState(initialCount);
  const countRef = useRef(count);

  useEffect(() => {
    countRef.current = count;
  }, [count]);

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
      return newCount;
    });
  }, [incrementBy, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - incrementBy;
      if (newCount < min) {
        return prevCount; // Prevent going below min
      }
      return newCount;
    });
  }, [incrementBy, min]);

  // Handle potential errors with incrementBy being zero
  const safeIncrementBy = Math.abs(incrementBy) || 1;

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
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
}) => {
  const [count, setCount] = useState(initialCount);
  const countRef = useRef(count);

  useEffect(() => {
    countRef.current = count;
  }, [count]);

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
      return newCount;
    });
  }, [incrementBy, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - incrementBy;
      if (newCount < min) {
        return prevCount; // Prevent going below min
      }
      return newCount;
    });
  }, [incrementBy, min]);

  // Handle potential errors with incrementBy being zero
  const safeIncrementBy = Math.abs(incrementBy) || 1;

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