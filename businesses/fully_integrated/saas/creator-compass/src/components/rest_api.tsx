import React, { useState, useCallback, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
  /** Custom class name for the container div. */
  className?: string;
  /** Custom style for the container div. */
  style?: React.CSSProperties;
  /** Debounce time in milliseconds for the onCountChange callback. */
  debounceMs?: number;
}

/**
 * A simple counter component with increment and decrement functionality.
 * Includes optional min/max values, accessibility enhancements, and a callback for count changes.
 *
 * @param {CounterProps} props - The component's props.
 * @param {number} props.initialCount - The initial value of the counter (default: 0).
 * @param {number} props.incrementStep - The amount to increment/decrement the counter by (default: 1).
 * @param {number} props.min - The minimum allowed value for the counter (optional).
 * @param {number} props.max - The maximum allowed value for the counter (optional).
 * @param {string} props.ariaLabelIncrement - Aria label for increment button (optional).
 * @param {string} props.ariaLabelDecrement - Aria label for decrement button (optional).
 * @param {function} props.onCountChange - Callback function to execute when the count changes (optional).
 * @param {string} props.className - Custom class name for the container div (optional).
 * @param {React.CSSProperties} props.style - Custom style for the container div (optional).
 * @param {number} props.debounceMs - Debounce time in milliseconds for the onCountChange callback (optional).
 * @returns {JSX.Element} - The rendered counter component.
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min,
  max,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
  className,
  style,
  debounceMs = 0,
}) => {
  const [count, setCount] = useState(initialCount);
  const [inputValue, setInputValue] = useState(String(initialCount)); // Store input value as string

  // Debounce the onCountChange callback
  const debouncedOnCountChange = useCallback(
    (value: number) => {
      if (onCountChange) {
        const timer = setTimeout(() => {
          onCountChange(value);
        }, debounceMs);

        return () => clearTimeout(timer); // Cleanup function for unmounting/re-rendering
      }
      return () => {};
    },
    [onCountChange, debounceMs]
  );

  useEffect(() => {
    debouncedOnCountChange(count);

    return () => {
      debouncedOnCountChange(count); // Call cleanup function on unmount
    };
  }, [count, debouncedOnCountChange]);

  // Update inputValue when count changes programmatically
  useEffect(() => {
    setInputValue(String(count));
  }, [count]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      let newValue = prevCount + incrementStep;
      if (max !== undefined && newValue > max) {
        newValue = max;
      }
      if (min !== undefined && newValue < min) {
        newValue = min;
      }

      return newValue;
    });
  }, [incrementStep, max, min]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      let newValue = prevCount - incrementStep;
      if (min !== undefined && newValue < min) {
        newValue = min;
      }
      if (max !== undefined && newValue > max) {
        newValue = max;
      }
      return newValue;
    });
  }, [incrementStep, min, max]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setInputValue(value); // Update the input value immediately

      let newValue = Number(value);

      if (value === '' || value === '-') {
        setCount(NaN); // Allow empty or negative sign only input
        return;
      }

      if (isNaN(newValue)) {
        return; // Ignore invalid input
      }

      if (min !== undefined && newValue < min) {
        newValue = min;
      }

      if (max !== undefined && newValue > max) {
        newValue = max;
      }

      setCount(newValue);
    },
    [min, max]
  );

  const handleInputBlur = useCallback(() => {
    if (isNaN(count)) {
      setCount(min !== undefined ? min : 0); // Reset to min or 0 if NaN
    }
  }, [count, min]);

  return (
    <div className={className} style={style}>
      <label htmlFor="counter-input">Count:</label>
      <input
        type="number"
        id="counter-input"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        aria-label="Counter Value"
      />
      <button onClick={increment} aria-label={ariaLabelIncrement} disabled={max !== undefined && count >= max}>
        Increment
      </button>
      <button onClick={decrement} aria-label={ariaLabelDecrement} disabled={min !== undefined && count <= min}>
        Decrement
      </button>
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
  /** Custom class name for the container div. */
  className?: string;
  /** Custom style for the container div. */
  style?: React.CSSProperties;
  /** Debounce time in milliseconds for the onCountChange callback. */
  debounceMs?: number;
}

/**
 * A simple counter component with increment and decrement functionality.
 * Includes optional min/max values, accessibility enhancements, and a callback for count changes.
 *
 * @param {CounterProps} props - The component's props.
 * @param {number} props.initialCount - The initial value of the counter (default: 0).
 * @param {number} props.incrementStep - The amount to increment/decrement the counter by (default: 1).
 * @param {number} props.min - The minimum allowed value for the counter (optional).
 * @param {number} props.max - The maximum allowed value for the counter (optional).
 * @param {string} props.ariaLabelIncrement - Aria label for increment button (optional).
 * @param {string} props.ariaLabelDecrement - Aria label for decrement button (optional).
 * @param {function} props.onCountChange - Callback function to execute when the count changes (optional).
 * @param {string} props.className - Custom class name for the container div (optional).
 * @param {React.CSSProperties} props.style - Custom style for the container div (optional).
 * @param {number} props.debounceMs - Debounce time in milliseconds for the onCountChange callback (optional).
 * @returns {JSX.Element} - The rendered counter component.
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min,
  max,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
  className,
  style,
  debounceMs = 0,
}) => {
  const [count, setCount] = useState(initialCount);
  const [inputValue, setInputValue] = useState(String(initialCount)); // Store input value as string

  // Debounce the onCountChange callback
  const debouncedOnCountChange = useCallback(
    (value: number) => {
      if (onCountChange) {
        const timer = setTimeout(() => {
          onCountChange(value);
        }, debounceMs);

        return () => clearTimeout(timer); // Cleanup function for unmounting/re-rendering
      }
      return () => {};
    },
    [onCountChange, debounceMs]
  );

  useEffect(() => {
    debouncedOnCountChange(count);

    return () => {
      debouncedOnCountChange(count); // Call cleanup function on unmount
    };
  }, [count, debouncedOnCountChange]);

  // Update inputValue when count changes programmatically
  useEffect(() => {
    setInputValue(String(count));
  }, [count]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      let newValue = prevCount + incrementStep;
      if (max !== undefined && newValue > max) {
        newValue = max;
      }
      if (min !== undefined && newValue < min) {
        newValue = min;
      }

      return newValue;
    });
  }, [incrementStep, max, min]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      let newValue = prevCount - incrementStep;
      if (min !== undefined && newValue < min) {
        newValue = min;
      }
      if (max !== undefined && newValue > max) {
        newValue = max;
      }
      return newValue;
    });
  }, [incrementStep, min, max]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setInputValue(value); // Update the input value immediately

      let newValue = Number(value);

      if (value === '' || value === '-') {
        setCount(NaN); // Allow empty or negative sign only input
        return;
      }

      if (isNaN(newValue)) {
        return; // Ignore invalid input
      }

      if (min !== undefined && newValue < min) {
        newValue = min;
      }

      if (max !== undefined && newValue > max) {
        newValue = max;
      }

      setCount(newValue);
    },
    [min, max]
  );

  const handleInputBlur = useCallback(() => {
    if (isNaN(count)) {
      setCount(min !== undefined ? min : 0); // Reset to min or 0 if NaN
    }
  }, [count, min]);

  return (
    <div className={className} style={style}>
      <label htmlFor="counter-input">Count:</label>
      <input
        type="number"
        id="counter-input"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        aria-label="Counter Value"
      />
      <button onClick={increment} aria-label={ariaLabelIncrement} disabled={max !== undefined && count >= max}>
        Increment
      </button>
      <button onClick={decrement} aria-label={ariaLabelDecrement} disabled={min !== undefined && count <= min}>
        Decrement
      </button>
    </div>
  );
};

export default Counter;