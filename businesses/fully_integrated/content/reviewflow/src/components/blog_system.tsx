import React, { useState, useCallback, useEffect, useRef } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  decrementStep?: number; // Added decrementStep for flexibility
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
  disabled?: boolean; // Added disabled prop
  errorTimeout?: number; // Added error timeout prop
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  decrementStep = 1, // Default decrement step
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
  disabled = false, // Default disabled state
  errorTimeout = 3000, // Default error timeout
}) => {
  const [count, setCount] = useState(initialCount);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null); // Ref for timeout

  // Validate props on initial render
  useEffect(() => {
    if (min > max) {
      console.error("Counter: min prop should be less than or equal to max prop.");
    }
    if (typeof incrementStep !== 'number' || incrementStep <= 0) {
      console.error("Counter: incrementStep prop should be a positive number.");
    }
    if (typeof decrementStep !== 'number' || decrementStep <= 0) {
      console.error("Counter: decrementStep prop should be a positive number.");
    }
  }, [min, max, incrementStep, decrementStep]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (timeoutId.current) {
        clearTimeout(timeoutId.current); // Clear timeout on unmount
      }
    };
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      let newCount = count;
      let newError: string | null = null;

      if (count < min) {
        newError = `Minimum value is ${min}`;
        newCount = min;
      } else if (count > max) {
        newError = `Maximum value is ${max}`;
        newCount = max;
      }

      if (newError) {
        setError(newError);
        if (timeoutId.current) {
          clearTimeout(timeoutId.current); // Clear any existing timeout
        }
        timeoutId.current = setTimeout(() => {
          setError(null); // Clear error after timeout
        }, errorTimeout);
      } else {
        setError(null);
      }

      if (newCount !== count) {
        setCount(newCount); // Update count if it was adjusted
      }

      if (onCountChange) {
        onCountChange(newCount); // Use the potentially adjusted newCount
      }
    }
  }, [count, max, min, onCountChange, errorTimeout]);

  const increment = useCallback(() => {
    if (disabled) return;

    setCount((prevCount) => {
      const nextCount = prevCount + incrementStep;
      if (nextCount > max) {
        setError(`Maximum value is ${max}`);
        if (timeoutId.current) {
          clearTimeout(timeoutId.current);
        }
        timeoutId.current = setTimeout(() => {
          setError(null);
        }, errorTimeout);
        return prevCount; // Prevent incrementing beyond max
      }
      return nextCount;
    });
  }, [incrementStep, max, disabled, errorTimeout]);

  const decrement = useCallback(() => {
    if (disabled) return;

    setCount((prevCount) => {
      const nextCount = prevCount - decrementStep;
      if (nextCount < min) {
        setError(`Minimum value is ${min}`);
        if (timeoutId.current) {
          clearTimeout(timeoutId.current);
        }
        timeoutId.current = setTimeout(() => {
          setError(null);
        }, errorTimeout);
        return prevCount; // Prevent decrementing below min
      }
      return nextCount;
    });
  }, [decrementStep, min, disabled, errorTimeout]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault(); // Prevent scrolling on spacebar
        (event.target as HTMLButtonElement).click(); // Trigger click event
      }
    },
    [disabled]
  );

  const incrementButtonRef = useRef<HTMLButtonElement>(null);
  const decrementButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {count}</p>
      {error && (
        <div role="alert" style={{ color: 'red' }}>
          {error}
        </div>
      )}
      <button
        ref={incrementButtonRef}
        onClick={increment}
        aria-label={ariaLabelIncrement}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
      >
        {ariaLabelIncrement}
      </button>
      <button
        ref={decrementButtonRef}
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
      >
        {ariaLabelDecrement}
      </button>
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useEffect, useRef } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  decrementStep?: number; // Added decrementStep for flexibility
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
  disabled?: boolean; // Added disabled prop
  errorTimeout?: number; // Added error timeout prop
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  decrementStep = 1, // Default decrement step
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
  disabled = false, // Default disabled state
  errorTimeout = 3000, // Default error timeout
}) => {
  const [count, setCount] = useState(initialCount);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null); // Ref for timeout

  // Validate props on initial render
  useEffect(() => {
    if (min > max) {
      console.error("Counter: min prop should be less than or equal to max prop.");
    }
    if (typeof incrementStep !== 'number' || incrementStep <= 0) {
      console.error("Counter: incrementStep prop should be a positive number.");
    }
    if (typeof decrementStep !== 'number' || decrementStep <= 0) {
      console.error("Counter: decrementStep prop should be a positive number.");
    }
  }, [min, max, incrementStep, decrementStep]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (timeoutId.current) {
        clearTimeout(timeoutId.current); // Clear timeout on unmount
      }
    };
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      let newCount = count;
      let newError: string | null = null;

      if (count < min) {
        newError = `Minimum value is ${min}`;
        newCount = min;
      } else if (count > max) {
        newError = `Maximum value is ${max}`;
        newCount = max;
      }

      if (newError) {
        setError(newError);
        if (timeoutId.current) {
          clearTimeout(timeoutId.current); // Clear any existing timeout
        }
        timeoutId.current = setTimeout(() => {
          setError(null); // Clear error after timeout
        }, errorTimeout);
      } else {
        setError(null);
      }

      if (newCount !== count) {
        setCount(newCount); // Update count if it was adjusted
      }

      if (onCountChange) {
        onCountChange(newCount); // Use the potentially adjusted newCount
      }
    }
  }, [count, max, min, onCountChange, errorTimeout]);

  const increment = useCallback(() => {
    if (disabled) return;

    setCount((prevCount) => {
      const nextCount = prevCount + incrementStep;
      if (nextCount > max) {
        setError(`Maximum value is ${max}`);
        if (timeoutId.current) {
          clearTimeout(timeoutId.current);
        }
        timeoutId.current = setTimeout(() => {
          setError(null);
        }, errorTimeout);
        return prevCount; // Prevent incrementing beyond max
      }
      return nextCount;
    });
  }, [incrementStep, max, disabled, errorTimeout]);

  const decrement = useCallback(() => {
    if (disabled) return;

    setCount((prevCount) => {
      const nextCount = prevCount - decrementStep;
      if (nextCount < min) {
        setError(`Minimum value is ${min}`);
        if (timeoutId.current) {
          clearTimeout(timeoutId.current);
        }
        timeoutId.current = setTimeout(() => {
          setError(null);
        }, errorTimeout);
        return prevCount; // Prevent decrementing below min
      }
      return nextCount;
    });
  }, [decrementStep, min, disabled, errorTimeout]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault(); // Prevent scrolling on spacebar
        (event.target as HTMLButtonElement).click(); // Trigger click event
      }
    },
    [disabled]
  );

  const incrementButtonRef = useRef<HTMLButtonElement>(null);
  const decrementButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {count}</p>
      {error && (
        <div role="alert" style={{ color: 'red' }}>
          {error}
        </div>
      )}
      <button
        ref={incrementButtonRef}
        onClick={increment}
        aria-label={ariaLabelIncrement}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
      >
        {ariaLabelIncrement}
      </button>
      <button
        ref={decrementButtonRef}
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
      >
        {ariaLabelDecrement}
      </button>
    </div>
  );
};

export default Counter;