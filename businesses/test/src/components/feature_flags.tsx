import React, { useState, useCallback, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  decrementStep?: number; // Added decrementStep
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
  disabled?: boolean; // Added disabled prop
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
}) => {
  const [count, setCount] = useState(initialCount);
  const [error, setError] = useState<string | null>(null);

  // Validate props on initial render
  useEffect(() => {
    if (min >= max) {
      console.error("Counter: min prop must be less than max prop.");
    }
    if (incrementStep <= 0) {
      console.error("Counter: incrementStep prop must be greater than 0.");
    }
    if (decrementStep <= 0) {
      console.error("Counter: decrementStep prop must be greater than 0.");
    }
    if (initialCount < min || initialCount > max) {
      console.warn("Counter: initialCount is outside the min/max range. Clamping value.");
      setCount(Math.max(min, Math.min(initialCount, max))); // Clamp initial value
    }
  }, [initialCount, min, max, incrementStep, decrementStep]);

  useEffect(() => {
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  const increment = useCallback(() => {
    if (disabled) return;

    setCount((prevCount) => {
      const newValue = prevCount + incrementStep;
      if (newValue > max) {
        setError(`Maximum value reached (${max})`);
        return prevCount;
      }
      setError(null);
      return newValue;
    });
  }, [incrementStep, max, disabled]);

  const decrement = useCallback(() => {
    if (disabled) return;

    setCount((prevCount) => {
      const newValue = prevCount - decrementStep;
      if (newValue < min) {
        setError(`Minimum value reached (${min})`);
        return prevCount;
      }
      setError(null);
      return newValue;
    });
  }, [decrementStep, min, disabled]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const target = event.target as HTMLButtonElement; // Explicit cast
        if (target.id === 'increment-button') {
          increment();
        } else if (target.id === 'decrement-button') {
          decrement();
        }
      }
    },
    [increment, decrement, disabled]
  );

  const isIncrementDisabled = disabled || count >= max;
  const isDecrementDisabled = disabled || count <= min;

  return (
    <div>
      <div aria-live="polite" aria-atomic="true">Count: {count}</div> {/* Improved accessibility */}
      {error && (
        <div role="alert" style={{ color: 'red' }}>
          {error}
        </div>
      )}
      <button
        id="increment-button"
        onClick={increment}
        aria-label={ariaLabelIncrement}
        onKeyDown={handleKeyDown}
        disabled={isIncrementDisabled}
      >
        {ariaLabelIncrement}
      </button>
      <button
        id="decrement-button"
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        onKeyDown={handleKeyDown}
        disabled={isDecrementDisabled}
      >
        {ariaLabelDecrement}
      </button>
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  decrementStep?: number; // Added decrementStep
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
  disabled?: boolean; // Added disabled prop
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
}) => {
  const [count, setCount] = useState(initialCount);
  const [error, setError] = useState<string | null>(null);

  // Validate props on initial render
  useEffect(() => {
    if (min >= max) {
      console.error("Counter: min prop must be less than max prop.");
    }
    if (incrementStep <= 0) {
      console.error("Counter: incrementStep prop must be greater than 0.");
    }
    if (decrementStep <= 0) {
      console.error("Counter: decrementStep prop must be greater than 0.");
    }
    if (initialCount < min || initialCount > max) {
      console.warn("Counter: initialCount is outside the min/max range. Clamping value.");
      setCount(Math.max(min, Math.min(initialCount, max))); // Clamp initial value
    }
  }, [initialCount, min, max, incrementStep, decrementStep]);

  useEffect(() => {
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  const increment = useCallback(() => {
    if (disabled) return;

    setCount((prevCount) => {
      const newValue = prevCount + incrementStep;
      if (newValue > max) {
        setError(`Maximum value reached (${max})`);
        return prevCount;
      }
      setError(null);
      return newValue;
    });
  }, [incrementStep, max, disabled]);

  const decrement = useCallback(() => {
    if (disabled) return;

    setCount((prevCount) => {
      const newValue = prevCount - decrementStep;
      if (newValue < min) {
        setError(`Minimum value reached (${min})`);
        return prevCount;
      }
      setError(null);
      return newValue;
    });
  }, [decrementStep, min, disabled]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const target = event.target as HTMLButtonElement; // Explicit cast
        if (target.id === 'increment-button') {
          increment();
        } else if (target.id === 'decrement-button') {
          decrement();
        }
      }
    },
    [increment, decrement, disabled]
  );

  const isIncrementDisabled = disabled || count >= max;
  const isDecrementDisabled = disabled || count <= min;

  return (
    <div>
      <div aria-live="polite" aria-atomic="true">Count: {count}</div> {/* Improved accessibility */}
      {error && (
        <div role="alert" style={{ color: 'red' }}>
          {error}
        </div>
      )}
      <button
        id="increment-button"
        onClick={increment}
        aria-label={ariaLabelIncrement}
        onKeyDown={handleKeyDown}
        disabled={isIncrementDisabled}
      >
        {ariaLabelIncrement}
      </button>
      <button
        id="decrement-button"
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        onKeyDown={handleKeyDown}
        disabled={isDecrementDisabled}
      >
        {ariaLabelDecrement}
      </button>
    </div>
  );
};

export default Counter;