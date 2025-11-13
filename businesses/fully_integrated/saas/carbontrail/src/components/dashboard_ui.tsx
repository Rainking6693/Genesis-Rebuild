import React, { useState, useCallback, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementBy?: number;
  maxCount?: number;
  minCount?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
}

/**
 * A resilient and accessible counter component.
 *
 * Allows incrementing and decrementing a count value. The increment and decrement
 * amounts can be customized via the `incrementBy` prop. The initial value can
 * be set via the `initialCount` prop. The `maxCount` and `minCount` props are
 * used to prevent the count from going beyond specified limits.
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  maxCount,
  minCount,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  useEffect(() => {
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  const increment = useCallback(() => {
    if (maxCount === undefined || count < maxCount) {
      setCount((prevCount) => {
        const newCount = prevCount + incrementBy;
        return maxCount === undefined ? newCount : Math.min(newCount, maxCount);
      });
    }
  }, [count, incrementBy, maxCount]);

  const decrement = useCallback(() => {
    if (minCount === undefined || count > minCount) {
      setCount((prevCount) => {
        const newCount = prevCount - incrementBy;
        return minCount === undefined ? newCount : Math.max(newCount, minCount);
      });
    }
  }, [count, incrementBy, minCount]);

  const isIncrementDisabled = maxCount !== undefined && count >= maxCount;
  const isDecrementDisabled = minCount !== undefined && count <= minCount;

  return (
    <div>
      <p aria-live="polite">Count: {count}</p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={isIncrementDisabled}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={isDecrementDisabled}
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
  maxCount?: number;
  minCount?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
}

/**
 * A resilient and accessible counter component.
 *
 * Allows incrementing and decrementing a count value. The increment and decrement
 * amounts can be customized via the `incrementBy` prop. The initial value can
 * be set via the `initialCount` prop. The `maxCount` and `minCount` props are
 * used to prevent the count from going beyond specified limits.
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  maxCount,
  minCount,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  useEffect(() => {
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  const increment = useCallback(() => {
    if (maxCount === undefined || count < maxCount) {
      setCount((prevCount) => {
        const newCount = prevCount + incrementBy;
        return maxCount === undefined ? newCount : Math.min(newCount, maxCount);
      });
    }
  }, [count, incrementBy, maxCount]);

  const decrement = useCallback(() => {
    if (minCount === undefined || count > minCount) {
      setCount((prevCount) => {
        const newCount = prevCount - incrementBy;
        return minCount === undefined ? newCount : Math.max(newCount, minCount);
      });
    }
  }, [count, incrementBy, minCount]);

  const isIncrementDisabled = maxCount !== undefined && count >= maxCount;
  const isDecrementDisabled = minCount !== undefined && count <= minCount;

  return (
    <div>
      <p aria-live="polite">Count: {count}</p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={isIncrementDisabled}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={isDecrementDisabled}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;