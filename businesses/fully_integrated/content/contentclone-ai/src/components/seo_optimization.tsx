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

  // Use useMemo to prevent unnecessary re-renders if min/max are complex calculations
  const validatedMin = useMemo(() => min ?? Number.NEGATIVE_INFINITY, [min]);
  const validatedMax = useMemo(() => max ?? Number.POSITIVE_INFINITY, [max]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newValue = prevCount + incrementStep;
      return newValue <= validatedMax ? newValue : prevCount; // Prevent exceeding max
    });
  }, [incrementStep, validatedMax]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newValue = prevCount - incrementStep;
      return newValue >= validatedMin ? newValue : prevCount; // Prevent going below min
    });
  }, [incrementStep, validatedMin]);

  // Handle edge case where initialCount is outside the min/max range
  const displayCount = useMemo(() => {
    if (initialCount < validatedMin) {
      return validatedMin;
    }
    if (initialCount > validatedMax) {
      return validatedMax;
    }
    return count;
  }, [count, initialCount, validatedMin, validatedMax]);

  const isIncrementDisabled = useMemo(() => count >= validatedMax, [count, validatedMax]);
  const isDecrementDisabled = useMemo(() => count <= validatedMin, [count, validatedMin]);

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {displayCount}</p>
      <button
        onClick={decrement}
        disabled={isDecrementDisabled}
        aria-label={ariaLabelDecrement}
        title={isDecrementDisabled ? `Minimum value reached` : `Decrement by ${incrementStep}`}
      >
        Decrement
      </button>
      <button
        onClick={increment}
        disabled={isIncrementDisabled}
        aria-label={ariaLabelIncrement}
        title={isIncrementDisabled ? `Maximum value reached` : `Increment by ${incrementStep}`}
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

  // Use useMemo to prevent unnecessary re-renders if min/max are complex calculations
  const validatedMin = useMemo(() => min ?? Number.NEGATIVE_INFINITY, [min]);
  const validatedMax = useMemo(() => max ?? Number.POSITIVE_INFINITY, [max]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newValue = prevCount + incrementStep;
      return newValue <= validatedMax ? newValue : prevCount; // Prevent exceeding max
    });
  }, [incrementStep, validatedMax]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newValue = prevCount - incrementStep;
      return newValue >= validatedMin ? newValue : prevCount; // Prevent going below min
    });
  }, [incrementStep, validatedMin]);

  // Handle edge case where initialCount is outside the min/max range
  const displayCount = useMemo(() => {
    if (initialCount < validatedMin) {
      return validatedMin;
    }
    if (initialCount > validatedMax) {
      return validatedMax;
    }
    return count;
  }, [count, initialCount, validatedMin, validatedMax]);

  const isIncrementDisabled = useMemo(() => count >= validatedMax, [count, validatedMax]);
  const isDecrementDisabled = useMemo(() => count <= validatedMin, [count, validatedMin]);

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {displayCount}</p>
      <button
        onClick={decrement}
        disabled={isDecrementDisabled}
        aria-label={ariaLabelDecrement}
        title={isDecrementDisabled ? `Minimum value reached` : `Decrement by ${incrementStep}`}
      >
        Decrement
      </button>
      <button
        onClick={increment}
        disabled={isIncrementDisabled}
        aria-label={ariaLabelIncrement}
        title={isIncrementDisabled ? `Maximum value reached` : `Increment by ${incrementStep}`}
      >
        Increment
      </button>
    </div>
  );
};

export default Counter;