import React, { useState, useCallback, useMemo, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
  /**
   * A unique identifier for the counter.  Useful for accessibility when multiple counters are on the page.
   */
  id?: string;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment counter',
  ariaLabelDecrement = 'Decrement counter',
  onCountChange,
  id,
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const counterId = useMemo(() => id || `counter-${Math.random().toString(36).substring(2, 15)}`, [id]);

  // Validate props on mount and when they change
  useEffect(() => {
    if (typeof initialCount !== 'number' || !Number.isFinite(initialCount)) {
      console.error('Invalid initialCount provided. Must be a finite number.');
    }

    if (typeof min !== 'number' || !Number.isFinite(min)) {
      console.error('Invalid min provided. Must be a finite number.');
    }

    if (typeof max !== 'number' || !Number.isFinite(max)) {
      console.error('Invalid max provided. Must be a finite number.');
    }

    if (min >= max) {
      console.error('Invalid min/max range. Min must be less than max.');
    }

    if (initialCount < min || initialCount > max) {
      console.warn('initialCount is outside the min/max range. Clamping to range.');
      setCount(Math.max(min, Math.min(initialCount, max)));
    }
  }, [initialCount, min, max]);

  // Validate incrementStep
  const validatedIncrementStep = useMemo(() => {
    if (typeof incrementStep !== 'number' || !Number.isFinite(incrementStep) || incrementStep <= 0) {
      console.warn('Invalid incrementStep provided. Using default value of 1.');
      return 1;
    }
    return incrementStep;
  }, [incrementStep]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + validatedIncrementStep;
      if (newCount <= max) {
        onCountChange?.(newCount); // Optional callback
        return newCount;
      } else if (prevCount !== max) {
        // Snap to max if incrementing would exceed it.  This prevents off-by-one errors.
        onCountChange?.(max);
        return max;
      }
      return prevCount; // Prevent exceeding max
    });
  }, [validatedIncrementStep, max, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - validatedIncrementStep;
      if (newCount >= min) {
        onCountChange?.(newCount); // Optional callback
        return newCount;
      } else if (prevCount !== min) {
        // Snap to min if decrementing would go below it. This prevents off-by-one errors.
        onCountChange?.(min);
        return min;
      }
      return prevCount; // Prevent going below min
    });
  }, [validatedIncrementStep, min, onCountChange]);

  const isIncrementDisabled = useMemo(() => count >= max, [count, max]);
  const isDecrementDisabled = useMemo(() => count <= min, [count, min]);

  // Handle edge case where min/max are equal.
  const displayValue = useMemo(() => {
    if (min === max) {
      return min; // Or max, they are the same.
    }
    return count;
  }, [count, min, max]);

  return (
    <div role="group" aria-labelledby={`${counterId}-label`}>
      <p id={`${counterId}-label`} aria-live="polite">
        Count: {displayValue}
      </p>
      <button
        onClick={decrement}
        disabled={isDecrementDisabled}
        aria-label={ariaLabelDecrement}
        aria-describedby={isDecrementDisabled ? `${counterId}-decrement-disabled` : undefined}
      >
        Decrement
      </button>
      {isDecrementDisabled && <span id={`${counterId}-decrement-disabled`} aria-hidden="true">Minimum value reached</span>}
      <button
        onClick={increment}
        disabled={isIncrementDisabled}
        aria-label={ariaLabelIncrement}
        aria-describedby={isIncrementDisabled ? `${counterId}-increment-disabled` : undefined}
      >
        Increment
      </button>
      {isIncrementDisabled && <span id={`${counterId}-increment-disabled`} aria-hidden="true">Maximum value reached</span>}
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useMemo, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
  /**
   * A unique identifier for the counter.  Useful for accessibility when multiple counters are on the page.
   */
  id?: string;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment counter',
  ariaLabelDecrement = 'Decrement counter',
  onCountChange,
  id,
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const counterId = useMemo(() => id || `counter-${Math.random().toString(36).substring(2, 15)}`, [id]);

  // Validate props on mount and when they change
  useEffect(() => {
    if (typeof initialCount !== 'number' || !Number.isFinite(initialCount)) {
      console.error('Invalid initialCount provided. Must be a finite number.');
    }

    if (typeof min !== 'number' || !Number.isFinite(min)) {
      console.error('Invalid min provided. Must be a finite number.');
    }

    if (typeof max !== 'number' || !Number.isFinite(max)) {
      console.error('Invalid max provided. Must be a finite number.');
    }

    if (min >= max) {
      console.error('Invalid min/max range. Min must be less than max.');
    }

    if (initialCount < min || initialCount > max) {
      console.warn('initialCount is outside the min/max range. Clamping to range.');
      setCount(Math.max(min, Math.min(initialCount, max)));
    }
  }, [initialCount, min, max]);

  // Validate incrementStep
  const validatedIncrementStep = useMemo(() => {
    if (typeof incrementStep !== 'number' || !Number.isFinite(incrementStep) || incrementStep <= 0) {
      console.warn('Invalid incrementStep provided. Using default value of 1.');
      return 1;
    }
    return incrementStep;
  }, [incrementStep]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + validatedIncrementStep;
      if (newCount <= max) {
        onCountChange?.(newCount); // Optional callback
        return newCount;
      } else if (prevCount !== max) {
        // Snap to max if incrementing would exceed it.  This prevents off-by-one errors.
        onCountChange?.(max);
        return max;
      }
      return prevCount; // Prevent exceeding max
    });
  }, [validatedIncrementStep, max, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - validatedIncrementStep;
      if (newCount >= min) {
        onCountChange?.(newCount); // Optional callback
        return newCount;
      } else if (prevCount !== min) {
        // Snap to min if decrementing would go below it. This prevents off-by-one errors.
        onCountChange?.(min);
        return min;
      }
      return prevCount; // Prevent going below min
    });
  }, [validatedIncrementStep, min, onCountChange]);

  const isIncrementDisabled = useMemo(() => count >= max, [count, max]);
  const isDecrementDisabled = useMemo(() => count <= min, [count, min]);

  // Handle edge case where min/max are equal.
  const displayValue = useMemo(() => {
    if (min === max) {
      return min; // Or max, they are the same.
    }
    return count;
  }, [count, min, max]);

  return (
    <div role="group" aria-labelledby={`${counterId}-label`}>
      <p id={`${counterId}-label`} aria-live="polite">
        Count: {displayValue}
      </p>
      <button
        onClick={decrement}
        disabled={isDecrementDisabled}
        aria-label={ariaLabelDecrement}
        aria-describedby={isDecrementDisabled ? `${counterId}-decrement-disabled` : undefined}
      >
        Decrement
      </button>
      {isDecrementDisabled && <span id={`${counterId}-decrement-disabled`} aria-hidden="true">Minimum value reached</span>}
      <button
        onClick={increment}
        disabled={isIncrementDisabled}
        aria-label={ariaLabelIncrement}
        aria-describedby={isIncrementDisabled ? `${counterId}-increment-disabled` : undefined}
      >
        Increment
      </button>
      {isIncrementDisabled && <span id={`${counterId}-increment-disabled`} aria-hidden="true">Maximum value reached</span>}
    </div>
  );
};

export default Counter;