import React, { useState, useCallback, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementBy?: number;
  minCount?: number;
  maxCount?: number;
  onCountChange?: (count: number) => void;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  minCount = Number.MIN_SAFE_INTEGER,
  maxCount = Number.MAX_SAFE_INTEGER,
  onCountChange,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  useEffect(() => {
    // Ensure the count is within the specified range
    const clampedCount = Math.max(minCount, Math.min(maxCount, count));
    if (clampedCount !== count) {
      setCount(clampedCount);
    }
  }, [count, minCount, maxCount]);

  useEffect(() => {
    // Call the onCountChange callback if provided
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + incrementBy;
      return Math.max(minCount, Math.min(maxCount, newCount));
    });
  }, [incrementBy, minCount, maxCount]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - incrementBy;
      return Math.max(minCount, Math.min(maxCount, newCount));
    });
  }, [incrementBy, minCount, maxCount]);

  return (
    <div>
      <p data-testid="count-value" aria-live="polite">
        Count: {count}
      </p>
      <button
        data-testid="increment-button"
        onClick={increment}
        disabled={count >= maxCount}
        aria-label="Increment"
      >
        Increment
      </button>
      <button
        data-testid="decrement-button"
        onClick={decrement}
        disabled={count <= minCount}
        aria-label="Decrement"
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementBy?: number;
  minCount?: number;
  maxCount?: number;
  onCountChange?: (count: number) => void;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  minCount = Number.MIN_SAFE_INTEGER,
  maxCount = Number.MAX_SAFE_INTEGER,
  onCountChange,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  useEffect(() => {
    // Ensure the count is within the specified range
    const clampedCount = Math.max(minCount, Math.min(maxCount, count));
    if (clampedCount !== count) {
      setCount(clampedCount);
    }
  }, [count, minCount, maxCount]);

  useEffect(() => {
    // Call the onCountChange callback if provided
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + incrementBy;
      return Math.max(minCount, Math.min(maxCount, newCount));
    });
  }, [incrementBy, minCount, maxCount]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - incrementBy;
      return Math.max(minCount, Math.min(maxCount, newCount));
    });
  }, [incrementBy, minCount, maxCount]);

  return (
    <div>
      <p data-testid="count-value" aria-live="polite">
        Count: {count}
      </p>
      <button
        data-testid="increment-button"
        onClick={increment}
        disabled={count >= maxCount}
        aria-label="Increment"
      >
        Increment
      </button>
      <button
        data-testid="decrement-button"
        onClick={decrement}
        disabled={count <= minCount}
        aria-label="Decrement"
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;