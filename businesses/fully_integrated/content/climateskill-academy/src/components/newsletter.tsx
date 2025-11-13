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
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
}) => {
  const [count, setCount] = useState(initialCount);
  const countRef = useRef(initialCount); // useRef to hold the latest count value

  // Use useCallback to memoize the increment and decrement functions
  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + incrementStep;
      if (newCount <= max) {
        countRef.current = newCount; // Update the ref
        return newCount;
      } else {
        return prevCount; // Prevent exceeding the max value
      }
    });
  }, [incrementStep, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - incrementStep;
      if (newCount >= min) {
        countRef.current = newCount; // Update the ref
        return newCount;
      } else {
        return prevCount; // Prevent going below the min value
      }
    });
  }, [incrementStep, min]);

  // useEffect to trigger the onCountChange callback whenever the count changes
  useEffect(() => {
    if (onCountChange && countRef.current !== initialCount) {
      onCountChange(countRef.current);
    }
  }, [count, onCountChange, initialCount]);

  // Handle potential errors with incrementStep being zero or non-numeric
  if (typeof incrementStep !== 'number' || isNaN(incrementStep)) {
    return (
      <div>
        <p>Error: Invalid incrementStep value.</p>
      </div>
    );
  }

  if (incrementStep === 0) {
    return (
      <div>
        <p>Count: {count}</p>
        <p>Warning: incrementStep is zero. Increment and decrement buttons will have no effect.</p>
      </div>
    );
  }

  return (
    <div>
      <p aria-live="polite">Count: {count}</p> {/* aria-live for accessibility */}
      <button onClick={increment} aria-label={ariaLabelIncrement} disabled={count >= max}>
        Increment
      </button>
      <button onClick={decrement} aria-label={ariaLabelDecrement} disabled={count <= min}>
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
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
}) => {
  const [count, setCount] = useState(initialCount);
  const countRef = useRef(initialCount); // useRef to hold the latest count value

  // Use useCallback to memoize the increment and decrement functions
  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + incrementStep;
      if (newCount <= max) {
        countRef.current = newCount; // Update the ref
        return newCount;
      } else {
        return prevCount; // Prevent exceeding the max value
      }
    });
  }, [incrementStep, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - incrementStep;
      if (newCount >= min) {
        countRef.current = newCount; // Update the ref
        return newCount;
      } else {
        return prevCount; // Prevent going below the min value
      }
    });
  }, [incrementStep, min]);

  // useEffect to trigger the onCountChange callback whenever the count changes
  useEffect(() => {
    if (onCountChange && countRef.current !== initialCount) {
      onCountChange(countRef.current);
    }
  }, [count, onCountChange, initialCount]);

  // Handle potential errors with incrementStep being zero or non-numeric
  if (typeof incrementStep !== 'number' || isNaN(incrementStep)) {
    return (
      <div>
        <p>Error: Invalid incrementStep value.</p>
      </div>
    );
  }

  if (incrementStep === 0) {
    return (
      <div>
        <p>Count: {count}</p>
        <p>Warning: incrementStep is zero. Increment and decrement buttons will have no effect.</p>
      </div>
    );
  }

  return (
    <div>
      <p aria-live="polite">Count: {count}</p> {/* aria-live for accessibility */}
      <button onClick={increment} aria-label={ariaLabelIncrement} disabled={count >= max}>
        Increment
      </button>
      <button onClick={decrement} aria-label={ariaLabelDecrement} disabled={count <= min}>
        Decrement
      </button>
    </div>
  );
};

export default Counter;