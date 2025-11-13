import React, { useState, useCallback, useMemo } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementBy?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  className?: string;
  onCountChange?: (newCount: number) => void;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  className = '',
  onCountChange,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Validate props using useMemo to avoid unnecessary recalculations
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
      if (newCount <= validatedMax) {
        onCountChange?.(newCount); // Optional callback
        return newCount;
      } else {
        console.warn('Maximum value reached.');
        return prevCount; // Prevent incrementing beyond max
      }
    });
  }, [validatedIncrementBy, validatedMax, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - validatedIncrementBy;
      if (newCount >= validatedMin) {
        onCountChange?.(newCount); // Optional callback
        return newCount;
      } else {
        console.warn('Minimum value reached.');
        return prevCount; // Prevent decrementing below min
      }
    });
  }, [validatedIncrementBy, validatedMin, onCountChange]);

  const isIncrementDisabled = useMemo(() => count >= validatedMax, [count, validatedMax]);
  const isDecrementDisabled = useMemo(() => count <= validatedMin, [count, validatedMin]);

  return (
    <div className={`counter-container ${className}`}>
      <p aria-live="polite">Count: {count}</p>
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
  incrementBy?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  className?: string;
  onCountChange?: (newCount: number) => void;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  className = '',
  onCountChange,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Validate props using useMemo to avoid unnecessary recalculations
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
      if (newCount <= validatedMax) {
        onCountChange?.(newCount); // Optional callback
        return newCount;
      } else {
        console.warn('Maximum value reached.');
        return prevCount; // Prevent incrementing beyond max
      }
    });
  }, [validatedIncrementBy, validatedMax, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - validatedIncrementBy;
      if (newCount >= validatedMin) {
        onCountChange?.(newCount); // Optional callback
        return newCount;
      } else {
        console.warn('Minimum value reached.');
        return prevCount; // Prevent decrementing below min
      }
    });
  }, [validatedIncrementBy, validatedMin, onCountChange]);

  const isIncrementDisabled = useMemo(() => count >= validatedMax, [count, validatedMax]);
  const isDecrementDisabled = useMemo(() => count <= validatedMin, [count, validatedMin]);

  return (
    <div className={`counter-container ${className}`}>
      <p aria-live="polite">Count: {count}</p>
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