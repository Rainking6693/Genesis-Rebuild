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
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount + incrementBy;
      if (nextCount > max) {
        return prevCount; // Or throw an error, or wrap around, depending on desired behavior
      }
      return nextCount;
    });
  }, [incrementBy, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount - incrementBy;
      if (nextCount < min) {
        return prevCount; // Or throw an error, or wrap around, depending on desired behavior
      }
      return nextCount;
    });
  }, [incrementBy, min]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'ArrowUp') {
      increment();
    } else if (event.key === 'ArrowDown') {
      decrement();
    }
  }, [increment, decrement]);

  return (
    <div onKeyDown={handleKeyDown} tabIndex={0}>
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
      const nextCount = prevCount + incrementBy;
      if (nextCount > max) {
        return prevCount; // Or throw an error, or wrap around, depending on desired behavior
      }
      return nextCount;
    });
  }, [incrementBy, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount - incrementBy;
      if (nextCount < min) {
        return prevCount; // Or throw an error, or wrap around, depending on desired behavior
      }
      return nextCount;
    });
  }, [incrementBy, min]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'ArrowUp') {
      increment();
    } else if (event.key === 'ArrowDown') {
      decrement();
    }
  }, [increment, decrement]);

  return (
    <div onKeyDown={handleKeyDown} tabIndex={0}>
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