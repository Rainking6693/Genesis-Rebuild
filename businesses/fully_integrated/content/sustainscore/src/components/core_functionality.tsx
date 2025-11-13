import React, { useState, useCallback, useRef, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
  /** Custom CSS class for the container. */
  containerClassName?: string;
  /** Custom CSS class for the count display. */
  countClassName?: string;
  /** Custom CSS class for the increment button. */
  incrementButtonClassName?: string;
  /** Custom CSS class for the decrement button. */
  decrementButtonClassName?: string;
  /** Error message to display if initialCount is invalid */
  initialCountError?: string;
}

/**
 * A simple counter component with increment and decrement functionality.
 * Includes optional min/max values, custom aria labels, and a callback for count changes.
 *
 * @param {number} initialCount - The initial value of the counter (default: 0).
 * @param {number} incrementStep - The amount to increment/decrement the counter by (default: 1).
 * @param {number} min - The minimum allowed value for the counter (optional).
 * @param {number} max - The maximum allowed value for the counter (optional).
 * @param {string} ariaLabelIncrement - Custom aria label for the increment button (default: "Increment").
 * @param {string} ariaLabelDecrement - Custom aria label for the decrement button (default: "Decrement").
 * @param {function} onCountChange - Callback function called when the count changes.
 * @param {string} containerClassName - Custom CSS class for the container.
 * @param {string} countClassName - Custom CSS class for the count display.
 * @param {string} incrementButtonClassName - Custom CSS class for the increment button.
 * @param {string} decrementButtonClassName - Custom CSS class for the decrement button.
 * @param {string} initialCountError - Error message to display if initialCount is invalid.
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min,
  max,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
  containerClassName,
  countClassName,
  incrementButtonClassName,
  decrementButtonClassName,
  initialCountError = "Invalid initial count",
}) => {
  const [count, setCount] = useState<number>(() => {
    if (typeof initialCount !== 'number' || isNaN(initialCount)) {
      console.error("Invalid initialCount provided. Falling back to 0.");
      return 0;
    }

    if (min !== undefined && initialCount < min) {
      return min;
    }

    if (max !== undefined && initialCount > max) {
      return max;
    }

    return initialCount;
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof initialCount !== 'number' || isNaN(initialCount)) {
      setError(initialCountError);
    } else {
      setError(null);
    }
  }, [initialCount, initialCountError]);

  const countRef = useRef(count);

  useEffect(() => {
    countRef.current = count;
  }, [count]);

  useEffect(() => {
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      let newValue = prevCount + incrementStep;

      if (typeof newValue !== 'number' || isNaN(newValue)) {
        console.error("Invalid increment step resulted in NaN. Ignoring increment.");
        return prevCount;
      }

      if (max !== undefined && newValue > max) {
        return max; // Cap at max
      }

      return newValue;
    });
  }, [incrementStep, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      let newValue = prevCount - incrementStep;

      if (typeof newValue !== 'number' || isNaN(newValue)) {
        console.error("Invalid decrement step resulted in NaN. Ignoring decrement.");
        return prevCount;
      }

      if (min !== undefined && newValue < min) {
        return min; // Cap at min
      }

      return newValue;
    });
  }, [incrementStep, min]);

  const isIncrementDisabled = max !== undefined && count >= max;
  const isDecrementDisabled = min !== undefined && count <= min;

  return (
    <div className={containerClassName}>
      {error && <div role="alert">{error}</div>}
      <p aria-live="polite" className={countClassName}>
        Count: {count}
      </p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={isIncrementDisabled}
        className={incrementButtonClassName}
      >
        {ariaLabelIncrement}
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={isDecrementDisabled}
        className={decrementButtonClassName}
      >
        {ariaLabelDecrement}
      </button>
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
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
  /** Custom CSS class for the container. */
  containerClassName?: string;
  /** Custom CSS class for the count display. */
  countClassName?: string;
  /** Custom CSS class for the increment button. */
  incrementButtonClassName?: string;
  /** Custom CSS class for the decrement button. */
  decrementButtonClassName?: string;
  /** Error message to display if initialCount is invalid */
  initialCountError?: string;
}

/**
 * A simple counter component with increment and decrement functionality.
 * Includes optional min/max values, custom aria labels, and a callback for count changes.
 *
 * @param {number} initialCount - The initial value of the counter (default: 0).
 * @param {number} incrementStep - The amount to increment/decrement the counter by (default: 1).
 * @param {number} min - The minimum allowed value for the counter (optional).
 * @param {number} max - The maximum allowed value for the counter (optional).
 * @param {string} ariaLabelIncrement - Custom aria label for the increment button (default: "Increment").
 * @param {string} ariaLabelDecrement - Custom aria label for the decrement button (default: "Decrement").
 * @param {function} onCountChange - Callback function called when the count changes.
 * @param {string} containerClassName - Custom CSS class for the container.
 * @param {string} countClassName - Custom CSS class for the count display.
 * @param {string} incrementButtonClassName - Custom CSS class for the increment button.
 * @param {string} decrementButtonClassName - Custom CSS class for the decrement button.
 * @param {string} initialCountError - Error message to display if initialCount is invalid.
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min,
  max,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
  containerClassName,
  countClassName,
  incrementButtonClassName,
  decrementButtonClassName,
  initialCountError = "Invalid initial count",
}) => {
  const [count, setCount] = useState<number>(() => {
    if (typeof initialCount !== 'number' || isNaN(initialCount)) {
      console.error("Invalid initialCount provided. Falling back to 0.");
      return 0;
    }

    if (min !== undefined && initialCount < min) {
      return min;
    }

    if (max !== undefined && initialCount > max) {
      return max;
    }

    return initialCount;
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof initialCount !== 'number' || isNaN(initialCount)) {
      setError(initialCountError);
    } else {
      setError(null);
    }
  }, [initialCount, initialCountError]);

  const countRef = useRef(count);

  useEffect(() => {
    countRef.current = count;
  }, [count]);

  useEffect(() => {
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      let newValue = prevCount + incrementStep;

      if (typeof newValue !== 'number' || isNaN(newValue)) {
        console.error("Invalid increment step resulted in NaN. Ignoring increment.");
        return prevCount;
      }

      if (max !== undefined && newValue > max) {
        return max; // Cap at max
      }

      return newValue;
    });
  }, [incrementStep, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      let newValue = prevCount - incrementStep;

      if (typeof newValue !== 'number' || isNaN(newValue)) {
        console.error("Invalid decrement step resulted in NaN. Ignoring decrement.");
        return prevCount;
      }

      if (min !== undefined && newValue < min) {
        return min; // Cap at min
      }

      return newValue;
    });
  }, [incrementStep, min]);

  const isIncrementDisabled = max !== undefined && count >= max;
  const isDecrementDisabled = min !== undefined && count <= min;

  return (
    <div className={containerClassName}>
      {error && <div role="alert">{error}</div>}
      <p aria-live="polite" className={countClassName}>
        Count: {count}
      </p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={isIncrementDisabled}
        className={incrementButtonClassName}
      >
        {ariaLabelIncrement}
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={isDecrementDisabled}
        className={decrementButtonClassName}
      >
        {ariaLabelDecrement}
      </button>
    </div>
  );
};

export default Counter;