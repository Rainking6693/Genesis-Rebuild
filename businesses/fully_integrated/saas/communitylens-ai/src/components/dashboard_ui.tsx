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
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
}) => {
  const [count, setCount] = useState<number>(initialCount);

  const isValidStep = useMemo(() => {
    return typeof incrementStep === 'number' && !isNaN(incrementStep) && incrementStep > 0;
  }, [incrementStep]);

  const increment = useCallback(() => {
    if (!isValidStep) {
      console.error('Invalid incrementStep provided. Must be a positive number.');
      return;
    }

    setCount((prevCount) => {
      const nextCount = prevCount + incrementStep;
      return nextCount <= max ? nextCount : prevCount;
    });
  }, [incrementStep, max, isValidStep]);

  const decrement = useCallback(() => {
    if (!isValidStep) {
      console.error('Invalid incrementStep provided. Must be a positive number.');
      return;
    }

    setCount((prevCount) => {
      const nextCount = prevCount - incrementStep;
      return nextCount >= min ? nextCount : prevCount;
    });
  }, [incrementStep, min, isValidStep]);

  const countDisplay = useMemo(() => {
    if (count > max) {
      return max;
    }
    if (count < min) {
      return min;
    }
    return count;
  }, [count, min, max]);

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {countDisplay}</p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={count >= max}
      >
        Increment
      </button>
      <button
        onClick={decrement}
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
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
}) => {
  const [count, setCount] = useState<number>(initialCount);

  const isValidStep = useMemo(() => {
    return typeof incrementStep === 'number' && !isNaN(incrementStep) && incrementStep > 0;
  }, [incrementStep]);

  const increment = useCallback(() => {
    if (!isValidStep) {
      console.error('Invalid incrementStep provided. Must be a positive number.');
      return;
    }

    setCount((prevCount) => {
      const nextCount = prevCount + incrementStep;
      return nextCount <= max ? nextCount : prevCount;
    });
  }, [incrementStep, max, isValidStep]);

  const decrement = useCallback(() => {
    if (!isValidStep) {
      console.error('Invalid incrementStep provided. Must be a positive number.');
      return;
    }

    setCount((prevCount) => {
      const nextCount = prevCount - incrementStep;
      return nextCount >= min ? nextCount : prevCount;
    });
  }, [incrementStep, min, isValidStep]);

  const countDisplay = useMemo(() => {
    if (count > max) {
      return max;
    }
    if (count < min) {
      return min;
    }
    return count;
  }, [count, min, max]);

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {countDisplay}</p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={count >= max}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={count <= min}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;