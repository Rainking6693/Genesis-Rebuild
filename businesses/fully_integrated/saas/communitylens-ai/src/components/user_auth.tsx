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
    if (typeof incrementStep !== 'number' || isNaN(incrementStep)) {
      console.warn("Invalid incrementStep provided. Using default value of 1.");
      return 1;
    }
    return incrementStep;
  }, [incrementStep]);

  // Use useCallback to memoize the increment function
  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + validatedIncrementStep;
      if (newCount > max) {
        return prevCount; // Or handle max limit differently, e.g., wrap around
      }
      if (onCountChange) {
        onCountChange(newCount);
      }
      return newCount;
    });
  }, [validatedIncrementStep, max, onCountChange]);

  // Use useCallback to memoize the decrement function
  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - validatedIncrementStep;
      if (newCount < min) {
        return prevCount; // Or handle min limit differently, e.g., wrap around
      }
      if (onCountChange) {
        onCountChange(newCount);
      }
      return newCount;
    });
  }, [validatedIncrementStep, min, onCountChange]);

  // Handle potential errors with initialCount, min, and max
  if (typeof initialCount !== 'number' || isNaN(initialCount)) {
    console.error("Invalid initialCount provided. Using default value of 0.");
  }

  if (typeof min !== 'number' || isNaN(min)) {
    console.error("Invalid min value provided. Using default value of Number.NEGATIVE_INFINITY.");
  }

  if (typeof max !== 'number' || isNaN(max)) {
    console.error("Invalid max value provided. Using default value of Number.POSITIVE_INFINITY.");
  }

  const isIncrementDisabled = count >= max;
  const isDecrementDisabled = count <= min;

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {count}</p>
      <button
        onClick={increment}
        disabled={isIncrementDisabled}
        aria-label={ariaLabelIncrement}
        style={{cursor: isIncrementDisabled ? 'not-allowed' : 'pointer', opacity: isIncrementDisabled ? 0.5 : 1}}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        disabled={isDecrementDisabled}
        aria-label={ariaLabelDecrement}
        style={{cursor: isDecrementDisabled ? 'not-allowed' : 'pointer', opacity: isDecrementDisabled ? 0.5 : 1}}
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
    if (typeof incrementStep !== 'number' || isNaN(incrementStep)) {
      console.warn("Invalid incrementStep provided. Using default value of 1.");
      return 1;
    }
    return incrementStep;
  }, [incrementStep]);

  // Use useCallback to memoize the increment function
  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + validatedIncrementStep;
      if (newCount > max) {
        return prevCount; // Or handle max limit differently, e.g., wrap around
      }
      if (onCountChange) {
        onCountChange(newCount);
      }
      return newCount;
    });
  }, [validatedIncrementStep, max, onCountChange]);

  // Use useCallback to memoize the decrement function
  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - validatedIncrementStep;
      if (newCount < min) {
        return prevCount; // Or handle min limit differently, e.g., wrap around
      }
      if (onCountChange) {
        onCountChange(newCount);
      }
      return newCount;
    });
  }, [validatedIncrementStep, min, onCountChange]);

  // Handle potential errors with initialCount, min, and max
  if (typeof initialCount !== 'number' || isNaN(initialCount)) {
    console.error("Invalid initialCount provided. Using default value of 0.");
  }

  if (typeof min !== 'number' || isNaN(min)) {
    console.error("Invalid min value provided. Using default value of Number.NEGATIVE_INFINITY.");
  }

  if (typeof max !== 'number' || isNaN(max)) {
    console.error("Invalid max value provided. Using default value of Number.POSITIVE_INFINITY.");
  }

  const isIncrementDisabled = count >= max;
  const isDecrementDisabled = count <= min;

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {count}</p>
      <button
        onClick={increment}
        disabled={isIncrementDisabled}
        aria-label={ariaLabelIncrement}
        style={{cursor: isIncrementDisabled ? 'not-allowed' : 'pointer', opacity: isIncrementDisabled ? 0.5 : 1}}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        disabled={isDecrementDisabled}
        aria-label={ariaLabelDecrement}
        style={{cursor: isDecrementDisabled ? 'not-allowed' : 'pointer', opacity: isDecrementDisabled ? 0.5 : 1}}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;