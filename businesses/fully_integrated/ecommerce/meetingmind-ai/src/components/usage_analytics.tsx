import React, { useState, useCallback, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  useEffect(() => {
    // Ensure the count is within the valid range
    setCount(Math.max(0, count));
  }, [count]);

  const increment = useCallback(() => {
    setCount((prevCount) => Math.min(Number.MAX_SAFE_INTEGER, prevCount + incrementStep));
  }, [incrementStep]);

  const decrement = useCallback(() => {
    setCount((prevCount) => Math.max(0, prevCount - incrementStep));
  }, [incrementStep]);

  return (
    <div>
      <p
        data-testid="count-value"
        aria-live="polite"
        aria-atomic="true"
        aria-describedby="count-description"
      >
        Count: {count}
      </p>
      <span id="count-description" className="sr-only">
        The current count value.
      </span>
      <button
        data-testid="increment-button"
        onClick={increment}
        aria-label="Increment"
        disabled={count >= Number.MAX_SAFE_INTEGER}
      >
        +
      </button>
      <button
        data-testid="decrement-button"
        onClick={decrement}
        aria-label="Decrement"
        disabled={count <= 0}
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
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  useEffect(() => {
    // Ensure the count is within the valid range
    setCount(Math.max(0, count));
  }, [count]);

  const increment = useCallback(() => {
    setCount((prevCount) => Math.min(Number.MAX_SAFE_INTEGER, prevCount + incrementStep));
  }, [incrementStep]);

  const decrement = useCallback(() => {
    setCount((prevCount) => Math.max(0, prevCount - incrementStep));
  }, [incrementStep]);

  return (
    <div>
      <p
        data-testid="count-value"
        aria-live="polite"
        aria-atomic="true"
        aria-describedby="count-description"
      >
        Count: {count}
      </p>
      <span id="count-description" className="sr-only">
        The current count value.
      </span>
      <button
        data-testid="increment-button"
        onClick={increment}
        aria-label="Increment"
        disabled={count >= Number.MAX_SAFE_INTEGER}
      >
        +
      </button>
      <button
        data-testid="decrement-button"
        onClick={decrement}
        aria-label="Decrement"
        disabled={count <= 0}
      >
        -
      </button>
    </div>
  );
};

export default Counter;