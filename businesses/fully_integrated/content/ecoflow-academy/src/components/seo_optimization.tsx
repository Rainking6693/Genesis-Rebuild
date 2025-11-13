import React, { useState, useCallback, useMemo, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  minCount?: number;
  maxCount?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
  /**
   * A function that returns a string to display as an error message.
   * If the function returns null or undefined, no error message is displayed.
   * The function receives the current count as an argument.
   */
  errorMessage?: (count: number) => string | null | undefined;
  /**
   * A boolean value that determines whether the input field should be displayed.
   * @default false
   */
  showInput?: boolean;
  /**
   * A function that formats the count value for display in the input field.
   * @param count The current count value.
   * @returns The formatted count value as a string.
   */
  formatCount?: (count: number) => string;
  /**
   * A function that parses the input value from the input field.
   * @param value The input value as a string.
   * @returns The parsed count value as a number.  If parsing fails, return the current count.
   */
  parseCount?: (value: string) => number;
  /**
   * A boolean value that determines whether the counter should wrap around when it reaches the min or max value.
   * @default false
   */
  wrapAround?: boolean;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  minCount = 0,
  maxCount = Infinity,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
  errorMessage,
  showInput = false,
  formatCount = (count) => count.toString(),
  parseCount = (value) => {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? initialCount : parsed;
  },
  wrapAround = false,
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const [inputValue, setInputValue] = useState<string>(formatCount(initialCount));

  // Use useMemo to avoid recreating the validation function on every render
  const validationConstraints = useMemo(() => ({ minCount, maxCount }), [minCount, maxCount]);

  const validateInput = useCallback(
    (value: number) => {
      if (value < validationConstraints.minCount) {
        return wrapAround ? validationConstraints.maxCount : validationConstraints.minCount;
      }

      if (value > validationConstraints.maxCount) {
        return wrapAround ? validationConstraints.minCount : validationConstraints.maxCount;
      }

      return value;
    },
    [validationConstraints, wrapAround]
  );

  // Use useCallback to memoize the increment and decrement functions
  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newValue = validateInput(prevCount + incrementStep);
      if (onCountChange && newValue !== prevCount) {
        onCountChange(newValue);
      }
      return newValue;
    });
  }, [incrementStep, validateInput, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newValue = validateInput(prevCount - incrementStep);
      if (onCountChange && newValue !== prevCount) {
        onCountChange(newValue);
      }
      return newValue;
    });
  }, [incrementStep, validateInput, onCountChange]);

  const isIncrementDisabled = useMemo(() => !wrapAround && count >= maxCount, [count, maxCount, wrapAround]);
  const isDecrementDisabled = useMemo(() => !wrapAround && count <= minCount, [count, minCount, wrapAround]);

  useEffect(() => {
    setInputValue(formatCount(count));
  }, [count, formatCount]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    },
    []
  );

  const handleInputBlur = useCallback(() => {
    const parsedValue = parseCount(inputValue);
    const validatedValue = validateInput(parsedValue);

    setCount(validatedValue);
    if (onCountChange) {
      onCountChange(validatedValue);
    }
    setInputValue(formatCount(validatedValue)); // Ensure input reflects validated value
  }, [inputValue, parseCount, validateInput, onCountChange, formatCount]);

  const errorMessageText = useMemo(() => errorMessage?.(count), [count, errorMessage]);

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {count}</p>
      {showInput && (
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          aria-label="Count Input"
        />
      )}
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={isIncrementDisabled}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={isDecrementDisabled}
      >
        Decrement
      </button>
      {errorMessageText && <p className="error-message" aria-live="assertive">{errorMessageText}</p>}
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useMemo, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  minCount?: number;
  maxCount?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onCountChange?: (count: number) => void;
  /**
   * A function that returns a string to display as an error message.
   * If the function returns null or undefined, no error message is displayed.
   * The function receives the current count as an argument.
   */
  errorMessage?: (count: number) => string | null | undefined;
  /**
   * A boolean value that determines whether the input field should be displayed.
   * @default false
   */
  showInput?: boolean;
  /**
   * A function that formats the count value for display in the input field.
   * @param count The current count value.
   * @returns The formatted count value as a string.
   */
  formatCount?: (count: number) => string;
  /**
   * A function that parses the input value from the input field.
   * @param value The input value as a string.
   * @returns The parsed count value as a number.  If parsing fails, return the current count.
   */
  parseCount?: (value: string) => number;
  /**
   * A boolean value that determines whether the counter should wrap around when it reaches the min or max value.
   * @default false
   */
  wrapAround?: boolean;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  minCount = 0,
  maxCount = Infinity,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
  errorMessage,
  showInput = false,
  formatCount = (count) => count.toString(),
  parseCount = (value) => {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? initialCount : parsed;
  },
  wrapAround = false,
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const [inputValue, setInputValue] = useState<string>(formatCount(initialCount));

  // Use useMemo to avoid recreating the validation function on every render
  const validationConstraints = useMemo(() => ({ minCount, maxCount }), [minCount, maxCount]);

  const validateInput = useCallback(
    (value: number) => {
      if (value < validationConstraints.minCount) {
        return wrapAround ? validationConstraints.maxCount : validationConstraints.minCount;
      }

      if (value > validationConstraints.maxCount) {
        return wrapAround ? validationConstraints.minCount : validationConstraints.maxCount;
      }

      return value;
    },
    [validationConstraints, wrapAround]
  );

  // Use useCallback to memoize the increment and decrement functions
  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newValue = validateInput(prevCount + incrementStep);
      if (onCountChange && newValue !== prevCount) {
        onCountChange(newValue);
      }
      return newValue;
    });
  }, [incrementStep, validateInput, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newValue = validateInput(prevCount - incrementStep);
      if (onCountChange && newValue !== prevCount) {
        onCountChange(newValue);
      }
      return newValue;
    });
  }, [incrementStep, validateInput, onCountChange]);

  const isIncrementDisabled = useMemo(() => !wrapAround && count >= maxCount, [count, maxCount, wrapAround]);
  const isDecrementDisabled = useMemo(() => !wrapAround && count <= minCount, [count, minCount, wrapAround]);

  useEffect(() => {
    setInputValue(formatCount(count));
  }, [count, formatCount]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    },
    []
  );

  const handleInputBlur = useCallback(() => {
    const parsedValue = parseCount(inputValue);
    const validatedValue = validateInput(parsedValue);

    setCount(validatedValue);
    if (onCountChange) {
      onCountChange(validatedValue);
    }
    setInputValue(formatCount(validatedValue)); // Ensure input reflects validated value
  }, [inputValue, parseCount, validateInput, onCountChange, formatCount]);

  const errorMessageText = useMemo(() => errorMessage?.(count), [count, errorMessage]);

  return (
    <div role="group" aria-label="Counter">
      <p aria-live="polite">Count: {count}</p>
      {showInput && (
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          aria-label="Count Input"
        />
      )}
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={isIncrementDisabled}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={isDecrementDisabled}
      >
        Decrement
      </button>
      {errorMessageText && <p className="error-message" aria-live="assertive">{errorMessageText}</p>}
    </div>
  );
};

export default Counter;