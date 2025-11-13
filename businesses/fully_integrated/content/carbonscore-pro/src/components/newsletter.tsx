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

/**
 * A simple counter component with enhanced features.
 *
 * Allows incrementing and decrementing a count value.  The increment and decrement
 * amounts can be customized via the `incrementStep` prop.  Also includes optional
 * min/max values to prevent underflow/overflow, accessibility improvements, and a callback
 * for when the count changes.
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min = 0,
  max,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
}) => {
  const [count, setCount] = useState(initialCount);
  const countRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (countRef.current) {
      countRef.current.focus();
    }
  }, [count]);

  useEffect(() => {
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newValue = Math.min(prevCount + incrementStep, max || Number.MAX_SAFE_INTEGER);
      return newValue;
    });
  }, [incrementStep, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newValue = Math.max(prevCount - incrementStep, min);
      return newValue;
    });
  }, [incrementStep, min]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowUp') {
        increment();
      } else if (event.key === 'ArrowDown') {
        decrement();
      }
    },
    [increment, decrement]
  );

  return (
    <div ref={countRef} role="group" aria-label="Counter" onKeyDown={handleKeyDown} tabIndex={0}>
      <p>Count: {count}</p>
      <button onClick={increment} aria-label={ariaLabelIncrement}>
        Increment
      </button>
      <button onClick={decrement} aria-label={ariaLabelDecrement}>
        Decrement
      </button>
    </div>
  );
};

export default Counter;

Changes made:

1. Set the default min value to 0.
2. Use `Math.min` and `Math.max` to handle edge cases for increment and decrement.
3. Added a focus to the counter when the count changes.
4. Added a nullable ref to handle cases where the component is not mounted yet.
5. Imported `React` from 'react' at the top level to avoid repetition.
6. Added type annotations for props and state variables.