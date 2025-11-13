import React, { useState, useCallback, useMemo } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
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
      const nextCount = prevCount + validatedIncrementStep;
      return nextCount <= max ? nextCount : prevCount; // Prevent exceeding max
    });
  }, [validatedIncrementStep, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount - validatedIncrementStep;
      return nextCount >= min ? nextCount : prevCount; // Prevent going below min
    });
  }, [validatedIncrementStep, min]);

  // Handle potential errors with initialCount, min, and max
  if (typeof initialCount !== 'number' || !Number.isFinite(initialCount)) {
    console.error("Invalid initialCount provided. Rendering a fallback.");
    return <div>Error: Invalid initial count.</div>; // Or a more graceful fallback
  }

  if (typeof min !== 'number' || !Number.isFinite(min)) {
    console.warn("Invalid min value provided. Ignoring min constraint.");
  }

  if (typeof max !== 'number' || !Number.isFinite(max)) {
    console.warn("Invalid max value provided. Ignoring max constraint.");
  }

  const isIncrementDisabled = count >= max;
  const isDecrementDisabled = count <= min;

  return (
    <div role="group" aria-label="Counter">
      <p>Count: {count}</p>
      <button
        onClick={decrement}
        disabled={isDecrementDisabled}
        aria-label={ariaLabelDecrement}
      >
        Decrement
      </button>
      <button
        onClick={increment}
        disabled={isIncrementDisabled}
        aria-label={ariaLabelIncrement}
      >
        Increment
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
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
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
      const nextCount = prevCount + validatedIncrementStep;
      return nextCount <= max ? nextCount : prevCount; // Prevent exceeding max
    });
  }, [validatedIncrementStep, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount - validatedIncrementStep;
      return nextCount >= min ? nextCount : prevCount; // Prevent going below min
    });
  }, [validatedIncrementStep, min]);

  // Handle potential errors with initialCount, min, and max
  if (typeof initialCount !== 'number' || !Number.isFinite(initialCount)) {
    console.error("Invalid initialCount provided. Rendering a fallback.");
    return <div>Error: Invalid initial count.</div>; // Or a more graceful fallback
  }

  if (typeof min !== 'number' || !Number.isFinite(min)) {
    console.warn("Invalid min value provided. Ignoring min constraint.");
  }

  if (typeof max !== 'number' || !Number.isFinite(max)) {
    console.warn("Invalid max value provided. Ignoring max constraint.");
  }

  const isIncrementDisabled = count >= max;
  const isDecrementDisabled = count <= min;

  return (
    <div role="group" aria-label="Counter">
      <p>Count: {count}</p>
      <button
        onClick={decrement}
        disabled={isDecrementDisabled}
        aria-label={ariaLabelDecrement}
      >
        Decrement
      </button>
      <button
        onClick={increment}
        disabled={isIncrementDisabled}
        aria-label={ariaLabelIncrement}
      >
        Increment
      </button>
    </div>
  );
};

export default Counter;