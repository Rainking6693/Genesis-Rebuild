import React, { useState, useCallback, useRef, useEffect } from 'react';

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
  const [count, setCount] = useState(initialCount);
  const countRef = useRef(count);

  useEffect(() => {
    countRef.current = count;
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount + incrementStep;
      if (nextCount > max) {
        return prevCount; // Or potentially throw an error/display a message
      }
      return nextCount;
    });
  }, [incrementStep, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount - incrementStep;
      if (nextCount < min) {
        return prevCount; // Or potentially throw an error/display a message
      }
      return nextCount;
    });
  }, [incrementStep, min]);

  const isIncrementDisabled = count >= max;
  const isDecrementDisabled = count <= min;

  return (
    <div>
      <p aria-live="polite">Count: {count}</p>
      <button
        onClick={increment}
        disabled={isIncrementDisabled}
        aria-label={ariaLabelIncrement}
        title={isIncrementDisabled ? `Maximum value reached (${max})` : ariaLabelIncrement}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        disabled={isDecrementDisabled}
        aria-label={ariaLabelDecrement}
        title={isDecrementDisabled ? `Minimum value reached (${min})` : ariaLabelDecrement}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useRef, useEffect } from 'react';

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
  const [count, setCount] = useState(initialCount);
  const countRef = useRef(count);

  useEffect(() => {
    countRef.current = count;
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount + incrementStep;
      if (nextCount > max) {
        return prevCount; // Or potentially throw an error/display a message
      }
      return nextCount;
    });
  }, [incrementStep, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount - incrementStep;
      if (nextCount < min) {
        return prevCount; // Or potentially throw an error/display a message
      }
      return nextCount;
    });
  }, [incrementStep, min]);

  const isIncrementDisabled = count >= max;
  const isDecrementDisabled = count <= min;

  return (
    <div>
      <p aria-live="polite">Count: {count}</p>
      <button
        onClick={increment}
        disabled={isIncrementDisabled}
        aria-label={ariaLabelIncrement}
        title={isIncrementDisabled ? `Maximum value reached (${max})` : ariaLabelIncrement}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        disabled={isDecrementDisabled}
        aria-label={ariaLabelDecrement}
        title={isDecrementDisabled ? `Minimum value reached (${min})` : ariaLabelDecrement}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;