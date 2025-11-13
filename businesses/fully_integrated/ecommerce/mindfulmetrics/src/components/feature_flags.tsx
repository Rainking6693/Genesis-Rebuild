import React, { useState, useCallback, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementBy?: number;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  useEffect(() => {
    // Ensure the count is always a valid number
    setCount((prevCount) => (typeof prevCount !== 'number' || isNaN(prevCount) ? 0 : prevCount));
  }, []);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = typeof prevCount === 'number' ? prevCount + incrementBy : 0;
      return isNaN(newCount) ? prevCount : newCount;
    });
  }, [incrementBy]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = typeof prevCount === 'number' ? prevCount - incrementBy : 0;
      return isNaN(newCount) ? prevCount : newCount;
    });
  }, [incrementBy]);

  return (
    <div>
      <p aria-live="polite" aria-atomic="true">
        Count: {typeof count === 'number' ? count.toLocaleString() : '0'}
      </p>
      <button
        onClick={increment}
        aria-label="Increment"
        disabled={typeof count !== 'number' || count + incrementBy > Number.MAX_SAFE_INTEGER}
      >
        +
      </button>
      <button
        onClick={decrement}
        aria-label="Decrement"
        disabled={typeof count !== 'number' || count - incrementBy < Number.MIN_SAFE_INTEGER}
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
  incrementBy?: number;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  useEffect(() => {
    // Ensure the count is always a valid number
    setCount((prevCount) => (typeof prevCount !== 'number' || isNaN(prevCount) ? 0 : prevCount));
  }, []);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = typeof prevCount === 'number' ? prevCount + incrementBy : 0;
      return isNaN(newCount) ? prevCount : newCount;
    });
  }, [incrementBy]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = typeof prevCount === 'number' ? prevCount - incrementBy : 0;
      return isNaN(newCount) ? prevCount : newCount;
    });
  }, [incrementBy]);

  return (
    <div>
      <p aria-live="polite" aria-atomic="true">
        Count: {typeof count === 'number' ? count.toLocaleString() : '0'}
      </p>
      <button
        onClick={increment}
        aria-label="Increment"
        disabled={typeof count !== 'number' || count + incrementBy > Number.MAX_SAFE_INTEGER}
      >
        +
      </button>
      <button
        onClick={decrement}
        aria-label="Decrement"
        disabled={typeof count !== 'number' || count - incrementBy < Number.MIN_SAFE_INTEGER}
      >
        -
      </button>
    </div>
  );
};

export default Counter;