import React, { useState, useCallback, useEffect } from 'react';

interface Props {
  initialCount?: number;
  min?: number;
  max?: number;
  incrementStep?: number;
  decrementStep?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  errorMessage?: string;
  errorStyle?: React.CSSProperties; // Allow custom styling of the error message
  countStyle?: React.CSSProperties; // Allow custom styling of the count display
  buttonStyle?: React.CSSProperties; // Allow custom styling of the buttons
  disabledButtonStyle?: React.CSSProperties; // Allow custom styling of disabled buttons
}

/**
 * A simple counter component. While this component itself isn't directly related to customer support,
 * it serves as a placeholder and example of a React component. In a real customer support bot,
 * this would be replaced with components that handle user input, display FAQs, connect to a knowledge base,
 * or interact with a live agent.
 *
 * This improved version includes:
 * - Min/Max values to prevent underflow/overflow.
 * - Customizable increment/decrement steps.
 * - Aria labels for accessibility.
 * - Error handling and display.
 * - More robust type checking.
 * - Custom styling options.
 * - Handles non-numeric initialCount.
 * - Prevents NaN values.
 * - More descriptive error messages.
 */
const Counter: React.FC<Props> = ({
  initialCount = 0,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  incrementStep = 1,
  decrementStep = 1,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  errorMessage = 'Invalid count value',
  errorStyle = { color: 'red' },
  countStyle = {},
  buttonStyle = {},
  disabledButtonStyle = { opacity: 0.5 },
}) => {
  const [count, setCount] = useState<number>(() => {
    const parsedInitialCount = Number(initialCount);
    if (isNaN(parsedInitialCount)) {
      console.error(`Invalid initialCount: ${initialCount}.  Using default value of 0.`);
      return 0;
    }
    return parsedInitialCount;
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateCount = (value: number) => {
      if (value < min) {
        console.error(`Count ${value} is below the minimum value (${min}).`);
        setError(errorMessage || `Value must be at least ${min}`);
        return min;
      }
      if (value > max) {
        console.error(`Count ${value} exceeds the maximum value (${max}).`);
        setError(errorMessage || `Value must be no more than ${max}`);
        return max;
      }
      setError(null);
      return value;
    };

    // Validate initial count on mount and when min/max changes
    const parsedInitialCount = Number(initialCount);

    if (isNaN(parsedInitialCount)) {
      console.error(`Invalid initialCount: ${initialCount}.  Resetting to 0.`);
      setCount(0);
      return;
    }

    setCount((prevCount) => {
      const validatedCount = validateCount(parsedInitialCount);
      return validatedCount;
    });

  }, [initialCount, min, max, errorMessage]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount + incrementStep;
      if (isNaN(nextCount)) {
        setError("Increment resulted in NaN. Check incrementStep value.");
        return prevCount;
      }
      if (nextCount > max) {
        setError(errorMessage || `Cannot increment beyond maximum value of ${max}`);
        return prevCount; // Or return max if you want to clamp
      }
      setError(null);
      return nextCount;
    });
  }, [incrementStep, max, errorMessage]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount - decrementStep;
      if (isNaN(nextCount)) {
        setError("Decrement resulted in NaN. Check decrementStep value.");
        return prevCount;
      }
      if (nextCount < min) {
        setError(errorMessage || `Cannot decrement below minimum value of ${min}`);
        return prevCount; // Or return min if you want to clamp
      }
      setError(null);
      return nextCount;
    });
  }, [decrementStep, min, errorMessage]);

  const isIncrementDisabled = count >= max;
  const isDecrementDisabled = count <= min;

  return (
    <div>
      <p style={countStyle}>Count: {count}</p>
      {error && <div style={errorStyle}>{error}</div>}
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={isIncrementDisabled}
        style={isIncrementDisabled ? { ...buttonStyle, ...disabledButtonStyle } : buttonStyle}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={isDecrementDisabled}
        style={isDecrementDisabled ? { ...buttonStyle, ...disabledButtonStyle } : buttonStyle}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useEffect } from 'react';

interface Props {
  initialCount?: number;
  min?: number;
  max?: number;
  incrementStep?: number;
  decrementStep?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  errorMessage?: string;
  errorStyle?: React.CSSProperties; // Allow custom styling of the error message
  countStyle?: React.CSSProperties; // Allow custom styling of the count display
  buttonStyle?: React.CSSProperties; // Allow custom styling of the buttons
  disabledButtonStyle?: React.CSSProperties; // Allow custom styling of disabled buttons
}

/**
 * A simple counter component. While this component itself isn't directly related to customer support,
 * it serves as a placeholder and example of a React component. In a real customer support bot,
 * this would be replaced with components that handle user input, display FAQs, connect to a knowledge base,
 * or interact with a live agent.
 *
 * This improved version includes:
 * - Min/Max values to prevent underflow/overflow.
 * - Customizable increment/decrement steps.
 * - Aria labels for accessibility.
 * - Error handling and display.
 * - More robust type checking.
 * - Custom styling options.
 * - Handles non-numeric initialCount.
 * - Prevents NaN values.
 * - More descriptive error messages.
 */
const Counter: React.FC<Props> = ({
  initialCount = 0,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  incrementStep = 1,
  decrementStep = 1,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  errorMessage = 'Invalid count value',
  errorStyle = { color: 'red' },
  countStyle = {},
  buttonStyle = {},
  disabledButtonStyle = { opacity: 0.5 },
}) => {
  const [count, setCount] = useState<number>(() => {
    const parsedInitialCount = Number(initialCount);
    if (isNaN(parsedInitialCount)) {
      console.error(`Invalid initialCount: ${initialCount}.  Using default value of 0.`);
      return 0;
    }
    return parsedInitialCount;
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateCount = (value: number) => {
      if (value < min) {
        console.error(`Count ${value} is below the minimum value (${min}).`);
        setError(errorMessage || `Value must be at least ${min}`);
        return min;
      }
      if (value > max) {
        console.error(`Count ${value} exceeds the maximum value (${max}).`);
        setError(errorMessage || `Value must be no more than ${max}`);
        return max;
      }
      setError(null);
      return value;
    };

    // Validate initial count on mount and when min/max changes
    const parsedInitialCount = Number(initialCount);

    if (isNaN(parsedInitialCount)) {
      console.error(`Invalid initialCount: ${initialCount}.  Resetting to 0.`);
      setCount(0);
      return;
    }

    setCount((prevCount) => {
      const validatedCount = validateCount(parsedInitialCount);
      return validatedCount;
    });

  }, [initialCount, min, max, errorMessage]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount + incrementStep;
      if (isNaN(nextCount)) {
        setError("Increment resulted in NaN. Check incrementStep value.");
        return prevCount;
      }
      if (nextCount > max) {
        setError(errorMessage || `Cannot increment beyond maximum value of ${max}`);
        return prevCount; // Or return max if you want to clamp
      }
      setError(null);
      return nextCount;
    });
  }, [incrementStep, max, errorMessage]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount - decrementStep;
      if (isNaN(nextCount)) {
        setError("Decrement resulted in NaN. Check decrementStep value.");
        return prevCount;
      }
      if (nextCount < min) {
        setError(errorMessage || `Cannot decrement below minimum value of ${min}`);
        return prevCount; // Or return min if you want to clamp
      }
      setError(null);
      return nextCount;
    });
  }, [decrementStep, min, errorMessage]);

  const isIncrementDisabled = count >= max;
  const isDecrementDisabled = count <= min;

  return (
    <div>
      <p style={countStyle}>Count: {count}</p>
      {error && <div style={errorStyle}>{error}</div>}
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={isIncrementDisabled}
        style={isIncrementDisabled ? { ...buttonStyle, ...disabledButtonStyle } : buttonStyle}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={isDecrementDisabled}
        style={isDecrementDisabled ? { ...buttonStyle, ...disabledButtonStyle } : buttonStyle}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;