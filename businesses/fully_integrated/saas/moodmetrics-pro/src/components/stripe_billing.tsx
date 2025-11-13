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

  // Use useMemo to prevent unnecessary recalculations
  const incrementValue = useMemo(() => Math.abs(incrementBy), [incrementBy]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newValue = prevCount + incrementValue;
      if (newValue > max) {
        return prevCount; // Or handle the overflow differently, e.g., wrap around
      }
      onCountChange?.(newValue);
      return newValue;
    });
  }, [incrementValue, max, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newValue = prevCount - incrementValue;
      if (newValue < min) {
        return prevCount; // Or handle the underflow differently, e.g., wrap around
      }
      onCountChange?.(newValue);
      return newValue;
    });
  }, [incrementValue, min, onCountChange]);

  // Handle potential errors during increment/decrement
  const handleIncrementClick = useCallback(() => {
    try {
      increment();
    } catch (error) {
      console.error('Error during increment:', error);
      // Optionally display an error message to the user
    }
  }, [increment]);

  const handleDecrementClick = useCallback(() => {
    try {
      decrement();
    } catch (error) {
      console.error('Error during decrement:', error);
      // Optionally display an error message to the user
    }
  }, [decrement]);

  const countDisplay = useMemo(() => {
    if (count < min) {
      return min;
    }
    if (count > max) {
      return max;
    }
    return count;
  }, [count, min, max]);

  return (
    <div role="group" aria-label="Counter">
      <p>Count: {countDisplay}</p>
      <button
        onClick={handleIncrementClick}
        aria-label={ariaLabelIncrement}
        disabled={count >= max}
      >
        Increment
      </button>
      <button
        onClick={handleDecrementClick}
        aria-label={ariaLabelDecrement}
        disabled={count <= min}
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

  // Use useMemo to prevent unnecessary recalculations
  const incrementValue = useMemo(() => Math.abs(incrementBy), [incrementBy]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newValue = prevCount + incrementValue;
      if (newValue > max) {
        return prevCount; // Or handle the overflow differently, e.g., wrap around
      }
      onCountChange?.(newValue);
      return newValue;
    });
  }, [incrementValue, max, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newValue = prevCount - incrementValue;
      if (newValue < min) {
        return prevCount; // Or handle the underflow differently, e.g., wrap around
      }
      onCountChange?.(newValue);
      return newValue;
    });
  }, [incrementValue, min, onCountChange]);

  // Handle potential errors during increment/decrement
  const handleIncrementClick = useCallback(() => {
    try {
      increment();
    } catch (error) {
      console.error('Error during increment:', error);
      // Optionally display an error message to the user
    }
  }, [increment]);

  const handleDecrementClick = useCallback(() => {
    try {
      decrement();
    } catch (error) {
      console.error('Error during decrement:', error);
      // Optionally display an error message to the user
    }
  }, [decrement]);

  const countDisplay = useMemo(() => {
    if (count < min) {
      return min;
    }
    if (count > max) {
      return max;
    }
    return count;
  }, [count, min, max]);

  return (
    <div role="group" aria-label="Counter">
      <p>Count: {countDisplay}</p>
      <button
        onClick={handleIncrementClick}
        aria-label={ariaLabelIncrement}
        disabled={count >= max}
      >
        Increment
      </button>
      <button
        onClick={handleDecrementClick}
        aria-label={ariaLabelDecrement}
        disabled={count <= min}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;