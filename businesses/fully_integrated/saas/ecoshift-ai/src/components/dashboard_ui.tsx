import React, { useState, useEffect, useCallback, useRef } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  label?: string;
  min?: number;
  max?: number;
  onCountChange?: (count: number) => void;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  disabled?: boolean;
  className?: string; // Allow custom styling
  errorTimeout?: number; // Duration to display error messages (ms)
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  label = 'Counter',
  min,
  max,
  onCountChange,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  disabled = false,
  className = '',
  errorTimeout = 3000,
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const [error, setError] = useState<string | null>(null);
  const errorTimeoutRef = useRef<number | null>(null);

  // Clear any existing timeout when the component unmounts or error changes
  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const increment = useCallback(() => {
    if (disabled) return;

    setCount((prevCount) => {
      const newValue = prevCount + incrementStep;
      if (max !== undefined && newValue > max) {
        const errorMessage = `Maximum value reached: ${max}`;
        setError(errorMessage);
        if (errorTimeout > 0) {
          if (errorTimeoutRef.current) {
            clearTimeout(errorTimeoutRef.current); // Clear any existing timeout
          }
          errorTimeoutRef.current = window.setTimeout(() => {
            clearError();
            errorTimeoutRef.current = null;
          }, errorTimeout);
        }
        return prevCount;
      }
      clearError();
      return newValue;
    });
  }, [incrementStep, max, disabled, clearError, errorTimeout]);

  const decrement = useCallback(() => {
    if (disabled) return;

    setCount((prevCount) => {
      const newValue = prevCount - incrementStep;
      if (min !== undefined && newValue < min) {
        const errorMessage = `Minimum value reached: ${min}`;
        setError(errorMessage);
        if (errorTimeout > 0) {
          if (errorTimeoutRef.current) {
            clearTimeout(errorTimeoutRef.current); // Clear any existing timeout
          }
          errorTimeoutRef.current = window.setTimeout(() => {
            clearError();
            errorTimeoutRef.current = null;
          }, errorTimeout);
        }
        return prevCount;
      }
      clearError();
      return newValue;
    });
  }, [incrementStep, min, disabled, clearError, errorTimeout]);

  useEffect(() => {
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  useEffect(() => {
    if (min !== undefined && initialCount < min) {
      setCount(min);
      const errorMessage = `Initial value less than minimum: ${min}. Set to minimum.`;
      setError(errorMessage);
      if (errorTimeout > 0) {
        if (errorTimeoutRef.current) {
          clearTimeout(errorTimeoutRef.current); // Clear any existing timeout
        }
        errorTimeoutRef.current = window.setTimeout(() => {
          clearError();
          errorTimeoutRef.current = null;
        }, errorTimeout);
      }
    } else if (max !== undefined && initialCount > max) {
      setCount(max);
      const errorMessage = `Initial value greater than maximum: ${max}. Set to maximum.`;
      setError(errorMessage);
      if (errorTimeout > 0) {
        if (errorTimeoutRef.current) {
          clearTimeout(errorTimeoutRef.current); // Clear any existing timeout
        }
        errorTimeoutRef.current = window.setTimeout(() => {
          clearError();
          errorTimeoutRef.current = null;
        }, errorTimeout);
      }
    } else {
      clearError();
    }
  }, [initialCount, min, max, clearError, errorTimeout]);

  // Consider removing this useEffect in production.  Useful for debugging.
  useEffect(() => {
    console.log(`${label} count updated: ${count}`);
  }, [count, label]);

  const counterStyle = {
    border: '1px solid #ccc',
    padding: '10px',
    margin: '5px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const buttonStyle = {
    margin: '5px',
    padding: '5px 10px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    backgroundColor: disabled ? '#eee' : '#fff',
    border: '1px solid #ccc',
    borderRadius: '4px',
  };

  const errorStyle = {
    color: 'red',
    fontSize: '0.8em',
    marginTop: '5px',
    minHeight: '1em', // Prevent layout shift when error appears
  };

  const incrementButtonDisabled = disabled || (max !== undefined && count >= max);
  const decrementButtonDisabled = disabled || (min !== undefined && count <= min);

  return (
    <div style={counterStyle} className={className}>
      <p aria-live="polite">
        {label}: {count}
      </p>
      <div>
        <button
          onClick={increment}
          aria-label={ariaLabelIncrement}
          style={buttonStyle}
          disabled={incrementButtonDisabled}
          aria-disabled={incrementButtonDisabled}
        >
          Increment
        </button>
        <button
          onClick={decrement}
          aria-label={ariaLabelDecrement}
          style={buttonStyle}
          disabled={decrementButtonDisabled}
          aria-disabled={decrementButtonDisabled}
        >
          Decrement
        </button>
      </div>
      {error && (
        <div style={errorStyle} role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default Counter;

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  label?: string;
  min?: number;
  max?: number;
  onCountChange?: (count: number) => void;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  disabled?: boolean;
  className?: string; // Allow custom styling
  errorTimeout?: number; // Duration to display error messages (ms)
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  label = 'Counter',
  min,
  max,
  onCountChange,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  disabled = false,
  className = '',
  errorTimeout = 3000,
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const [error, setError] = useState<string | null>(null);
  const errorTimeoutRef = useRef<number | null>(null);

  // Clear any existing timeout when the component unmounts or error changes
  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const increment = useCallback(() => {
    if (disabled) return;

    setCount((prevCount) => {
      const newValue = prevCount + incrementStep;
      if (max !== undefined && newValue > max) {
        const errorMessage = `Maximum value reached: ${max}`;
        setError(errorMessage);
        if (errorTimeout > 0) {
          if (errorTimeoutRef.current) {
            clearTimeout(errorTimeoutRef.current); // Clear any existing timeout
          }
          errorTimeoutRef.current = window.setTimeout(() => {
            clearError();
            errorTimeoutRef.current = null;
          }, errorTimeout);
        }
        return prevCount;
      }
      clearError();
      return newValue;
    });
  }, [incrementStep, max, disabled, clearError, errorTimeout]);

  const decrement = useCallback(() => {
    if (disabled) return;

    setCount((prevCount) => {
      const newValue = prevCount - incrementStep;
      if (min !== undefined && newValue < min) {
        const errorMessage = `Minimum value reached: ${min}`;
        setError(errorMessage);
        if (errorTimeout > 0) {
          if (errorTimeoutRef.current) {
            clearTimeout(errorTimeoutRef.current); // Clear any existing timeout
          }
          errorTimeoutRef.current = window.setTimeout(() => {
            clearError();
            errorTimeoutRef.current = null;
          }, errorTimeout);
        }
        return prevCount;
      }
      clearError();
      return newValue;
    });
  }, [incrementStep, min, disabled, clearError, errorTimeout]);

  useEffect(() => {
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  useEffect(() => {
    if (min !== undefined && initialCount < min) {
      setCount(min);
      const errorMessage = `Initial value less than minimum: ${min}. Set to minimum.`;
      setError(errorMessage);
      if (errorTimeout > 0) {
        if (errorTimeoutRef.current) {
          clearTimeout(errorTimeoutRef.current); // Clear any existing timeout
        }
        errorTimeoutRef.current = window.setTimeout(() => {
          clearError();
          errorTimeoutRef.current = null;
        }, errorTimeout);
      }
    } else if (max !== undefined && initialCount > max) {
      setCount(max);
      const errorMessage = `Initial value greater than maximum: ${max}. Set to maximum.`;
      setError(errorMessage);
      if (errorTimeout > 0) {
        if (errorTimeoutRef.current) {
          clearTimeout(errorTimeoutRef.current); // Clear any existing timeout
        }
        errorTimeoutRef.current = window.setTimeout(() => {
          clearError();
          errorTimeoutRef.current = null;
        }, errorTimeout);
      }
    } else {
      clearError();
    }
  }, [initialCount, min, max, clearError, errorTimeout]);

  // Consider removing this useEffect in production.  Useful for debugging.
  useEffect(() => {
    console.log(`${label} count updated: ${count}`);
  }, [count, label]);

  const counterStyle = {
    border: '1px solid #ccc',
    padding: '10px',
    margin: '5px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const buttonStyle = {
    margin: '5px',
    padding: '5px 10px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    backgroundColor: disabled ? '#eee' : '#fff',
    border: '1px solid #ccc',
    borderRadius: '4px',
  };

  const errorStyle = {
    color: 'red',
    fontSize: '0.8em',
    marginTop: '5px',
    minHeight: '1em', // Prevent layout shift when error appears
  };

  const incrementButtonDisabled = disabled || (max !== undefined && count >= max);
  const decrementButtonDisabled = disabled || (min !== undefined && count <= min);

  return (
    <div style={counterStyle} className={className}>
      <p aria-live="polite">
        {label}: {count}
      </p>
      <div>
        <button
          onClick={increment}
          aria-label={ariaLabelIncrement}
          style={buttonStyle}
          disabled={incrementButtonDisabled}
          aria-disabled={incrementButtonDisabled}
        >
          Increment
        </button>
        <button
          onClick={decrement}
          aria-label={ariaLabelDecrement}
          style={buttonStyle}
          disabled={decrementButtonDisabled}
          aria-disabled={decrementButtonDisabled}
        >
          Decrement
        </button>
      </div>
      {error && (
        <div style={errorStyle} role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default Counter;