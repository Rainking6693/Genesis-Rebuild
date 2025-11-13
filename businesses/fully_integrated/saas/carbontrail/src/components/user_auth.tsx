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

  // Memoize incrementStep to prevent unnecessary re-renders if it's a complex calculation.
  const safeIncrementStep = useMemo(() => {
    if (typeof incrementStep !== 'number' || isNaN(incrementStep)) {
      console.warn("Invalid incrementStep provided. Using default value of 1.");
      return 1;
    }
    return incrementStep;
  }, [incrementStep]);

  // Use useCallback to memoize the increment function.
  const increment = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount + safeIncrementStep;
      return nextCount <= max ? nextCount : prevCount; // Prevent exceeding max
    });
  }, [safeIncrementStep, max]);

  // Use useCallback to memoize the decrement function.
  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount - safeIncrementStep;
      return nextCount >= min ? nextCount : prevCount; // Prevent going below min
    });
  }, [safeIncrementStep, min]);

  // Handle potential errors with initialCount, min, and max
  const safeCount = useMemo(() => {
    if (typeof initialCount !== 'number' || isNaN(initialCount)) {
      console.warn("Invalid initialCount provided. Using default value of 0.");
      return 0;
    }

    if (initialCount < min) {
      console.warn("initialCount is less than min. Using min value.");
      return min;
    }

    if (initialCount > max) {
      console.warn("initialCount is greater than max. Using max value.");
      return max;
    }

    return initialCount;
  }, [initialCount, min, max]);

  const safeMin = useMemo(() => {
    if (typeof min !== 'number' || isNaN(min)) {
      console.warn("Invalid min provided. Using default value of negative infinity.");
      return Number.NEGATIVE_INFINITY;
    }
    return min;
  }, [min]);

  const safeMax = useMemo(() => {
    if (typeof max !== 'number' || isNaN(max)) {
      console.warn("Invalid max provided. Using default value of positive infinity.");
      return Number.POSITIVE_INFINITY;
    }
    return max;
  }, [max]);

  return (
    <div role="group" aria-label="Counter">
      <p>Count: {count}</p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={count >= safeMax}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={count <= safeMin}
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

  // Memoize incrementStep to prevent unnecessary re-renders if it's a complex calculation.
  const safeIncrementStep = useMemo(() => {
    if (typeof incrementStep !== 'number' || isNaN(incrementStep)) {
      console.warn("Invalid incrementStep provided. Using default value of 1.");
      return 1;
    }
    return incrementStep;
  }, [incrementStep]);

  // Use useCallback to memoize the increment function.
  const increment = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount + safeIncrementStep;
      return nextCount <= max ? nextCount : prevCount; // Prevent exceeding max
    });
  }, [safeIncrementStep, max]);

  // Use useCallback to memoize the decrement function.
  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount - safeIncrementStep;
      return nextCount >= min ? nextCount : prevCount; // Prevent going below min
    });
  }, [safeIncrementStep, min]);

  // Handle potential errors with initialCount, min, and max
  const safeCount = useMemo(() => {
    if (typeof initialCount !== 'number' || isNaN(initialCount)) {
      console.warn("Invalid initialCount provided. Using default value of 0.");
      return 0;
    }

    if (initialCount < min) {
      console.warn("initialCount is less than min. Using min value.");
      return min;
    }

    if (initialCount > max) {
      console.warn("initialCount is greater than max. Using max value.");
      return max;
    }

    return initialCount;
  }, [initialCount, min, max]);

  const safeMin = useMemo(() => {
    if (typeof min !== 'number' || isNaN(min)) {
      console.warn("Invalid min provided. Using default value of negative infinity.");
      return Number.NEGATIVE_INFINITY;
    }
    return min;
  }, [min]);

  const safeMax = useMemo(() => {
    if (typeof max !== 'number' || isNaN(max)) {
      console.warn("Invalid max provided. Using default value of positive infinity.");
      return Number.POSITIVE_INFINITY;
    }
    return max;
  }, [max]);

  return (
    <div role="group" aria-label="Counter">
      <p>Count: {count}</p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={count >= safeMax}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={count <= safeMin}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;