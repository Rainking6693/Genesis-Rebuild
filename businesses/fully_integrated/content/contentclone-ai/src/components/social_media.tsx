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

  // Memoize incrementStep to prevent unnecessary re-renders if it's derived from props.
  const safeIncrementStep = useMemo(() => {
    if (typeof incrementStep !== 'number' || !Number.isFinite(incrementStep)) {
      console.warn('Invalid incrementStep provided. Using default value of 1.');
      return 1;
    }
    return incrementStep;
  }, [incrementStep]);

  // Memoize min/max to prevent unnecessary re-renders if they're derived from props.
  const safeMin = useMemo(() => {
    if (typeof min !== 'number' || !Number.isFinite(min)) {
      console.warn('Invalid min provided. Using default value of Number.MIN_SAFE_INTEGER.');
      return Number.MIN_SAFE_INTEGER;
    }
    return min;
  }, [min]);

  const safeMax = useMemo(() => {
    if (typeof max !== 'number' || !Number.isFinite(max)) {
      console.warn('Invalid max provided. Using default value of Number.MAX_SAFE_INTEGER.');
      return Number.MAX_SAFE_INTEGER;
    }
    return max;
  }, [max]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount + safeIncrementStep;
      if (nextCount > safeMax) {
        return prevCount; // Or handle differently, e.g., wrap around, throw error
      }
      return nextCount;
    });
  }, [safeIncrementStep, safeMax]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount - safeIncrementStep;
      if (nextCount < safeMin) {
        return prevCount; // Or handle differently, e.g., wrap around, throw error
      }
      return nextCount;
    });
  }, [safeIncrementStep, safeMin]);

  // Handle potential errors during state updates.  This is a more robust approach
  // than simply letting the component crash.
  const handleSetCount = useCallback(
    (newCount: number | ((prevState: number) => number)) => {
      try {
        setCount(newCount);
      } catch (error) {
        console.error('Error updating count:', error);
        // Optionally, display an error message to the user.
      }
    },
    [setCount]
  );

  return (
    <div>
      <p aria-live="polite">Count: {count}</p>
      <button onClick={increment} aria-label={ariaLabelIncrement} disabled={count >= safeMax}>
        Increment
      </button>
      <button onClick={decrement} aria-label={ariaLabelDecrement} disabled={count <= safeMin}>
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

  // Memoize incrementStep to prevent unnecessary re-renders if it's derived from props.
  const safeIncrementStep = useMemo(() => {
    if (typeof incrementStep !== 'number' || !Number.isFinite(incrementStep)) {
      console.warn('Invalid incrementStep provided. Using default value of 1.');
      return 1;
    }
    return incrementStep;
  }, [incrementStep]);

  // Memoize min/max to prevent unnecessary re-renders if they're derived from props.
  const safeMin = useMemo(() => {
    if (typeof min !== 'number' || !Number.isFinite(min)) {
      console.warn('Invalid min provided. Using default value of Number.MIN_SAFE_INTEGER.');
      return Number.MIN_SAFE_INTEGER;
    }
    return min;
  }, [min]);

  const safeMax = useMemo(() => {
    if (typeof max !== 'number' || !Number.isFinite(max)) {
      console.warn('Invalid max provided. Using default value of Number.MAX_SAFE_INTEGER.');
      return Number.MAX_SAFE_INTEGER;
    }
    return max;
  }, [max]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount + safeIncrementStep;
      if (nextCount > safeMax) {
        return prevCount; // Or handle differently, e.g., wrap around, throw error
      }
      return nextCount;
    });
  }, [safeIncrementStep, safeMax]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount - safeIncrementStep;
      if (nextCount < safeMin) {
        return prevCount; // Or handle differently, e.g., wrap around, throw error
      }
      return nextCount;
    });
  }, [safeIncrementStep, safeMin]);

  // Handle potential errors during state updates.  This is a more robust approach
  // than simply letting the component crash.
  const handleSetCount = useCallback(
    (newCount: number | ((prevState: number) => number)) => {
      try {
        setCount(newCount);
      } catch (error) {
        console.error('Error updating count:', error);
        // Optionally, display an error message to the user.
      }
    },
    [setCount]
  );

  return (
    <div>
      <p aria-live="polite">Count: {count}</p>
      <button onClick={increment} aria-label={ariaLabelIncrement} disabled={count >= safeMax}>
        Increment
      </button>
      <button onClick={decrement} aria-label={ariaLabelDecrement} disabled={count <= safeMin}>
        Decrement
      </button>
    </div>
  );
};

export default Counter;