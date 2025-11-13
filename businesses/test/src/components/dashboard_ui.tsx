import React, { useState, useCallback, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementBy?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
  errorTimeout?: number; // Timeout for error messages (in ms)
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
  errorTimeout = 3000, // Default error timeout
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const [error, setError] = useState<string | null>(null);
  const [isIncrementing, setIsIncrementing] = useState(false);
  const [isDecrementing, setIsDecrementing] = useState(false);

  useEffect(() => {
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, errorTimeout);
      return () => clearTimeout(timer); // Cleanup on unmount or error change
    }
  }, [error, clearError, errorTimeout]);

  const increment = useCallback(() => {
    if (isIncrementing) return; // Prevent rapid clicks

    setIsIncrementing(true);
    setCount((prevCount) => {
      const newCount = prevCount + incrementBy;
      if (newCount > max) {
        setError(`Maximum value reached: ${max}`);
        setIsIncrementing(false);
        return prevCount; // Prevent incrementing beyond max
      }
      setError(null);
      setIsIncrementing(false);
      return newCount;
    });
  }, [incrementBy, max, isIncrementing]);

  const decrement = useCallback(() => {
    if (isDecrementing) return; // Prevent rapid clicks

    setIsDecrementing(true);
    setCount((prevCount) => {
      const newCount = prevCount - incrementBy;
      if (newCount < min) {
        setError(`Minimum value reached: ${min}`);
        setIsDecrementing(false);
        return prevCount; // Prevent decrementing below min
      }
      setError(null);
      setIsDecrementing(false);
      return newCount;
    });
  }, [incrementBy, min, isDecrementing]);

  const handleBlur = useCallback(() => {
    if (isNaN(count)) {
      setCount(initialCount);
      setError('Invalid input: Reset to initial value.');
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
    const inputValue = e.target.value;
    const newValue = Number(inputValue);

    if (inputValue === '' || (typeof newValue === 'number' && isFinite(newValue))) {
        setCount(newValue);
        setError(null);
    } else {
        setError('Invalid input: Please enter a valid number.');
    }
  }, []);

  const isIncrementDisabled = count >= max || isIncrementing;
  const isDecrementDisabled = count <= min || isDecrementing;

  return (
    <div>
      <label htmlFor="counter-input" style={{ display: 'block', marginBottom: '0.5rem' }}>
        Count:
      </label>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          onClick={decrement}
          aria-label={ariaLabelDecrement}
          disabled={isDecrementDisabled}
          style={{ padding: '0.5rem', marginRight: '0.5rem' }}
        >
          Decrement
        </button>
        <input
          id="counter-input"
          type="number"
          value={count}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-label="Counter Value"
          min={min}
          max={max}
          style={{
            padding: '0.5rem',
            width: '80px',
            textAlign: 'center',
            appearance: 'textfield', // Remove spinners in some browsers
          }}
        />
        <button
          onClick={increment}
          aria-label={ariaLabelIncrement}
          disabled={isIncrementDisabled}
          style={{ padding: '0.5rem', marginLeft: '0.5rem' }}
        >
          Increment
        </button>
      </div>
      {error && (
        <div
          role="alert"
          style={{
            color: 'red',
            marginTop: '0.5rem',
            padding: '0.5rem',
            border: '1px solid red',
            borderRadius: '4px',
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementBy?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
  errorTimeout?: number; // Timeout for error messages (in ms)
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementBy = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
  errorTimeout = 3000, // Default error timeout
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const [error, setError] = useState<string | null>(null);
  const [isIncrementing, setIsIncrementing] = useState(false);
  const [isDecrementing, setIsDecrementing] = useState(false);

  useEffect(() => {
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, errorTimeout);
      return () => clearTimeout(timer); // Cleanup on unmount or error change
    }
  }, [error, clearError, errorTimeout]);

  const increment = useCallback(() => {
    if (isIncrementing) return; // Prevent rapid clicks

    setIsIncrementing(true);
    setCount((prevCount) => {
      const newCount = prevCount + incrementBy;
      if (newCount > max) {
        setError(`Maximum value reached: ${max}`);
        setIsIncrementing(false);
        return prevCount; // Prevent incrementing beyond max
      }
      setError(null);
      setIsIncrementing(false);
      return newCount;
    });
  }, [incrementBy, max, isIncrementing]);

  const decrement = useCallback(() => {
    if (isDecrementing) return; // Prevent rapid clicks

    setIsDecrementing(true);
    setCount((prevCount) => {
      const newCount = prevCount - incrementBy;
      if (newCount < min) {
        setError(`Minimum value reached: ${min}`);
        setIsDecrementing(false);
        return prevCount; // Prevent decrementing below min
      }
      setError(null);
      setIsDecrementing(false);
      return newCount;
    });
  }, [incrementBy, min, isDecrementing]);

  const handleBlur = useCallback(() => {
    if (isNaN(count)) {
      setCount(initialCount);
      setError('Invalid input: Reset to initial value.');
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
    const inputValue = e.target.value;
    const newValue = Number(inputValue);

    if (inputValue === '' || (typeof newValue === 'number' && isFinite(newValue))) {
        setCount(newValue);
        setError(null);
    } else {
        setError('Invalid input: Please enter a valid number.');
    }
  }, []);

  const isIncrementDisabled = count >= max || isIncrementing;
  const isDecrementDisabled = count <= min || isDecrementing;

  return (
    <div>
      <label htmlFor="counter-input" style={{ display: 'block', marginBottom: '0.5rem' }}>
        Count:
      </label>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          onClick={decrement}
          aria-label={ariaLabelDecrement}
          disabled={isDecrementDisabled}
          style={{ padding: '0.5rem', marginRight: '0.5rem' }}
        >
          Decrement
        </button>
        <input
          id="counter-input"
          type="number"
          value={count}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-label="Counter Value"
          min={min}
          max={max}
          style={{
            padding: '0.5rem',
            width: '80px',
            textAlign: 'center',
            appearance: 'textfield', // Remove spinners in some browsers
          }}
        />
        <button
          onClick={increment}
          aria-label={ariaLabelIncrement}
          disabled={isIncrementDisabled}
          style={{ padding: '0.5rem', marginLeft: '0.5rem' }}
        >
          Increment
        </button>
      </div>
      {error && (
        <div
          role="alert"
          style={{
            color: 'red',
            marginTop: '0.5rem',
            padding: '0.5rem',
            border: '1px solid red',
            borderRadius: '4px',
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default Counter;