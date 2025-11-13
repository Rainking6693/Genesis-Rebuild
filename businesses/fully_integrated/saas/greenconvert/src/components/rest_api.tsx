import React, { useState, useCallback, useMemo, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementBy?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const [error, setError] = useState<string | null>(null);

  // Validate props on initial render and when they change
  useEffect(() => {
    if (typeof initialCount !== 'number' || !Number.isFinite(initialCount)) {
      console.error("Invalid initialCount prop. Must be a number.");
      setError("Invalid initialCount prop. Must be a number.");
      return;
    }

    if (typeof incrementBy !== 'number' || !Number.isFinite(incrementBy)) {
      console.error("Invalid incrementBy prop. Must be a number.");
      setError("Invalid incrementBy prop. Must be a number.");
      return;
    }

    if (typeof min !== 'number' || !Number.isFinite(min)) {
      console.error("Invalid min prop. Must be a number.");
      setError("Invalid min prop. Must be a number.");
      return;
    }

    if (typeof max !== 'number' || !Number.isFinite(max)) {
      console.error("Invalid max prop. Must be a number.");
      setError("Invalid max prop. Must be a number.");
      return;
    }

    if (min > max) {
      console.error("Invalid props: min cannot be greater than max.");
      setError("Invalid props: min cannot be greater than max.");
      return;
    }

    if (initialCount < min || initialCount > max) {
      console.warn("initialCount is outside the min/max range. Clamping to the range.");
      setCount(Math.max(min, Math.min(initialCount, max)));
    }

    setError(null); // Clear any previous errors if props are now valid

  }, [initialCount, incrementBy, min, max]);

  const increment = useCallback(() => {
    if (error) return; // Prevent increment if there's an error

    setCount((prevCount) => {
      const newValue = prevCount + incrementBy;
      if (newValue > max) {
        return prevCount; // Or throw an error, or clamp to max, depending on desired behavior
      }
      return newValue;
    });
  }, [incrementBy, max, error]);

  const decrement = useCallback(() => {
    if (error) return; // Prevent decrement if there's an error

    setCount((prevCount) => {
      const newValue = prevCount - incrementBy;
      if (newValue < min) {
        return prevCount; // Or throw an error, or clamp to min, depending on desired behavior
      }
      return newValue;
    });
  }, [incrementBy, min, error]);

  // Memoize the count display for performance
  const countDisplay = useMemo(() => `Count: ${count}`, [count]);

  // Call the onCountChange callback whenever the count changes
  useEffect(() => {
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  if (error) {
    return <div>Error: {error}</div>; // Or a more user-friendly error display
  }

  return (
    <div>
      <p aria-live="polite">{countDisplay}</p>
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

import React, { useState, useCallback, useMemo, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementBy?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const [error, setError] = useState<string | null>(null);

  // Validate props on initial render and when they change
  useEffect(() => {
    if (typeof initialCount !== 'number' || !Number.isFinite(initialCount)) {
      console.error("Invalid initialCount prop. Must be a number.");
      setError("Invalid initialCount prop. Must be a number.");
      return;
    }

    if (typeof incrementBy !== 'number' || !Number.isFinite(incrementBy)) {
      console.error("Invalid incrementBy prop. Must be a number.");
      setError("Invalid incrementBy prop. Must be a number.");
      return;
    }

    if (typeof min !== 'number' || !Number.isFinite(min)) {
      console.error("Invalid min prop. Must be a number.");
      setError("Invalid min prop. Must be a number.");
      return;
    }

    if (typeof max !== 'number' || !Number.isFinite(max)) {
      console.error("Invalid max prop. Must be a number.");
      setError("Invalid max prop. Must be a number.");
      return;
    }

    if (min > max) {
      console.error("Invalid props: min cannot be greater than max.");
      setError("Invalid props: min cannot be greater than max.");
      return;
    }

    if (initialCount < min || initialCount > max) {
      console.warn("initialCount is outside the min/max range. Clamping to the range.");
      setCount(Math.max(min, Math.min(initialCount, max)));
    }

    setError(null); // Clear any previous errors if props are now valid

  }, [initialCount, incrementBy, min, max]);

  const increment = useCallback(() => {
    if (error) return; // Prevent increment if there's an error

    setCount((prevCount) => {
      const newValue = prevCount + incrementBy;
      if (newValue > max) {
        return prevCount; // Or throw an error, or clamp to max, depending on desired behavior
      }
      return newValue;
    });
  }, [incrementBy, max, error]);

  const decrement = useCallback(() => {
    if (error) return; // Prevent decrement if there's an error

    setCount((prevCount) => {
      const newValue = prevCount - incrementBy;
      if (newValue < min) {
        return prevCount; // Or throw an error, or clamp to min, depending on desired behavior
      }
      return newValue;
    });
  }, [incrementBy, min, error]);

  // Memoize the count display for performance
  const countDisplay = useMemo(() => `Count: ${count}`, [count]);

  // Call the onCountChange callback whenever the count changes
  useEffect(() => {
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  if (error) {
    return <div>Error: {error}</div>; // Or a more user-friendly error display
  }

  return (
    <div>
      <p aria-live="polite">{countDisplay}</p>
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