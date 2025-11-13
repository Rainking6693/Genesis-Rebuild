import React, { useState, useCallback, useMemo } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Validate incrementStep on component mount/update
  useMemo(() => {
    if (typeof incrementStep !== 'number' || !Number.isFinite(incrementStep) || incrementStep <= 0) {
      console.error('Invalid incrementStep provided. Must be a positive finite number.');
      return; // Or throw an error if you prefer
    }
  }, [incrementStep]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + incrementStep;
      if (newCount > max) {
        return prevCount; // Or Math.min(newCount, max) if you want to clamp
      }
      if (onCountChange) {
        onCountChange(newCount);
      }
      return newCount;
    });
  }, [incrementStep, max, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - incrementStep;
      if (newCount < min) {
        return prevCount; // Or Math.max(newCount, min) if you want to clamp
      }
      if (onCountChange) {
        onCountChange(newCount);
      }
      return newCount;
    });
  }, [incrementStep, min, onCountChange]);

  const isIncrementDisabled = useMemo(() => count >= max, [count, max]);
  const isDecrementDisabled = useMemo(() => count <= min, [count, min]);

  return (
    <div role="group" aria-label="Counter">
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
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Validate incrementStep on component mount/update
  useMemo(() => {
    if (typeof incrementStep !== 'number' || !Number.isFinite(incrementStep) || incrementStep <= 0) {
      console.error('Invalid incrementStep provided. Must be a positive finite number.');
      return; // Or throw an error if you prefer
    }
  }, [incrementStep]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + incrementStep;
      if (newCount > max) {
        return prevCount; // Or Math.min(newCount, max) if you want to clamp
      }
      if (onCountChange) {
        onCountChange(newCount);
      }
      return newCount;
    });
  }, [incrementStep, max, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - incrementStep;
      if (newCount < min) {
        return prevCount; // Or Math.max(newCount, min) if you want to clamp
      }
      if (onCountChange) {
        onCountChange(newCount);
      }
      return newCount;
    });
  }, [incrementStep, min, onCountChange]);

  const isIncrementDisabled = useMemo(() => count >= max, [count, max]);
  const isDecrementDisabled = useMemo(() => count <= min, [count, min]);

  return (
    <div role="group" aria-label="Counter">
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