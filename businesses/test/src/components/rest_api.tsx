import React, { useState, useCallback, useRef, useEffect } from 'react';

interface Props {
  initialCount?: number;
  incrementBy?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  ariaLabelCounter?: string;
  onCountChange?: (count: number) => void;
  debounceDelay?: number; // Debounce delay for onChange event
}

const Counter: React.FC<Props> = ({
  initialCount = 0,
  incrementBy = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  ariaLabelCounter = 'Counter Value',
  onCountChange,
  debounceDelay = 500,
}) => {
  const [count, setCount] = useState(initialCount);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null); // Ref for debounce timeout

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
    if (isMounted.current && onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + incrementBy;
      if (newCount > max) {
        setError(`Maximum value reached: ${max}`);
        return prevCount;
      }
      setError(null);
      return newCount;
    });
  }, [incrementBy, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - incrementBy;
      if (newCount < min) {
        setError(`Minimum value reached: ${min}`);
        return prevCount;
      }
      setError(null);
      return newCount;
    });
  }, [incrementBy, min]);

  const handleBlur = useCallback(() => {
    if (isNaN(count)) {
      setCount(initialCount);
      setError('Invalid input. Reset to initial value.');
      return;
    }

    if (count < min) {
      setCount(min);
      setError(`Value reset to minimum: ${min}`);
    } else if (count > max) {
      setCount(max);
      setError(`Value reset to maximum: ${max}`);
    } else {
      setError(null);
    }
  }, [count, min, max, initialCount]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Clear previous timeout
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    timeoutId.current = setTimeout(() => {
      const newValue = Number(value);

      if (isNaN(newValue)) {
        setError('Invalid input. Please enter a number.');
        return;
      }

      if (newValue < min) {
        setCount(min);
        setError(`Value reset to minimum: ${min}`);
        return;
      }

      if (newValue > max) {
        setCount(max);
        setError(`Value reset to maximum: ${max}`);
        return;
      }

      setCount(newValue);
      setError(null);
    }, debounceDelay);
  }, [debounceDelay, max, min]);

  return (
    <div role="group" aria-label="Counter Group">
      <label htmlFor="counter-input">Count:</label>
      <input
        type="number"
        id="counter-input"
        value={count}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-label={ariaLabelCounter}
        min={min}
        max={max}
        data-testid="counter-input"
      />
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={count >= max}
        data-testid="increment-button"
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={count <= min}
        data-testid="decrement-button"
      >
        Decrement
      </button>
      {error && (
        <div
          role="alert"
          style={{ color: 'red' }}
          data-testid="error-message"
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useRef, useEffect } from 'react';

interface Props {
  initialCount?: number;
  incrementBy?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  ariaLabelCounter?: string;
  onCountChange?: (count: number) => void;
  debounceDelay?: number; // Debounce delay for onChange event
}

const Counter: React.FC<Props> = ({
  initialCount = 0,
  incrementBy = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  ariaLabelCounter = 'Counter Value',
  onCountChange,
  debounceDelay = 500,
}) => {
  const [count, setCount] = useState(initialCount);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null); // Ref for debounce timeout

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
    if (isMounted.current && onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + incrementBy;
      if (newCount > max) {
        setError(`Maximum value reached: ${max}`);
        return prevCount;
      }
      setError(null);
      return newCount;
    });
  }, [incrementBy, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - incrementBy;
      if (newCount < min) {
        setError(`Minimum value reached: ${min}`);
        return prevCount;
      }
      setError(null);
      return newCount;
    });
  }, [incrementBy, min]);

  const handleBlur = useCallback(() => {
    if (isNaN(count)) {
      setCount(initialCount);
      setError('Invalid input. Reset to initial value.');
      return;
    }

    if (count < min) {
      setCount(min);
      setError(`Value reset to minimum: ${min}`);
    } else if (count > max) {
      setCount(max);
      setError(`Value reset to maximum: ${max}`);
    } else {
      setError(null);
    }
  }, [count, min, max, initialCount]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Clear previous timeout
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    timeoutId.current = setTimeout(() => {
      const newValue = Number(value);

      if (isNaN(newValue)) {
        setError('Invalid input. Please enter a number.');
        return;
      }

      if (newValue < min) {
        setCount(min);
        setError(`Value reset to minimum: ${min}`);
        return;
      }

      if (newValue > max) {
        setCount(max);
        setError(`Value reset to maximum: ${max}`);
        return;
      }

      setCount(newValue);
      setError(null);
    }, debounceDelay);
  }, [debounceDelay, max, min]);

  return (
    <div role="group" aria-label="Counter Group">
      <label htmlFor="counter-input">Count:</label>
      <input
        type="number"
        id="counter-input"
        value={count}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-label={ariaLabelCounter}
        min={min}
        max={max}
        data-testid="counter-input"
      />
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={count >= max}
        data-testid="increment-button"
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={count <= min}
        data-testid="decrement-button"
      >
        Decrement
      </button>
      {error && (
        <div
          role="alert"
          style={{ color: 'red' }}
          data-testid="error-message"
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default Counter;