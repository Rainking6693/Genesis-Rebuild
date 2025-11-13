import React, { useState, useCallback, useMemo } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementBy?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Use useMemo to prevent unnecessary recalculations
  const incrementValue = useMemo(() => Math.abs(incrementBy), [incrementBy]);
  const decrementValue = useMemo(() => Math.abs(incrementBy), [incrementBy]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newValue = prevCount + incrementValue;
      return newValue <= max ? newValue : prevCount; // Prevent exceeding max
    });
  }, [incrementValue, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newValue = prevCount - decrementValue;
      return newValue >= min ? newValue : prevCount; // Prevent going below min
    });
  }, [decrementValue, min]);

  // Handle potential errors with incrementBy being zero
  if (incrementValue === 0) {
    return (
      <div>
        <p>Error: incrementBy cannot be zero.</p>
      </div>
    );
  }

  return (
    <div>
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

import React, { useState, useCallback, useMemo } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementBy?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Use useMemo to prevent unnecessary recalculations
  const incrementValue = useMemo(() => Math.abs(incrementBy), [incrementBy]);
  const decrementValue = useMemo(() => Math.abs(incrementBy), [incrementBy]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newValue = prevCount + incrementValue;
      return newValue <= max ? newValue : prevCount; // Prevent exceeding max
    });
  }, [incrementValue, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newValue = prevCount - decrementValue;
      return newValue >= min ? newValue : prevCount; // Prevent going below min
    });
  }, [decrementValue, min]);

  // Handle potential errors with incrementBy being zero
  if (incrementValue === 0) {
    return (
      <div>
        <p>Error: incrementBy cannot be zero.</p>
      </div>
    );
  }

  return (
    <div>
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