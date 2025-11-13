import React, { useState, useCallback, useMemo } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementBy?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Use useMemo to prevent unnecessary re-renders if incrementBy doesn't change
  const validatedIncrementBy = useMemo(() => {
    if (typeof incrementBy !== 'number' || !Number.isFinite(incrementBy)) {
      console.warn('Invalid incrementBy value. Using default value of 1.');
      return 1;
    }
    return incrementBy;
  }, [incrementBy]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + validatedIncrementBy;
      if (newCount > max) {
        return prevCount; // Or handle max limit differently, e.g., throw error, display message
      }
      onCountChange?.(newCount);
      return newCount;
    });
  }, [validatedIncrementBy, max, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - validatedIncrementBy;
      if (newCount < min) {
        return prevCount; // Or handle min limit differently
      }
      onCountChange?.(newCount);
      return newCount;
    });
  }, [validatedIncrementBy, min, onCountChange]);

  // Handle potential errors with initialCount, min, and max
  const validatedInitialCount = useMemo(() => {
    if (typeof initialCount !== 'number' || !Number.isFinite(initialCount)) {
      console.warn('Invalid initialCount value. Using default value of 0.');
      return 0;
    }
    return Math.max(min, Math.min(max, initialCount)); // Ensure initialCount is within min/max bounds
  }, [initialCount, min, max]);

  const validatedMin = useMemo(() => {
    if (typeof min !== 'number' || !Number.isFinite(min)) {
      console.warn('Invalid min value. Using default value of Number.MIN_SAFE_INTEGER.');
      return Number.MIN_SAFE_INTEGER;
    }
    return min;
  }, [min]);

  const validatedMax = useMemo(() => {
    if (typeof max !== 'number' || !Number.isFinite(max)) {
      console.warn('Invalid max value. Using default value of Number.MAX_SAFE_INTEGER.');
      return Number.MAX_SAFE_INTEGER;
    }
    return max;
  }, [max]);

  return (
    <div>
      <p aria-live="polite">Count: {count}</p>
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
  onCountChange?: (count: number) => void;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Use useMemo to prevent unnecessary re-renders if incrementBy doesn't change
  const validatedIncrementBy = useMemo(() => {
    if (typeof incrementBy !== 'number' || !Number.isFinite(incrementBy)) {
      console.warn('Invalid incrementBy value. Using default value of 1.');
      return 1;
    }
    return incrementBy;
  }, [incrementBy]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + validatedIncrementBy;
      if (newCount > max) {
        return prevCount; // Or handle max limit differently, e.g., throw error, display message
      }
      onCountChange?.(newCount);
      return newCount;
    });
  }, [validatedIncrementBy, max, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - validatedIncrementBy;
      if (newCount < min) {
        return prevCount; // Or handle min limit differently
      }
      onCountChange?.(newCount);
      return newCount;
    });
  }, [validatedIncrementBy, min, onCountChange]);

  // Handle potential errors with initialCount, min, and max
  const validatedInitialCount = useMemo(() => {
    if (typeof initialCount !== 'number' || !Number.isFinite(initialCount)) {
      console.warn('Invalid initialCount value. Using default value of 0.');
      return 0;
    }
    return Math.max(min, Math.min(max, initialCount)); // Ensure initialCount is within min/max bounds
  }, [initialCount, min, max]);

  const validatedMin = useMemo(() => {
    if (typeof min !== 'number' || !Number.isFinite(min)) {
      console.warn('Invalid min value. Using default value of Number.MIN_SAFE_INTEGER.');
      return Number.MIN_SAFE_INTEGER;
    }
    return min;
  }, [min]);

  const validatedMax = useMemo(() => {
    if (typeof max !== 'number' || !Number.isFinite(max)) {
      console.warn('Invalid max value. Using default value of Number.MAX_SAFE_INTEGER.');
      return Number.MAX_SAFE_INTEGER;
    }
    return max;
  }, [max]);

  return (
    <div>
      <p aria-live="polite">Count: {count}</p>
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