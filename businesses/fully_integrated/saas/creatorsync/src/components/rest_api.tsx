import React, { useState, useCallback, useRef, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
  ariaLabelPrefix?: string;
  debounceDelay?: number; // Add debounce delay prop
}

/**
 * A robust counter component with increment and decrement functionality, including bounds and change tracking.
 *
 * Props:
 *   - initialCount: The starting value of the counter (default: 0).
 *   - incrementStep: The amount to increment/decrement the counter by (default: 1).  Must be a positive number.
 *   - min: The minimum allowed value for the counter (optional).
 *   - max: The maximum allowed value for the counter (optional).
 *   - onChange: A callback function that is called when the counter value changes (optional).
 *   - ariaLabelPrefix: A prefix for the aria-label of the buttons (optional).  Useful for i18n.
 *   - debounceDelay: Delay in milliseconds before onChange is called after input change (default: 300).
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min,
  max,
  onChange,
  ariaLabelPrefix = 'Counter',
  debounceDelay = 300,
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
    if (isMounted.current && onChange) {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current); // Clear any existing timeout
      }

      timeoutId.current = setTimeout(() => {
        onChange(count);
        timeoutId.current = null; // Reset timeout ID
      }, debounceDelay);
    }

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current); // Clear timeout on dependency change
      }
    };
  }, [count, onChange, debounceDelay]);

  const validateStep = useCallback((step: number): number => {
    if (typeof step !== 'number' || !Number.isFinite(step)) {
      console.error("Invalid incrementStep provided.  Must be a number.");
      setError("Invalid increment step. Using default value.");
      return 1;
    }

    if (step <= 0) {
      console.error("incrementStep must be a positive number.");
      setError("Increment step must be positive. Using default value.");
      return 1;
    }

    setError(null); // Clear error if step is valid
    return step;
  }, []);

  const safeSetCount = useCallback(
    (newCount: number) => {
      if (min !== undefined && newCount < min) {
        setError(`Value cannot be less than ${min}`);
        return;
      }

      if (max !== undefined && newCount > max) {
        setError(`Value cannot be greater than ${max}`);
        return;
      }

      setError(null);
      setCount(newCount);
    },
    [min, max]
  );

  const increment = useCallback(() => {
    const validIncrementStep = validateStep(incrementStep);
    safeSetCount(count + validIncrementStep);
  }, [count, incrementStep, min, max, validateStep, safeSetCount]);

  const decrement = useCallback(() => {
    const validIncrementStep = validateStep(incrementStep);
    safeSetCount(count - validIncrementStep);
  }, [count, incrementStep, min, max, validateStep, safeSetCount]);

  const handleBlur = useCallback(() => {
    safeSetCount(count);
  }, [count, min, max, safeSetCount]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(event.target.value);
      if (isNaN(newValue)) {
        setError("Invalid input. Please enter a number.");
        return;
      }

      safeSetCount(newValue);
    },
    [min, max, safeSetCount]
  );

  const incrementButtonLabel = `${ariaLabelPrefix} Increment`;
  const decrementButtonLabel = `${ariaLabelPrefix} Decrement`;

  const isDecrementDisabled = min !== undefined && count <= min;
  const isIncrementDisabled = max !== undefined && count >= max;

  return (
    <div role="group" aria-label={ariaLabelPrefix}>
      <label htmlFor="counter-input" style={{ display: 'block', marginBottom: '0.5rem' }}>
        Count:
      </label>
      <input
        id="counter-input"
        type="number"
        value={count}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-live="polite"
        aria-label="Counter Value"
        min={min}
        max={max}
        style={{
          padding: '0.5rem',
          border: '1px solid #ccc',
          borderRadius: '4px',
          width: '100px',
          marginBottom: '0.5rem',
        }}
      />
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={decrement}
          aria-label={decrementButtonLabel}
          disabled={isDecrementDisabled}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: isDecrementDisabled ? '#eee' : '#007bff',
            color: isDecrementDisabled ? '#666' : '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: isDecrementDisabled ? 'not-allowed' : 'pointer',
          }}
        >
          Decrement
        </button>
        <button
          onClick={increment}
          aria-label={incrementButtonLabel}
          disabled={isIncrementDisabled}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: isIncrementDisabled ? '#eee' : '#007bff',
            color: isIncrementDisabled ? '#666' : '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: isIncrementDisabled ? 'not-allowed' : 'pointer',
          }}
        >
          Increment
        </button>
      </div>
      {error && (
        <div role="alert" style={{ color: 'red', marginTop: '0.5rem' }}>
          {error}
        </div>
      )}
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
  onChange?: (value: number) => void;
  ariaLabelPrefix?: string;
  debounceDelay?: number; // Add debounce delay prop
}

/**
 * A robust counter component with increment and decrement functionality, including bounds and change tracking.
 *
 * Props:
 *   - initialCount: The starting value of the counter (default: 0).
 *   - incrementStep: The amount to increment/decrement the counter by (default: 1).  Must be a positive number.
 *   - min: The minimum allowed value for the counter (optional).
 *   - max: The maximum allowed value for the counter (optional).
 *   - onChange: A callback function that is called when the counter value changes (optional).
 *   - ariaLabelPrefix: A prefix for the aria-label of the buttons (optional).  Useful for i18n.
 *   - debounceDelay: Delay in milliseconds before onChange is called after input change (default: 300).
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min,
  max,
  onChange,
  ariaLabelPrefix = 'Counter',
  debounceDelay = 300,
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
    if (isMounted.current && onChange) {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current); // Clear any existing timeout
      }

      timeoutId.current = setTimeout(() => {
        onChange(count);
        timeoutId.current = null; // Reset timeout ID
      }, debounceDelay);
    }

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current); // Clear timeout on dependency change
      }
    };
  }, [count, onChange, debounceDelay]);

  const validateStep = useCallback((step: number): number => {
    if (typeof step !== 'number' || !Number.isFinite(step)) {
      console.error("Invalid incrementStep provided.  Must be a number.");
      setError("Invalid increment step. Using default value.");
      return 1;
    }

    if (step <= 0) {
      console.error("incrementStep must be a positive number.");
      setError("Increment step must be positive. Using default value.");
      return 1;
    }

    setError(null); // Clear error if step is valid
    return step;
  }, []);

  const safeSetCount = useCallback(
    (newCount: number) => {
      if (min !== undefined && newCount < min) {
        setError(`Value cannot be less than ${min}`);
        return;
      }

      if (max !== undefined && newCount > max) {
        setError(`Value cannot be greater than ${max}`);
        return;
      }

      setError(null);
      setCount(newCount);
    },
    [min, max]
  );

  const increment = useCallback(() => {
    const validIncrementStep = validateStep(incrementStep);
    safeSetCount(count + validIncrementStep);
  }, [count, incrementStep, min, max, validateStep, safeSetCount]);

  const decrement = useCallback(() => {
    const validIncrementStep = validateStep(incrementStep);
    safeSetCount(count - validIncrementStep);
  }, [count, incrementStep, min, max, validateStep, safeSetCount]);

  const handleBlur = useCallback(() => {
    safeSetCount(count);
  }, [count, min, max, safeSetCount]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(event.target.value);
      if (isNaN(newValue)) {
        setError("Invalid input. Please enter a number.");
        return;
      }

      safeSetCount(newValue);
    },
    [min, max, safeSetCount]
  );

  const incrementButtonLabel = `${ariaLabelPrefix} Increment`;
  const decrementButtonLabel = `${ariaLabelPrefix} Decrement`;

  const isDecrementDisabled = min !== undefined && count <= min;
  const isIncrementDisabled = max !== undefined && count >= max;

  return (
    <div role="group" aria-label={ariaLabelPrefix}>
      <label htmlFor="counter-input" style={{ display: 'block', marginBottom: '0.5rem' }}>
        Count:
      </label>
      <input
        id="counter-input"
        type="number"
        value={count}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-live="polite"
        aria-label="Counter Value"
        min={min}
        max={max}
        style={{
          padding: '0.5rem',
          border: '1px solid #ccc',
          borderRadius: '4px',
          width: '100px',
          marginBottom: '0.5rem',
        }}
      />
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={decrement}
          aria-label={decrementButtonLabel}
          disabled={isDecrementDisabled}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: isDecrementDisabled ? '#eee' : '#007bff',
            color: isDecrementDisabled ? '#666' : '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: isDecrementDisabled ? 'not-allowed' : 'pointer',
          }}
        >
          Decrement
        </button>
        <button
          onClick={increment}
          aria-label={incrementButtonLabel}
          disabled={isIncrementDisabled}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: isIncrementDisabled ? '#eee' : '#007bff',
            color: isIncrementDisabled ? '#666' : '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: isIncrementDisabled ? 'not-allowed' : 'pointer',
          }}
        >
          Increment
        </button>
      </div>
      {error && (
        <div role="alert" style={{ color: 'red', marginTop: '0.5rem' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default Counter;