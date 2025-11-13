import React, { useState, useCallback, useMemo } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementBy?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (newCount: number) => void;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Validate props using useMemo to avoid unnecessary re-renders
  const validatedIncrementBy = useMemo(() => {
    if (typeof incrementBy !== 'number' || !Number.isFinite(incrementBy)) {
      console.warn("Invalid 'incrementBy' prop. Using default value of 1.");
      return 1;
    }
    return incrementBy;
  }, [incrementBy]);

  const validatedInitialCount = useMemo(() => {
    if (typeof initialCount !== 'number' || !Number.isFinite(initialCount)) {
      console.warn("Invalid 'initialCount' prop. Using default value of 0.");
      return 0;
    }
    return initialCount;
  }, [initialCount]);

  const validatedMin = useMemo(() => {
    if (typeof min !== 'number' || !Number.isFinite(min)) {
      console.warn("Invalid 'min' prop. Using default value of negative infinity.");
      return Number.NEGATIVE_INFINITY;
    }
    return min;
  }, [min]);

  const validatedMax = useMemo(() => {
    if (typeof max !== 'number' || !Number.isFinite(max)) {
      console.warn("Invalid 'max' prop. Using default value of positive infinity.");
      return Number.POSITIVE_INFINITY;
    }
    return max;
  }, [max]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + validatedIncrementBy;
      if (newCount > validatedMax) {
        return prevCount; // Or handle differently, e.g., wrap around
      }
      if (onCountChange) {
        onCountChange(newCount);
      }
      return newCount;
    });
  }, [validatedIncrementBy, validatedMax, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - validatedIncrementBy;
      if (newCount < validatedMin) {
        return prevCount; // Or handle differently, e.g., wrap around
      }
      if (onCountChange) {
        onCountChange(newCount);
      }
      return newCount;
    });
  }, [validatedIncrementBy, validatedMin, onCountChange]);

  const countString = useMemo(() => String(count), [count]); // Memoize string conversion

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {countString}</p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={count >= validatedMax}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={count <= validatedMin}
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
  onCountChange?: (newCount: number) => void;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Validate props using useMemo to avoid unnecessary re-renders
  const validatedIncrementBy = useMemo(() => {
    if (typeof incrementBy !== 'number' || !Number.isFinite(incrementBy)) {
      console.warn("Invalid 'incrementBy' prop. Using default value of 1.");
      return 1;
    }
    return incrementBy;
  }, [incrementBy]);

  const validatedInitialCount = useMemo(() => {
    if (typeof initialCount !== 'number' || !Number.isFinite(initialCount)) {
      console.warn("Invalid 'initialCount' prop. Using default value of 0.");
      return 0;
    }
    return initialCount;
  }, [initialCount]);

  const validatedMin = useMemo(() => {
    if (typeof min !== 'number' || !Number.isFinite(min)) {
      console.warn("Invalid 'min' prop. Using default value of negative infinity.");
      return Number.NEGATIVE_INFINITY;
    }
    return min;
  }, [min]);

  const validatedMax = useMemo(() => {
    if (typeof max !== 'number' || !Number.isFinite(max)) {
      console.warn("Invalid 'max' prop. Using default value of positive infinity.");
      return Number.POSITIVE_INFINITY;
    }
    return max;
  }, [max]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + validatedIncrementBy;
      if (newCount > validatedMax) {
        return prevCount; // Or handle differently, e.g., wrap around
      }
      if (onCountChange) {
        onCountChange(newCount);
      }
      return newCount;
    });
  }, [validatedIncrementBy, validatedMax, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - validatedIncrementBy;
      if (newCount < validatedMin) {
        return prevCount; // Or handle differently, e.g., wrap around
      }
      if (onCountChange) {
        onCountChange(newCount);
      }
      return newCount;
    });
  }, [validatedIncrementBy, validatedMin, onCountChange]);

  const countString = useMemo(() => String(count), [count]); // Memoize string conversion

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {countString}</p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={count >= validatedMax}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={count <= validatedMin}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;