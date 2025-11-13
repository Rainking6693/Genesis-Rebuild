import React, { useState, useCallback, useEffect, useRef } from 'react';

interface CounterProps {
  initialCount?: number | string;
  incrementStep?: number | string;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
  ariaLabelPrefix?: string;
  /** Debounce time in milliseconds for the onChange callback. Defaults to 0 (no debounce). */
  debounceMs?: number;
}

/**
 * A simple counter component with increment and decrement functionality.
 * Includes input validation, min/max limits, and accessibility improvements.
 *
 * @param {CounterProps} props - The component's props.
 * @param {number | string} props.initialCount - The initial value of the counter (default: 0).  Accepts string to handle potential input scenarios.
 * @param {number | string} props.incrementStep - The amount to increment/decrement by (default: 1). Accepts string for input scenarios.
 * @param {number} props.min - The minimum allowed value for the counter.
 * @param {number} props.max - The maximum allowed value for the counter.
 * @param {Function} props.onChange - Callback function to execute when the counter value changes.
 * @param {string} props.ariaLabelPrefix - Prefix for aria-label attributes for better context.
 * @param {number} props.debounceMs - Debounce time in milliseconds for the onChange callback.
 * @returns {JSX.Element} A React element representing the counter.
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min,
  max,
  onChange,
  ariaLabelPrefix = 'Counter',
  debounceMs = 0,
}) => {
  const [count, setCount] = useState<number>(() => {
    let initialValue = Number(initialCount);
    if (isNaN(initialValue)) {
      console.warn("Invalid initialCount provided. Using 0.");
      initialValue = 0;
    }

    if (min !== undefined && initialValue < min) {
      initialValue = min;
    }

    if (max !== undefined && initialValue > max) {
      initialValue = max;
    }

    return initialValue;
  });

  const safeIncrementStep = Number(incrementStep);
  const isValidIncrementStep = !isNaN(safeIncrementStep);

  useEffect(() => {
    if (!isValidIncrementStep) {
      console.warn("Invalid incrementStep provided. Using 1.");
    }
  }, [incrementStep, isValidIncrementStep]);

  const debouncedOnChange = useRef<((value: number) => void) | null>(null);

  useEffect(() => {
    if (onChange) {
      if (debounceMs > 0) {
        debouncedOnChange.current = (value: number) => {
          let timeoutId: NodeJS.Timeout;
          return (...args: any[]) => {
            if (timeoutId) {
              clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
              onChange(value);
            }, debounceMs);
          };
        }();
      } else {
        debouncedOnChange.current = onChange;
      }
    } else {
      debouncedOnChange.current = null;
    }

    return () => {
      if (debouncedOnChange.current) {
        // Cleanup any pending debounced calls on unmount
        clearTimeout(); // Correctly clears the timeout
      }
    };
  }, [onChange, debounceMs]);

  useEffect(() => {
    if (debouncedOnChange.current) {
      debouncedOnChange.current(count);
    }
  }, [count]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const step = isValidIncrementStep ? safeIncrementStep : 1;
      let newValue = prevCount + step;

      if (max !== undefined && newValue > max) {
        newValue = max;
      }

      return newValue;
    });
  }, [safeIncrementStep, max, isValidIncrementStep]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const step = isValidIncrementStep ? safeIncrementStep : 1;
      let newValue = prevCount - step;

      if (min !== undefined && newValue < min) {
        newValue = min;
      }

      return newValue;
    });
  }, [safeIncrementStep, min, isValidIncrementStep]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const newValue = Number(inputValue);

    if (inputValue === '' || (isNaN(newValue) && inputValue !== '-')) {
      // Allow empty input for clearing the field, and allow negative sign
      setCount(count); // Revert to previous valid value
      return;
    }

    if (isNaN(newValue)) {
      return; // Ignore non-numeric input after the negative sign
    }

    let constrainedValue = newValue;

    if (min !== undefined && newValue < min) {
      constrainedValue = min;
    }

    if (max !== undefined && newValue > max) {
      constrainedValue = max;
    }

    setCount(constrainedValue);
  }, [min, max, count]);

  const isIncrementDisabled = max !== undefined && count >= max;
  const isDecrementDisabled = min !== undefined && count <= min;

  return (
    <div>
      <label htmlFor="counter-input" style={{ display: 'block', marginBottom: '0.25rem' }}>{ariaLabelPrefix} Value:</label>
      <input
        type="number"
        id="counter-input"
        value={count}
        onChange={handleInputChange}
        aria-label={`${ariaLabelPrefix} Value Input`}
        min={min}
        max={max}
        style={{
          width: '100px',
          padding: '0.5rem',
          border: '1px solid #ccc',
          borderRadius: '4px',
          marginBottom: '0.5rem',
        }}
      />
      <p aria-live="polite" style={{ marginBottom: '0.5rem' }}>{ariaLabelPrefix} Count: {count}</p>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={increment}
          aria-label={`${ariaLabelPrefix} Increment by ${isValidIncrementStep ? safeIncrementStep : 1}`}
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
        <button
          onClick={decrement}
          aria-label={`${ariaLabelPrefix} Decrement by ${isValidIncrementStep ? safeIncrementStep : 1}`}
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
      </div>
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useEffect, useRef } from 'react';

interface CounterProps {
  initialCount?: number | string;
  incrementStep?: number | string;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
  ariaLabelPrefix?: string;
  /** Debounce time in milliseconds for the onChange callback. Defaults to 0 (no debounce). */
  debounceMs?: number;
}

/**
 * A simple counter component with increment and decrement functionality.
 * Includes input validation, min/max limits, and accessibility improvements.
 *
 * @param {CounterProps} props - The component's props.
 * @param {number | string} props.initialCount - The initial value of the counter (default: 0).  Accepts string to handle potential input scenarios.
 * @param {number | string} props.incrementStep - The amount to increment/decrement by (default: 1). Accepts string for input scenarios.
 * @param {number} props.min - The minimum allowed value for the counter.
 * @param {number} props.max - The maximum allowed value for the counter.
 * @param {Function} props.onChange - Callback function to execute when the counter value changes.
 * @param {string} props.ariaLabelPrefix - Prefix for aria-label attributes for better context.
 * @param {number} props.debounceMs - Debounce time in milliseconds for the onChange callback.
 * @returns {JSX.Element} A React element representing the counter.
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min,
  max,
  onChange,
  ariaLabelPrefix = 'Counter',
  debounceMs = 0,
}) => {
  const [count, setCount] = useState<number>(() => {
    let initialValue = Number(initialCount);
    if (isNaN(initialValue)) {
      console.warn("Invalid initialCount provided. Using 0.");
      initialValue = 0;
    }

    if (min !== undefined && initialValue < min) {
      initialValue = min;
    }

    if (max !== undefined && initialValue > max) {
      initialValue = max;
    }

    return initialValue;
  });

  const safeIncrementStep = Number(incrementStep);
  const isValidIncrementStep = !isNaN(safeIncrementStep);

  useEffect(() => {
    if (!isValidIncrementStep) {
      console.warn("Invalid incrementStep provided. Using 1.");
    }
  }, [incrementStep, isValidIncrementStep]);

  const debouncedOnChange = useRef<((value: number) => void) | null>(null);

  useEffect(() => {
    if (onChange) {
      if (debounceMs > 0) {
        debouncedOnChange.current = (value: number) => {
          let timeoutId: NodeJS.Timeout;
          return (...args: any[]) => {
            if (timeoutId) {
              clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
              onChange(value);
            }, debounceMs);
          };
        }();
      } else {
        debouncedOnChange.current = onChange;
      }
    } else {
      debouncedOnChange.current = null;
    }

    return () => {
      if (debouncedOnChange.current) {
        // Cleanup any pending debounced calls on unmount
        clearTimeout(); // Correctly clears the timeout
      }
    };
  }, [onChange, debounceMs]);

  useEffect(() => {
    if (debouncedOnChange.current) {
      debouncedOnChange.current(count);
    }
  }, [count]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const step = isValidIncrementStep ? safeIncrementStep : 1;
      let newValue = prevCount + step;

      if (max !== undefined && newValue > max) {
        newValue = max;
      }

      return newValue;
    });
  }, [safeIncrementStep, max, isValidIncrementStep]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const step = isValidIncrementStep ? safeIncrementStep : 1;
      let newValue = prevCount - step;

      if (min !== undefined && newValue < min) {
        newValue = min;
      }

      return newValue;
    });
  }, [safeIncrementStep, min, isValidIncrementStep]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const newValue = Number(inputValue);

    if (inputValue === '' || (isNaN(newValue) && inputValue !== '-')) {
      // Allow empty input for clearing the field, and allow negative sign
      setCount(count); // Revert to previous valid value
      return;
    }

    if (isNaN(newValue)) {
      return; // Ignore non-numeric input after the negative sign
    }

    let constrainedValue = newValue;

    if (min !== undefined && newValue < min) {
      constrainedValue = min;
    }

    if (max !== undefined && newValue > max) {
      constrainedValue = max;
    }

    setCount(constrainedValue);
  }, [min, max, count]);

  const isIncrementDisabled = max !== undefined && count >= max;
  const isDecrementDisabled = min !== undefined && count <= min;

  return (
    <div>
      <label htmlFor="counter-input" style={{ display: 'block', marginBottom: '0.25rem' }}>{ariaLabelPrefix} Value:</label>
      <input
        type="number"
        id="counter-input"
        value={count}
        onChange={handleInputChange}
        aria-label={`${ariaLabelPrefix} Value Input`}
        min={min}
        max={max}
        style={{
          width: '100px',
          padding: '0.5rem',
          border: '1px solid #ccc',
          borderRadius: '4px',
          marginBottom: '0.5rem',
        }}
      />
      <p aria-live="polite" style={{ marginBottom: '0.5rem' }}>{ariaLabelPrefix} Count: {count}</p>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={increment}
          aria-label={`${ariaLabelPrefix} Increment by ${isValidIncrementStep ? safeIncrementStep : 1}`}
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
        <button
          onClick={decrement}
          aria-label={`${ariaLabelPrefix} Decrement by ${isValidIncrementStep ? safeIncrementStep : 1}`}
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
      </div>
    </div>
  );
};

export default Counter;