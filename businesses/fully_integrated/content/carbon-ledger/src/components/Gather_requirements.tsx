import React, { useState, useCallback, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  minCount?: number;
  maxCount?: number;
  onCountChange?: (count: number) => void;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  minCount = Number.MIN_SAFE_INTEGER,
  maxCount = Number.MAX_SAFE_INTEGER,
  onCountChange,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  useEffect(() => {
    // Ensure the count is within the valid range
    const clampedCount = Math.max(minCount, Math.min(maxCount, count));
    if (clampedCount !== count) {
      setCount(clampedCount);
    }
  }, [count, minCount, maxCount]);

  const handleIncrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + incrementStep;
      if (newCount > maxCount) {
        onCountChange?.(maxCount);
        return maxCount;
      }
      onCountChange?.(newCount);
      return newCount;
    });
  }, [incrementStep, maxCount, onCountChange]);

  const handleDecrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - incrementStep;
      if (newCount < minCount) {
        onCountChange?.(minCount);
        return minCount;
      }
      onCountChange?.(newCount);
      return newCount;
    });
  }, [incrementStep, minCount, onCountChange]);

  return (
    <div>
      <p aria-live="polite" aria-atomic="true">
        Count: {count}
      </p>
      <button
        onClick={handleIncrement}
        aria-label="Increment"
        disabled={count >= maxCount}
      >
        +
      </button>
      <button
        onClick={handleDecrement}
        aria-label="Decrement"
        disabled={count <= minCount}
      >
        -
      </button>
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  minCount?: number;
  maxCount?: number;
  onCountChange?: (count: number) => void;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  minCount = Number.MIN_SAFE_INTEGER,
  maxCount = Number.MAX_SAFE_INTEGER,
  onCountChange,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  useEffect(() => {
    // Ensure the count is within the valid range
    const clampedCount = Math.max(minCount, Math.min(maxCount, count));
    if (clampedCount !== count) {
      setCount(clampedCount);
    }
  }, [count, minCount, maxCount]);

  const handleIncrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + incrementStep;
      if (newCount > maxCount) {
        onCountChange?.(maxCount);
        return maxCount;
      }
      onCountChange?.(newCount);
      return newCount;
    });
  }, [incrementStep, maxCount, onCountChange]);

  const handleDecrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - incrementStep;
      if (newCount < minCount) {
        onCountChange?.(minCount);
        return minCount;
      }
      onCountChange?.(newCount);
      return newCount;
    });
  }, [incrementStep, minCount, onCountChange]);

  return (
    <div>
      <p aria-live="polite" aria-atomic="true">
        Count: {count}
      </p>
      <button
        onClick={handleIncrement}
        aria-label="Increment"
        disabled={count >= maxCount}
      >
        +
      </button>
      <button
        onClick={handleDecrement}
        aria-label="Decrement"
        disabled={count <= minCount}
      >
        -
      </button>
    </div>
  );
};

export default Counter;