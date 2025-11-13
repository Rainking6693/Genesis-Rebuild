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

  // Validate incrementStep
  const validatedIncrementStep = useMemo(() => {
    if (typeof incrementStep !== 'number' || !Number.isFinite(incrementStep) || incrementStep <= 0) {
      console.warn("Invalid incrementStep provided.  Must be a positive finite number.  Using default of 1.");
      return 1;
    }
    return incrementStep;
  }, [incrementStep]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount + validatedIncrementStep;
      if (nextCount <= max) {
        onCountChange?.(nextCount); // Optional callback
        return nextCount;
      } else {
        return prevCount; // Don't increment if it exceeds the max
      }
    });
  }, [validatedIncrementStep, max, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount - validatedIncrementStep;
      if (nextCount >= min) {
        onCountChange?.(nextCount); // Optional callback
        return nextCount;
      } else {
        return prevCount; // Don't decrement if it goes below the min
      }
    });
  }, [validatedIncrementStep, min, onCountChange]);

  const isIncrementDisabled = useMemo(() => count >= max, [count, max]);
  const isDecrementDisabled = useMemo(() => count <= min, [count, min]);

  return (
    <div role="group" aria-label="Counter">
      <p>Count: {count}</p>
      <button
        onClick={increment}
        disabled={isIncrementDisabled}
        aria-label={ariaLabelIncrement}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        disabled={isDecrementDisabled}
        aria-label={ariaLabelDecrement}
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

  // Validate incrementStep
  const validatedIncrementStep = useMemo(() => {
    if (typeof incrementStep !== 'number' || !Number.isFinite(incrementStep) || incrementStep <= 0) {
      console.warn("Invalid incrementStep provided.  Must be a positive finite number.  Using default of 1.");
      return 1;
    }
    return incrementStep;
  }, [incrementStep]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount + validatedIncrementStep;
      if (nextCount <= max) {
        onCountChange?.(nextCount); // Optional callback
        return nextCount;
      } else {
        return prevCount; // Don't increment if it exceeds the max
      }
    });
  }, [validatedIncrementStep, max, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount - validatedIncrementStep;
      if (nextCount >= min) {
        onCountChange?.(nextCount); // Optional callback
        return nextCount;
      } else {
        return prevCount; // Don't decrement if it goes below the min
      }
    });
  }, [validatedIncrementStep, min, onCountChange]);

  const isIncrementDisabled = useMemo(() => count >= max, [count, max]);
  const isDecrementDisabled = useMemo(() => count <= min, [count, min]);

  return (
    <div role="group" aria-label="Counter">
      <p>Count: {count}</p>
      <button
        onClick={increment}
        disabled={isIncrementDisabled}
        aria-label={ariaLabelIncrement}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        disabled={isDecrementDisabled}
        aria-label={ariaLabelDecrement}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;