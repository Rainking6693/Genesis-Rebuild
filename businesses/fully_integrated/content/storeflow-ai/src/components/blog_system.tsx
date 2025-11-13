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
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Use useMemo to prevent unnecessary re-renders if incrementStep doesn't change
  const validatedIncrementStep = useMemo(() => {
    if (typeof incrementStep !== 'number' || !Number.isFinite(incrementStep)) {
      console.warn("Invalid incrementStep provided. Using default value of 1.");
      return 1;
    }
    return incrementStep;
  }, [incrementStep]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + validatedIncrementStep;
      if (newCount > max) {
        return prevCount; // Or throw an error, or wrap around, depending on desired behavior
      }
      if (onCountChange) {
        onCountChange(newCount);
      }
      return newCount;
    });
  }, [validatedIncrementStep, max, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - validatedIncrementStep;
      if (newCount < min) {
        return prevCount; // Or throw an error, or wrap around, depending on desired behavior
      }
      if (onCountChange) {
        onCountChange(newCount);
      }
      return newCount;
    });
  }, [validatedIncrementStep, min, onCountChange]);

  const countDisplay = useMemo(() => {
    return Number.isFinite(count) ? count.toString() : 'Invalid Count';
  }, [count]);

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {countDisplay}</p>
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
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Use useMemo to prevent unnecessary re-renders if incrementStep doesn't change
  const validatedIncrementStep = useMemo(() => {
    if (typeof incrementStep !== 'number' || !Number.isFinite(incrementStep)) {
      console.warn("Invalid incrementStep provided. Using default value of 1.");
      return 1;
    }
    return incrementStep;
  }, [incrementStep]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + validatedIncrementStep;
      if (newCount > max) {
        return prevCount; // Or throw an error, or wrap around, depending on desired behavior
      }
      if (onCountChange) {
        onCountChange(newCount);
      }
      return newCount;
    });
  }, [validatedIncrementStep, max, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - validatedIncrementStep;
      if (newCount < min) {
        return prevCount; // Or throw an error, or wrap around, depending on desired behavior
      }
      if (onCountChange) {
        onCountChange(newCount);
      }
      return newCount;
    });
  }, [validatedIncrementStep, min, onCountChange]);

  const countDisplay = useMemo(() => {
    return Number.isFinite(count) ? count.toString() : 'Invalid Count';
  }, [count]);

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {countDisplay}</p>
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