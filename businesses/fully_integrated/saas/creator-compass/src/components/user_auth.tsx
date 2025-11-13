import React, { useState, useCallback, useEffect, useRef } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
  onError?: (error: Error) => void;
  /** Custom CSS class for the container. */
  containerClassName?: string;
  /** Custom CSS class for the count display. */
  countClassName?: string;
  /** Custom CSS class for the increment button. */
  incrementButtonClassName?: string;
  /** Custom CSS class for the decrement button. */
  decrementButtonClassName?: string;
  /** Custom CSS class for the error message. */
  errorClassName?: string;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
  onError,
  containerClassName = '',
  countClassName = '',
  incrementButtonClassName = '',
  decrementButtonClassName = '',
  errorClassName = '',
}) => {
  const [count, setCount] = useState(initialCount);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(true);
  const [isIncrementing, setIsIncrementing] = useState(false);
  const [isDecrementing, setIsDecrementing] = useState(false);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  useEffect(() => {
    if (onError && error) {
      onError(error);
    }
  }, [error, onError]);

  const safeSetCount = useCallback(
    (newCount: number) => {
      if (newCount < min) {
        const minError = new Error(`Minimum value reached: ${min}`);
        setError(minError);
        if (isMounted.current) {
          setCount(min);
          if (onError) {
            onError(minError); // Report error to parent component
          }
        }
        return;
      }

      if (newCount > max) {
        const maxError = new Error(`Maximum value reached: ${max}`);
        setError(maxError);
        if (isMounted.current) {
          setCount(max);
          if (onError) {
            onError(maxError); // Report error to parent component
          }
        }
        return;
      }

      setError(null);
      if (isMounted.current) {
        setCount(newCount);
      }
    },
    [max, min, onError]
  );

  const increment = useCallback(() => {
    setIsIncrementing(true);
    safeSetCount(count + incrementStep);
    setIsIncrementing(false);
  }, [count, incrementStep, safeSetCount]);

  const decrement = useCallback(() => {
    setIsDecrementing(true);
    safeSetCount(count - incrementStep);
    setIsDecrementing(false);
  }, [count, incrementStep, safeSetCount]);

  // Consider using a single error handler for both increment and decrement
  const handleError = useCallback((errorMessage: string) => {
    console.error(errorMessage);
    // Optionally, you could also display the error in the UI or log it to a server.
  }, []);

  return (
    <div className={`counter-container ${containerClassName}`}>
      <p aria-live="polite" className={`counter-count ${countClassName}`}>
        Count: {count}
      </p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={count >= max || isIncrementing}
        className={`counter-increment ${incrementButtonClassName}`}
        style={{ cursor: count >= max || isIncrementing ? 'not-allowed' : 'pointer' }}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={count <= min || isDecrementing}
        className={`counter-decrement ${decrementButtonClassName}`}
        style={{ cursor: count <= min || isDecrementing ? 'not-allowed' : 'pointer' }}
      >
        Decrement
      </button>
      {error && (
        <div role="alert" className={`counter-error ${errorClassName}`} style={{ color: 'red' }}>
          Error: {error.message}
        </div>
      )}
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useEffect, useRef } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
  onError?: (error: Error) => void;
  /** Custom CSS class for the container. */
  containerClassName?: string;
  /** Custom CSS class for the count display. */
  countClassName?: string;
  /** Custom CSS class for the increment button. */
  incrementButtonClassName?: string;
  /** Custom CSS class for the decrement button. */
  decrementButtonClassName?: string;
  /** Custom CSS class for the error message. */
  errorClassName?: string;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
  onError,
  containerClassName = '',
  countClassName = '',
  incrementButtonClassName = '',
  decrementButtonClassName = '',
  errorClassName = '',
}) => {
  const [count, setCount] = useState(initialCount);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(true);
  const [isIncrementing, setIsIncrementing] = useState(false);
  const [isDecrementing, setIsDecrementing] = useState(false);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  useEffect(() => {
    if (onError && error) {
      onError(error);
    }
  }, [error, onError]);

  const safeSetCount = useCallback(
    (newCount: number) => {
      if (newCount < min) {
        const minError = new Error(`Minimum value reached: ${min}`);
        setError(minError);
        if (isMounted.current) {
          setCount(min);
          if (onError) {
            onError(minError); // Report error to parent component
          }
        }
        return;
      }

      if (newCount > max) {
        const maxError = new Error(`Maximum value reached: ${max}`);
        setError(maxError);
        if (isMounted.current) {
          setCount(max);
          if (onError) {
            onError(maxError); // Report error to parent component
          }
        }
        return;
      }

      setError(null);
      if (isMounted.current) {
        setCount(newCount);
      }
    },
    [max, min, onError]
  );

  const increment = useCallback(() => {
    setIsIncrementing(true);
    safeSetCount(count + incrementStep);
    setIsIncrementing(false);
  }, [count, incrementStep, safeSetCount]);

  const decrement = useCallback(() => {
    setIsDecrementing(true);
    safeSetCount(count - incrementStep);
    setIsDecrementing(false);
  }, [count, incrementStep, safeSetCount]);

  // Consider using a single error handler for both increment and decrement
  const handleError = useCallback((errorMessage: string) => {
    console.error(errorMessage);
    // Optionally, you could also display the error in the UI or log it to a server.
  }, []);

  return (
    <div className={`counter-container ${containerClassName}`}>
      <p aria-live="polite" className={`counter-count ${countClassName}`}>
        Count: {count}
      </p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={count >= max || isIncrementing}
        className={`counter-increment ${incrementButtonClassName}`}
        style={{ cursor: count >= max || isIncrementing ? 'not-allowed' : 'pointer' }}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={count <= min || isDecrementing}
        className={`counter-decrement ${decrementButtonClassName}`}
        style={{ cursor: count <= min || isDecrementing ? 'not-allowed' : 'pointer' }}
      >
        Decrement
      </button>
      {error && (
        <div role="alert" className={`counter-error ${errorClassName}`} style={{ color: 'red' }}>
          Error: {error.message}
        </div>
      )}
    </div>
  );
};

export default Counter;