import React, { useState, useCallback, useMemo } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Validate incrementStep
  const validatedIncrementStep = useMemo(() => {
    if (typeof incrementStep !== 'number' || !Number.isFinite(incrementStep) || incrementStep <= 0) {
      console.warn('Invalid incrementStep provided. Using default value of 1.');
      return 1;
    }
    return incrementStep;
  }, [incrementStep]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + validatedIncrementStep;
      if (newCount <= max) {
        onCountChange?.(newCount); // Optional callback
        return newCount;
      }
      return prevCount; // Prevent exceeding max
    });
  }, [validatedIncrementStep, max, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - validatedIncrementStep;
      if (newCount >= min) {
        onCountChange?.(newCount); // Optional callback
        return newCount;
      }
      return prevCount; // Prevent going below min
    });
  }, [validatedIncrementStep, min, onCountChange]);

  const countDisplay = useMemo(() => {
    return count.toLocaleString(); // Add commas for readability
  }, [count]);

  return (
    <div role="group" aria-label="Counter">
      <p>Count: {countDisplay}</p>
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
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Validate incrementStep
  const validatedIncrementStep = useMemo(() => {
    if (typeof incrementStep !== 'number' || !Number.isFinite(incrementStep) || incrementStep <= 0) {
      console.warn('Invalid incrementStep provided. Using default value of 1.');
      return 1;
    }
    return incrementStep;
  }, [incrementStep]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + validatedIncrementStep;
      if (newCount <= max) {
        onCountChange?.(newCount); // Optional callback
        return newCount;
      }
      return prevCount; // Prevent exceeding max
    });
  }, [validatedIncrementStep, max, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - validatedIncrementStep;
      if (newCount >= min) {
        onCountChange?.(newCount); // Optional callback
        return newCount;
      }
      return prevCount; // Prevent going below min
    });
  }, [validatedIncrementStep, min, onCountChange]);

  const countDisplay = useMemo(() => {
    return count.toLocaleString(); // Add commas for readability
  }, [count]);

  return (
    <div role="group" aria-label="Counter">
      <p>Count: {countDisplay}</p>
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