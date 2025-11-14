import React, { useState, useCallback, useRef, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void; // Callback for when the count changes
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
  const countRef = useRef(count); // Use a ref to hold the latest count value

  // Update the ref whenever the count changes
  useEffect(() => {
    countRef.current = count;
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + incrementStep;
      if (newCount <= max) {
        return newCount;
      } else {
        return prevCount; // Prevent incrementing beyond max
      }
    });
  }, [incrementStep, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - incrementStep;
      if (newCount >= min) {
        return newCount;
      } else {
        return prevCount; // Prevent decrementing below min
      }
    });
  }, [incrementStep, min]);

  // Handle keyboard accessibility
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault(); // Prevent scrolling on spacebar
        if (event.currentTarget.ariaLabel === ariaLabelIncrement) {
          increment();
        } else if (event.currentTarget.ariaLabel === ariaLabelDecrement) {
          decrement();
        }
      }
    },
    [increment, decrement, ariaLabelIncrement, ariaLabelDecrement]
  );

  return (
    <div>
      <p aria-live="polite">Count: {count}</p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        onKeyDown={handleKeyDown}
      >
        {ariaLabelIncrement}
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        onKeyDown={handleKeyDown}
      >
        {ariaLabelDecrement}
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
  onCountChange?: (count: number) => void; // Callback for when the count changes
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
  const countRef = useRef(count); // Use a ref to hold the latest count value

  // Update the ref whenever the count changes
  useEffect(() => {
    countRef.current = count;
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + incrementStep;
      if (newCount <= max) {
        return newCount;
      } else {
        return prevCount; // Prevent incrementing beyond max
      }
    });
  }, [incrementStep, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - incrementStep;
      if (newCount >= min) {
        return newCount;
      } else {
        return prevCount; // Prevent decrementing below min
      }
    });
  }, [incrementStep, min]);

  // Handle keyboard accessibility
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault(); // Prevent scrolling on spacebar
        if (event.currentTarget.ariaLabel === ariaLabelIncrement) {
          increment();
        } else if (event.currentTarget.ariaLabel === ariaLabelDecrement) {
          decrement();
        }
      }
    },
    [increment, decrement, ariaLabelIncrement, ariaLabelDecrement]
  );

  return (
    <div>
      <p aria-live="polite">Count: {count}</p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        onKeyDown={handleKeyDown}
      >
        {ariaLabelIncrement}
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        onKeyDown={handleKeyDown}
      >
        {ariaLabelDecrement}
      </button>
    </div>
  );
};

export default Counter;