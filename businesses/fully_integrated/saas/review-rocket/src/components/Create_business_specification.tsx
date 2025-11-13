import React, { useState, useCallback } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  minCount?: number;
  maxCount?: number;
}

/**
 * A simple counter component with increment and decrement functionality.
 *
 * @param {CounterProps} props - The component's props.
 * @param {number} props.initialCount - The initial value of the counter (default: 0).
 * @param {number} props.incrementStep - The amount to increment/decrement by (default: 1). Must be greater than zero.
 * @param {number} props.minCount - The minimum value of the counter (default: undefined).
 * @param {number} props.maxCount - The maximum value of the counter (default: undefined).
 * @returns {JSX.Element} - The rendered counter component.
 */
const Counter: React.FC<CounterProps> = ({ initialCount = 0, incrementStep = 1, minCount = undefined, maxCount = undefined }) => {
  const [count, setCount] = useState(initialCount);

  // Ensure incrementStep is greater than zero
  if (incrementStep <= 0) {
    throw new Error('incrementStep must be greater than zero');
  }

  // Use useCallback to memoize the increment function, preventing unnecessary re-renders.
  const increment = useCallback(() => {
    if (count < maxCount) {
      setCount((prevCount) => Math.min(prevCount + incrementStep, maxCount || Infinity));
    }
  }, [count, incrementStep, maxCount]); // Dependency array includes incrementStep and maxCount

  // Use useCallback to memoize the decrement function, preventing unnecessary re-renders.
  const decrement = useCallback(() => {
    if (count > minCount) {
      setCount((prevCount) => Math.max(prevCount - incrementStep, minCount || 0));
    }
  }, [count, incrementStep, minCount]); // Dependency array includes incrementStep and minCount

  // Add screen reader message for the counter value
  const counterValueId = 'counter-value';
  const counterValue = count.toString();

  return (
    <div>
      <p>Count: {counterValue}</p>
      <button onClick={increment} aria-label={`Increment to ${counterValue + incrementStep}`}>Increment</button>
      <button onClick={decrement} aria-label={`Decrement to ${counterValue - incrementStep}`}>Decrement</button>
      <span id={counterValueId} hidden>Current count: {counterValue}</span>
    </div>
  );
};

export default Counter;

import React, { useState, useCallback } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  minCount?: number;
  maxCount?: number;
}

/**
 * A simple counter component with increment and decrement functionality.
 *
 * @param {CounterProps} props - The component's props.
 * @param {number} props.initialCount - The initial value of the counter (default: 0).
 * @param {number} props.incrementStep - The amount to increment/decrement by (default: 1). Must be greater than zero.
 * @param {number} props.minCount - The minimum value of the counter (default: undefined).
 * @param {number} props.maxCount - The maximum value of the counter (default: undefined).
 * @returns {JSX.Element} - The rendered counter component.
 */
const Counter: React.FC<CounterProps> = ({ initialCount = 0, incrementStep = 1, minCount = undefined, maxCount = undefined }) => {
  const [count, setCount] = useState(initialCount);

  // Ensure incrementStep is greater than zero
  if (incrementStep <= 0) {
    throw new Error('incrementStep must be greater than zero');
  }

  // Use useCallback to memoize the increment function, preventing unnecessary re-renders.
  const increment = useCallback(() => {
    if (count < maxCount) {
      setCount((prevCount) => Math.min(prevCount + incrementStep, maxCount || Infinity));
    }
  }, [count, incrementStep, maxCount]); // Dependency array includes incrementStep and maxCount

  // Use useCallback to memoize the decrement function, preventing unnecessary re-renders.
  const decrement = useCallback(() => {
    if (count > minCount) {
      setCount((prevCount) => Math.max(prevCount - incrementStep, minCount || 0));
    }
  }, [count, incrementStep, minCount]); // Dependency array includes incrementStep and minCount

  // Add screen reader message for the counter value
  const counterValueId = 'counter-value';
  const counterValue = count.toString();

  return (
    <div>
      <p>Count: {counterValue}</p>
      <button onClick={increment} aria-label={`Increment to ${counterValue + incrementStep}`}>Increment</button>
      <button onClick={decrement} aria-label={`Decrement to ${counterValue - incrementStep}`}>Decrement</button>
      <span id={counterValueId} hidden>Current count: {counterValue}</span>
    </div>
  );
};

export default Counter;