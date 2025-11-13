import React, { useState, useCallback, useRef, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  decrementStep?: number; // Added decrement step
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
  debounceDelay?: number; // Debounce delay in milliseconds
  disableIncrementWhenMaxReached?: boolean; // Option to disable increment button when max is reached
  disableDecrementWhenMinReached?: boolean; // Option to disable decrement button when min is reached
  circular?: boolean; // Option to make the counter circular
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  decrementStep = 1, // Default decrement step
  min = -Infinity,
  max = Infinity,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
  debounceDelay = 200,
  disableIncrementWhenMaxReached = true,
  disableDecrementWhenMinReached = true,
  circular = false,
}) => {
  const [count, setCount] = useState(initialCount);
  const [isIncrementing, setIsIncrementing] = useState(false);
  const [isDecrementing, setIsDecrementing] = useState(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const latestCount = useRef<number>(initialCount); // useRef to hold the latest count for debouncing

  // Update latestCount ref whenever count changes
  useEffect(() => {
    latestCount.current = count;
  }, [count]);

  const safeSetCount = useCallback(
    (newCount: number) => {
      let clampedCount = newCount;

      if (circular) {
        if (newCount > max) {
          clampedCount = min;
        } else if (newCount < min) {
          clampedCount = max;
        }
      } else {
        clampedCount = Math.max(min, Math.min(newCount, max));
      }

      setCount(clampedCount);
      return clampedCount;
    },
    [min, max, circular]
  );

  const increment = useCallback(() => {
    setIsIncrementing(true);
    safeSetCount(prevCount => prevCount + incrementStep);
  }, [incrementStep, safeSetCount]);

  const decrement = useCallback(() => {
    setIsDecrementing(true);
    safeSetCount(prevCount => prevCount - decrementStep);
  }, [decrementStep, safeSetCount]);

  // Debounce the onCountChange callback
  useEffect(() => {
    if (onCountChange) {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }

      timeoutId.current = setTimeout(() => {
        onCountChange(latestCount.current); // Use latestCount.current
      }, debounceDelay);

      return () => {
        if (timeoutId.current) {
          clearTimeout(timeoutId.current);
        }
      };
    }
  }, [onCountChange, debounceDelay]); // Removed count from dependency array

  // Reset incrementing/decrementing state after a short delay
  useEffect(() => {
    if (isIncrementing) {
      const timer = setTimeout(() => setIsIncrementing(false), 100); // Short delay
      return () => clearTimeout(timer);
    }
  }, [isIncrementing]);

  useEffect(() => {
    if (isDecrementing) {
      const timer = setTimeout(() => setIsDecrementing(false), 100); // Short delay
      return () => clearTimeout(timer);
    }
  }, [isDecrementing]);

  const incrementButtonDisabled = disableIncrementWhenMaxReached && count >= max;
  const decrementButtonDisabled = disableDecrementWhenMinReached && count <= min;

  return (
    <div>
      <p aria-live="polite">Count: {count}</p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={incrementButtonDisabled}
        aria-disabled={incrementButtonDisabled}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={decrementButtonDisabled}
        aria-disabled={decrementButtonDisabled}
      >
        Decrement
      </button>
      {isIncrementing && <span aria-live="polite">Incrementing...</span>}
      {isDecrementing && <span aria-live="polite">Decrementing...</span>}
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useRef, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  decrementStep?: number; // Added decrement step
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
  debounceDelay?: number; // Debounce delay in milliseconds
  disableIncrementWhenMaxReached?: boolean; // Option to disable increment button when max is reached
  disableDecrementWhenMinReached?: boolean; // Option to disable decrement button when min is reached
  circular?: boolean; // Option to make the counter circular
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  decrementStep = 1, // Default decrement step
  min = -Infinity,
  max = Infinity,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
  debounceDelay = 200,
  disableIncrementWhenMaxReached = true,
  disableDecrementWhenMinReached = true,
  circular = false,
}) => {
  const [count, setCount] = useState(initialCount);
  const [isIncrementing, setIsIncrementing] = useState(false);
  const [isDecrementing, setIsDecrementing] = useState(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const latestCount = useRef<number>(initialCount); // useRef to hold the latest count for debouncing

  // Update latestCount ref whenever count changes
  useEffect(() => {
    latestCount.current = count;
  }, [count]);

  const safeSetCount = useCallback(
    (newCount: number) => {
      let clampedCount = newCount;

      if (circular) {
        if (newCount > max) {
          clampedCount = min;
        } else if (newCount < min) {
          clampedCount = max;
        }
      } else {
        clampedCount = Math.max(min, Math.min(newCount, max));
      }

      setCount(clampedCount);
      return clampedCount;
    },
    [min, max, circular]
  );

  const increment = useCallback(() => {
    setIsIncrementing(true);
    safeSetCount(prevCount => prevCount + incrementStep);
  }, [incrementStep, safeSetCount]);

  const decrement = useCallback(() => {
    setIsDecrementing(true);
    safeSetCount(prevCount => prevCount - decrementStep);
  }, [decrementStep, safeSetCount]);

  // Debounce the onCountChange callback
  useEffect(() => {
    if (onCountChange) {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }

      timeoutId.current = setTimeout(() => {
        onCountChange(latestCount.current); // Use latestCount.current
      }, debounceDelay);

      return () => {
        if (timeoutId.current) {
          clearTimeout(timeoutId.current);
        }
      };
    }
  }, [onCountChange, debounceDelay]); // Removed count from dependency array

  // Reset incrementing/decrementing state after a short delay
  useEffect(() => {
    if (isIncrementing) {
      const timer = setTimeout(() => setIsIncrementing(false), 100); // Short delay
      return () => clearTimeout(timer);
    }
  }, [isIncrementing]);

  useEffect(() => {
    if (isDecrementing) {
      const timer = setTimeout(() => setIsDecrementing(false), 100); // Short delay
      return () => clearTimeout(timer);
    }
  }, [isDecrementing]);

  const incrementButtonDisabled = disableIncrementWhenMaxReached && count >= max;
  const decrementButtonDisabled = disableDecrementWhenMinReached && count <= min;

  return (
    <div>
      <p aria-live="polite">Count: {count}</p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={incrementButtonDisabled}
        aria-disabled={incrementButtonDisabled}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={decrementButtonDisabled}
        aria-disabled={decrementButtonDisabled}
      >
        Decrement
      </button>
      {isIncrementing && <span aria-live="polite">Incrementing...</span>}
      {isDecrementing && <span aria-live="polite">Decrementing...</span>}
    </div>
  );
};

export default Counter;