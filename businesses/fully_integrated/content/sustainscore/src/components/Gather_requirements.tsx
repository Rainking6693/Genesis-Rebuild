import React, { useState, useCallback, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabel?: string;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  ariaLabel = 'Counter',
}) => {
  const [count, setCount] = useState<number>(initialCount);

  useEffect(() => {
    // Ensure the count is within the specified range
    setCount(Math.max(min, Math.min(max, count)));
  }, [count, min, max]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + incrementStep;
      return Math.min(max, newCount);
    });
  }, [incrementStep, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - incrementStep;
      return Math.max(min, newCount);
    });
  }, [incrementStep, min]);

  // Validate the props
  if (typeof initialCount !== 'number' || !Number.isFinite(initialCount)) {
    throw new Error('initialCount must be a finite number');
  }

  if (typeof incrementStep !== 'number' || !Number.isFinite(incrementStep) || incrementStep <= 0) {
    throw new Error('incrementStep must be a positive finite number');
  }

  if (typeof min !== 'number' || !Number.isFinite(min)) {
    throw new Error('min must be a finite number');
  }

  if (typeof max !== 'number' || !Number.isFinite(max) || max < min) {
    throw new Error('max must be a finite number greater than or equal to min');
  }

  if (typeof ariaLabel !== 'string') {
    throw new Error('ariaLabel must be a string');
  }

  return (
    <div>
      <p aria-label={ariaLabel}>Count: {count}</p>
      <button
        onClick={decrement}
        disabled={count <= min}
        aria-label="Decrement"
        aria-disabled={count <= min}
      >
        Decrement
      </button>
      <button
        onClick={increment}
        disabled={count >= max}
        aria-label="Increment"
        aria-disabled={count >= max}
      >
        Increment
      </button>
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabel?: string;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  ariaLabel = 'Counter',
}) => {
  const [count, setCount] = useState<number>(initialCount);

  useEffect(() => {
    // Ensure the count is within the specified range
    setCount(Math.max(min, Math.min(max, count)));
  }, [count, min, max]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + incrementStep;
      return Math.min(max, newCount);
    });
  }, [incrementStep, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - incrementStep;
      return Math.max(min, newCount);
    });
  }, [incrementStep, min]);

  // Validate the props
  if (typeof initialCount !== 'number' || !Number.isFinite(initialCount)) {
    throw new Error('initialCount must be a finite number');
  }

  if (typeof incrementStep !== 'number' || !Number.isFinite(incrementStep) || incrementStep <= 0) {
    throw new Error('incrementStep must be a positive finite number');
  }

  if (typeof min !== 'number' || !Number.isFinite(min)) {
    throw new Error('min must be a finite number');
  }

  if (typeof max !== 'number' || !Number.isFinite(max) || max < min) {
    throw new Error('max must be a finite number greater than or equal to min');
  }

  if (typeof ariaLabel !== 'string') {
    throw new Error('ariaLabel must be a string');
  }

  return (
    <div>
      <p aria-label={ariaLabel}>Count: {count}</p>
      <button
        onClick={decrement}
        disabled={count <= min}
        aria-label="Decrement"
        aria-disabled={count <= min}
      >
        Decrement
      </button>
      <button
        onClick={increment}
        disabled={count >= max}
        aria-label="Increment"
        aria-disabled={count >= max}
      >
        Increment
      </button>
    </div>
  );
};

export default Counter;