import React, { useState, useCallback, useMemo } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementBy?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (newCount: number) => void;
  disabled?: boolean;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
  disabled = false,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Validate incrementBy prop
  const validatedIncrementBy = useMemo(() => {
    if (typeof incrementBy !== 'number' || !Number.isFinite(incrementBy) || incrementBy <= 0) {
      console.warn("Invalid 'incrementBy' prop.  Must be a positive finite number.  Using default of 1.");
      return 1;
    }
    return incrementBy;
  }, [incrementBy]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + validatedIncrementBy;
      if (newCount <= max) {
        onCountChange?.(newCount); // Optional callback
        return newCount;
      } else {
        return prevCount; // Don't increment if it exceeds the max
      }
    });
  }, [validatedIncrementBy, max, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - validatedIncrementBy;
      if (newCount >= min) {
        onCountChange?.(newCount); // Optional callback
        return newCount;
      } else {
        return prevCount; // Don't decrement if it goes below the min
      }
    });
  }, [validatedIncrementBy, min, onCountChange]);

  // Handle edge cases for initialCount
  const validatedCount = useMemo(() => {
    if (typeof initialCount !== 'number' || !Number.isFinite(initialCount)) {
      console.warn("Invalid 'initialCount' prop. Must be a finite number. Using default of 0.");
      return 0;
    }

    if (initialCount < min) {
      console.warn("'initialCount' is less than 'min'. Setting count to 'min'.");
      return min;
    }

    if (initialCount > max) {
      console.warn("'initialCount' is greater than 'max'. Setting count to 'max'.");
      return max;
    }

    return initialCount;
  }, [initialCount, min, max]);

  // Initialize count only once using validatedCount
  useState(() => {
    setCount(validatedCount);
  }, [validatedCount]);

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {count}</p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={disabled || count >= max}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={disabled || count <= min}
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
  disabled?: boolean;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
  disabled = false,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Validate incrementBy prop
  const validatedIncrementBy = useMemo(() => {
    if (typeof incrementBy !== 'number' || !Number.isFinite(incrementBy) || incrementBy <= 0) {
      console.warn("Invalid 'incrementBy' prop.  Must be a positive finite number.  Using default of 1.");
      return 1;
    }
    return incrementBy;
  }, [incrementBy]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + validatedIncrementBy;
      if (newCount <= max) {
        onCountChange?.(newCount); // Optional callback
        return newCount;
      } else {
        return prevCount; // Don't increment if it exceeds the max
      }
    });
  }, [validatedIncrementBy, max, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - validatedIncrementBy;
      if (newCount >= min) {
        onCountChange?.(newCount); // Optional callback
        return newCount;
      } else {
        return prevCount; // Don't decrement if it goes below the min
      }
    });
  }, [validatedIncrementBy, min, onCountChange]);

  // Handle edge cases for initialCount
  const validatedCount = useMemo(() => {
    if (typeof initialCount !== 'number' || !Number.isFinite(initialCount)) {
      console.warn("Invalid 'initialCount' prop. Must be a finite number. Using default of 0.");
      return 0;
    }

    if (initialCount < min) {
      console.warn("'initialCount' is less than 'min'. Setting count to 'min'.");
      return min;
    }

    if (initialCount > max) {
      console.warn("'initialCount' is greater than 'max'. Setting count to 'max'.");
      return max;
    }

    return initialCount;
  }, [initialCount, min, max]);

  // Initialize count only once using validatedCount
  useState(() => {
    setCount(validatedCount);
  }, [validatedCount]);

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {count}</p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={disabled || count >= max}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={disabled || count <= min}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;