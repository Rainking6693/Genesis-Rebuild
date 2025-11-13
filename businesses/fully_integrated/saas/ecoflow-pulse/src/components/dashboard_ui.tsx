import React, { useState, useEffect, useCallback, useRef } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  label?: string;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  ariaLabelReset?: string;
  disabled?: boolean;
  /**
   * Debounce time in milliseconds for the onChange event.
   * This helps to prevent excessive updates when the user is rapidly changing the value.
   * @default 0 (no debounce)
   */
  debounceMs?: number;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  label = 'Item Count',
  min,
  max,
  onChange,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  ariaLabelReset = 'Reset',
  disabled = false,
  debounceMs = 0,
}) => {
  const [count, setCount] = useState(initialCount);
  const isMounted = useRef(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  // Validate props
  if (min !== undefined && max !== undefined && min > max) {
    console.error("Counter: min value cannot be greater than max value.");
  }

  const increment = useCallback(() => {
    setCount((prevCount) => {
      let newValue = prevCount + incrementStep;
      if (max !== undefined && newValue > max) {
        newValue = max;
      }
      return newValue;
    });
  }, [incrementStep, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      let newValue = prevCount - incrementStep;
      if (min !== undefined && newValue < min) {
        newValue = min;
      }
      return newValue;
    });
  }, [incrementStep, min]);

  const reset = useCallback(() => {
    setCount(initialCount);
  }, [initialCount]);

  useEffect(() => {
    if (isMounted.current) {
      if (debounceMs > 0) {
        if (timeoutId.current) {
          clearTimeout(timeoutId.current);
        }
        timeoutId.current = setTimeout(() => {
          console.log(`Counter "${label}" updated: ${count}`);
          onChange?.(count);
          timeoutId.current = null;
        }, debounceMs);
      } else {
        console.log(`Counter "${label}" updated: ${count}`);
        onChange?.(count);
      }
    } else {
      isMounted.current = true;
    }

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [count, label, onChange, debounceMs]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      let parsedValue = parseInt(value, 10);

      if (isNaN(parsedValue)) {
        // Handle empty input or non-numeric input
        setCount(value === "" ? 0 : initialCount); // Reset to initial or 0 if empty
        return;
      }

      if (min !== undefined && parsedValue < min) {
        parsedValue = min;
      }

      if (max !== undefined && parsedValue > max) {
        parsedValue = max;
      }

      setCount(parsedValue);
    },
    [initialCount, min, max]
  );

  // Accessibility improvements:  aria-valuenow, aria-valuemin, aria-valuemax
  return (
    <div>
      <label htmlFor="counter-input">{label}:</label>
      <input
        type="number"
        id="counter-input"
        value={count}
        onChange={handleInputChange}
        aria-label={label}
        aria-valuenow={count}
        aria-valuemin={min}
        aria-valuemax={max}
        disabled={disabled}
        min={min} // Add min attribute for browser validation
        max={max} // Add max attribute for browser validation
      />
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={disabled}
      >
        {ariaLabelDecrement}
      </button>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={disabled}
      >
        {ariaLabelIncrement}
      </button>
      <button onClick={reset} aria-label={ariaLabelReset} disabled={disabled}>
        {ariaLabelReset}
      </button>
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
  onChange?: (value: number) => void;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  ariaLabelReset?: string;
  disabled?: boolean;
  /**
   * Debounce time in milliseconds for the onChange event.
   * This helps to prevent excessive updates when the user is rapidly changing the value.
   * @default 0 (no debounce)
   */
  debounceMs?: number;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  label = 'Item Count',
  min,
  max,
  onChange,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  ariaLabelReset = 'Reset',
  disabled = false,
  debounceMs = 0,
}) => {
  const [count, setCount] = useState(initialCount);
  const isMounted = useRef(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  // Validate props
  if (min !== undefined && max !== undefined && min > max) {
    console.error("Counter: min value cannot be greater than max value.");
  }

  const increment = useCallback(() => {
    setCount((prevCount) => {
      let newValue = prevCount + incrementStep;
      if (max !== undefined && newValue > max) {
        newValue = max;
      }
      return newValue;
    });
  }, [incrementStep, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      let newValue = prevCount - incrementStep;
      if (min !== undefined && newValue < min) {
        newValue = min;
      }
      return newValue;
    });
  }, [incrementStep, min]);

  const reset = useCallback(() => {
    setCount(initialCount);
  }, [initialCount]);

  useEffect(() => {
    if (isMounted.current) {
      if (debounceMs > 0) {
        if (timeoutId.current) {
          clearTimeout(timeoutId.current);
        }
        timeoutId.current = setTimeout(() => {
          console.log(`Counter "${label}" updated: ${count}`);
          onChange?.(count);
          timeoutId.current = null;
        }, debounceMs);
      } else {
        console.log(`Counter "${label}" updated: ${count}`);
        onChange?.(count);
      }
    } else {
      isMounted.current = true;
    }

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [count, label, onChange, debounceMs]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      let parsedValue = parseInt(value, 10);

      if (isNaN(parsedValue)) {
        // Handle empty input or non-numeric input
        setCount(value === "" ? 0 : initialCount); // Reset to initial or 0 if empty
        return;
      }

      if (min !== undefined && parsedValue < min) {
        parsedValue = min;
      }

      if (max !== undefined && parsedValue > max) {
        parsedValue = max;
      }

      setCount(parsedValue);
    },
    [initialCount, min, max]
  );

  // Accessibility improvements:  aria-valuenow, aria-valuemin, aria-valuemax
  return (
    <div>
      <label htmlFor="counter-input">{label}:</label>
      <input
        type="number"
        id="counter-input"
        value={count}
        onChange={handleInputChange}
        aria-label={label}
        aria-valuenow={count}
        aria-valuemin={min}
        aria-valuemax={max}
        disabled={disabled}
        min={min} // Add min attribute for browser validation
        max={max} // Add max attribute for browser validation
      />
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={disabled}
      >
        {ariaLabelDecrement}
      </button>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={disabled}
      >
        {ariaLabelIncrement}
      </button>
      <button onClick={reset} aria-label={ariaLabelReset} disabled={disabled}>
        {ariaLabelReset}
      </button>
    </div>
  );
};

export default Counter;