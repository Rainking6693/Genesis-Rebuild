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
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Memoize incrementStep to prevent unnecessary re-renders if it's a complex calculation
  const safeIncrementStep = useMemo(() => {
    if (typeof incrementStep !== 'number' || !Number.isFinite(incrementStep)) {
      console.warn('Invalid incrementStep provided. Using default value of 1.');
      return 1;
    }
    return incrementStep;
  }, [incrementStep]);

  // Use useCallback to memoize the increment function
  const increment = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount + safeIncrementStep;
      if (nextCount > max) {
        console.warn(`Maximum value reached. Cannot increment beyond ${max}.`);
        return prevCount; // Prevent exceeding the maximum
      }
      return nextCount;
    });
  }, [safeIncrementStep, max]);

  // Use useCallback to memoize the decrement function
  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount - safeIncrementStep;
      if (nextCount < min) {
        console.warn(`Minimum value reached. Cannot decrement below ${min}.`);
        return prevCount; // Prevent exceeding the minimum
      }
      return nextCount;
    });
  }, [safeIncrementStep, min]);

  // Handle potential errors with initialCount, min, and max
  const safeCount = useMemo(() => {
    if (typeof initialCount !== 'number' || !Number.isFinite(initialCount)) {
      console.warn('Invalid initialCount provided. Using default value of 0.');
      return 0;
    }

    if (initialCount < min) {
      console.warn(`initialCount is less than min. Setting count to min: ${min}`);
      return min;
    }

    if (initialCount > max) {
      console.warn(`initialCount is greater than max. Setting count to max: ${max}`);
      return max;
    }

    return initialCount;
  }, [initialCount, min, max]);

  // Initialize count with the safeCount value
  useState(() => {
    setCount(safeCount);
  }, [safeCount]);

  return (
    <div>
      <p aria-live="polite">Count: {count}</p>
      <button onClick={increment} aria-label={ariaLabelIncrement} disabled={count >= max}>
        Increment
      </button>
      <button onClick={decrement} aria-label={ariaLabelDecrement} disabled={count <= min}>
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
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Memoize incrementStep to prevent unnecessary re-renders if it's a complex calculation
  const safeIncrementStep = useMemo(() => {
    if (typeof incrementStep !== 'number' || !Number.isFinite(incrementStep)) {
      console.warn('Invalid incrementStep provided. Using default value of 1.');
      return 1;
    }
    return incrementStep;
  }, [incrementStep]);

  // Use useCallback to memoize the increment function
  const increment = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount + safeIncrementStep;
      if (nextCount > max) {
        console.warn(`Maximum value reached. Cannot increment beyond ${max}.`);
        return prevCount; // Prevent exceeding the maximum
      }
      return nextCount;
    });
  }, [safeIncrementStep, max]);

  // Use useCallback to memoize the decrement function
  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount - safeIncrementStep;
      if (nextCount < min) {
        console.warn(`Minimum value reached. Cannot decrement below ${min}.`);
        return prevCount; // Prevent exceeding the minimum
      }
      return nextCount;
    });
  }, [safeIncrementStep, min]);

  // Handle potential errors with initialCount, min, and max
  const safeCount = useMemo(() => {
    if (typeof initialCount !== 'number' || !Number.isFinite(initialCount)) {
      console.warn('Invalid initialCount provided. Using default value of 0.');
      return 0;
    }

    if (initialCount < min) {
      console.warn(`initialCount is less than min. Setting count to min: ${min}`);
      return min;
    }

    if (initialCount > max) {
      console.warn(`initialCount is greater than max. Setting count to max: ${max}`);
      return max;
    }

    return initialCount;
  }, [initialCount, min, max]);

  // Initialize count with the safeCount value
  useState(() => {
    setCount(safeCount);
  }, [safeCount]);

  return (
    <div>
      <p aria-live="polite">Count: {count}</p>
      <button onClick={increment} aria-label={ariaLabelIncrement} disabled={count >= max}>
        Increment
      </button>
      <button onClick={decrement} aria-label={ariaLabelDecrement} disabled={count <= min}>
        Decrement
      </button>
    </div>
  );
};

export default Counter;