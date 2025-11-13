import React, { useState, useCallback, useMemo } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementBy?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  disabled?: boolean;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  disabled = false,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Use useMemo to calculate if increment/decrement buttons should be disabled
  const incrementDisabled = useMemo(() => disabled || count >= max, [count, max, disabled]);
  const decrementDisabled = useMemo(() => disabled || count <= min, [count, min, disabled]);

  // Use useCallback to memoize the increment function
  const increment = useCallback(() => {
    if (!incrementDisabled) {
      setCount((prevCount) => Math.min(prevCount + incrementBy, max));
    }
  }, [incrementBy, max, incrementDisabled]);

  // Use useCallback to memoize the decrement function
  const decrement = useCallback(() => {
    if (!decrementDisabled) {
      setCount((prevCount) => Math.max(prevCount - incrementBy, min));
    }
  }, [incrementBy, min, decrementDisabled]);

  // Format the count for display (e.g., with commas)
  const formattedCount = useMemo(() => {
    return count.toLocaleString();
  }, [count]);

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {formattedCount}</p>
      <button
        onClick={increment}
        disabled={incrementDisabled}
        aria-label={ariaLabelIncrement}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        disabled={decrementDisabled}
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
  incrementBy?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  disabled?: boolean;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  disabled = false,
}) => {
  const [count, setCount] = useState<number>(initialCount);

  // Use useMemo to calculate if increment/decrement buttons should be disabled
  const incrementDisabled = useMemo(() => disabled || count >= max, [count, max, disabled]);
  const decrementDisabled = useMemo(() => disabled || count <= min, [count, min, disabled]);

  // Use useCallback to memoize the increment function
  const increment = useCallback(() => {
    if (!incrementDisabled) {
      setCount((prevCount) => Math.min(prevCount + incrementBy, max));
    }
  }, [incrementBy, max, incrementDisabled]);

  // Use useCallback to memoize the decrement function
  const decrement = useCallback(() => {
    if (!decrementDisabled) {
      setCount((prevCount) => Math.max(prevCount - incrementBy, min));
    }
  }, [incrementBy, min, decrementDisabled]);

  // Format the count for display (e.g., with commas)
  const formattedCount = useMemo(() => {
    return count.toLocaleString();
  }, [count]);

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {formattedCount}</p>
      <button
        onClick={increment}
        disabled={incrementDisabled}
        aria-label={ariaLabelIncrement}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        disabled={decrementDisabled}
        aria-label={ariaLabelDecrement}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;