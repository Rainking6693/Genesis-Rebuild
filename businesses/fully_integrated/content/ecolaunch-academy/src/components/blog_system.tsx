import React, { useState, useCallback, useRef, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  min?: number;
  max?: number;
  step?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  className?: string;
  onCountChange?: (newCount: number) => void;
  inputAriaLabel?: string;
  incrementButtonClassName?: string;
  decrementButtonClassName?: string;
  inputClassName?: string;
  disabled?: boolean;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  className = '',
  onCountChange,
  inputAriaLabel = 'Counter Input',
  incrementButtonClassName = '',
  decrementButtonClassName = '',
  inputClassName = '',
  disabled = false,
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const [inputValue, setInputValue] = useState<string>(String(initialCount)); // Store input value as string
  const [isInputValid, setIsInputValid] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCount(initialCount);
    setInputValue(String(initialCount));
  }, [initialCount]);

  const increment = useCallback(() => {
    if (disabled) return;
    setCount((prevCount) => {
      const newCount = prevCount + step;
      if (newCount <= max) {
        setInputValue(String(newCount));
        onCountChange?.(newCount);
        return newCount;
      } else {
        setInputValue(String(prevCount));
        return prevCount;
      }
    });
  }, [step, max, onCountChange, disabled]);

  const decrement = useCallback(() => {
    if (disabled) return;

    setCount((prevCount) => {
      const newCount = prevCount - step;
      if (newCount >= min) {
        setInputValue(String(newCount));
        onCountChange?.(newCount);
        return newCount;
      } else {
        setInputValue(String(prevCount));
        return prevCount;
      }
    });
  }, [step, min, onCountChange, disabled]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setInputValue(value);

      if (value === '' || value === '-') {
          return; // Allow empty input or negative sign for later parsing
      }

      const newValue = Number(value);

      if (isNaN(newValue)) {
        setIsInputValid(false);
        return;
      }

      setIsInputValid(true);

      if (newValue >= min && newValue <= max) {
        setCount(newValue);
        onCountChange?.(newValue);
      } else {
        console.warn(`Input value ${newValue} is out of range (${min}-${max}).`);
      }
    },
    [min, max, onCountChange]
  );

  const handleInputBlur = useCallback(() => {
    if (inputValue === '' || inputValue === '-') {
      setInputValue(String(count)); // Revert to previous count if input is empty or just a negative sign
      return;
    }

    const newValue = Number(inputValue);

    if (isNaN(newValue)) {
      setInputValue(String(count)); // Revert to previous count if input is invalid
      setIsInputValid(false);
      return;
    }

    setIsInputValid(true);

    if (newValue < min) {
      setCount(min);
      setInputValue(String(min));
      onCountChange?.(min);
    } else if (newValue > max) {
      setCount(max);
      setInputValue(String(max));
      onCountChange?.(max);
    } else {
      setCount(newValue);
      onCountChange?.(newValue);
    }
  }, [count, inputValue, min, max, onCountChange]);

  return (
    <div className={`counter-container ${className}`}>
      <label htmlFor="counter-input">Count:</label>
      <input
        ref={inputRef}
        type="text" // Use text type to allow for empty input and "-"
        id="counter-input"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        min={min}
        max={max}
        aria-label={inputAriaLabel}
        className={inputClassName}
        disabled={disabled}
      />
      {!isInputValid && (
        <div className="error-message" aria-live="polite">
          Invalid input. Please enter a number.
        </div>
      )}
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={disabled || count >= max}
        className={incrementButtonClassName}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={disabled || count <= min}
        className={decrementButtonClassName}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useRef, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  min?: number;
  max?: number;
  step?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  className?: string;
  onCountChange?: (newCount: number) => void;
  inputAriaLabel?: string;
  incrementButtonClassName?: string;
  decrementButtonClassName?: string;
  inputClassName?: string;
  disabled?: boolean;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  className = '',
  onCountChange,
  inputAriaLabel = 'Counter Input',
  incrementButtonClassName = '',
  decrementButtonClassName = '',
  inputClassName = '',
  disabled = false,
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const [inputValue, setInputValue] = useState<string>(String(initialCount)); // Store input value as string
  const [isInputValid, setIsInputValid] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCount(initialCount);
    setInputValue(String(initialCount));
  }, [initialCount]);

  const increment = useCallback(() => {
    if (disabled) return;
    setCount((prevCount) => {
      const newCount = prevCount + step;
      if (newCount <= max) {
        setInputValue(String(newCount));
        onCountChange?.(newCount);
        return newCount;
      } else {
        setInputValue(String(prevCount));
        return prevCount;
      }
    });
  }, [step, max, onCountChange, disabled]);

  const decrement = useCallback(() => {
    if (disabled) return;

    setCount((prevCount) => {
      const newCount = prevCount - step;
      if (newCount >= min) {
        setInputValue(String(newCount));
        onCountChange?.(newCount);
        return newCount;
      } else {
        setInputValue(String(prevCount));
        return prevCount;
      }
    });
  }, [step, min, onCountChange, disabled]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setInputValue(value);

      if (value === '' || value === '-') {
          return; // Allow empty input or negative sign for later parsing
      }

      const newValue = Number(value);

      if (isNaN(newValue)) {
        setIsInputValid(false);
        return;
      }

      setIsInputValid(true);

      if (newValue >= min && newValue <= max) {
        setCount(newValue);
        onCountChange?.(newValue);
      } else {
        console.warn(`Input value ${newValue} is out of range (${min}-${max}).`);
      }
    },
    [min, max, onCountChange]
  );

  const handleInputBlur = useCallback(() => {
    if (inputValue === '' || inputValue === '-') {
      setInputValue(String(count)); // Revert to previous count if input is empty or just a negative sign
      return;
    }

    const newValue = Number(inputValue);

    if (isNaN(newValue)) {
      setInputValue(String(count)); // Revert to previous count if input is invalid
      setIsInputValid(false);
      return;
    }

    setIsInputValid(true);

    if (newValue < min) {
      setCount(min);
      setInputValue(String(min));
      onCountChange?.(min);
    } else if (newValue > max) {
      setCount(max);
      setInputValue(String(max));
      onCountChange?.(max);
    } else {
      setCount(newValue);
      onCountChange?.(newValue);
    }
  }, [count, inputValue, min, max, onCountChange]);

  return (
    <div className={`counter-container ${className}`}>
      <label htmlFor="counter-input">Count:</label>
      <input
        ref={inputRef}
        type="text" // Use text type to allow for empty input and "-"
        id="counter-input"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        min={min}
        max={max}
        aria-label={inputAriaLabel}
        className={inputClassName}
        disabled={disabled}
      />
      {!isInputValid && (
        <div className="error-message" aria-live="polite">
          Invalid input. Please enter a number.
        </div>
      )}
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={disabled || count >= max}
        className={incrementButtonClassName}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={disabled || count <= min}
        className={decrementButtonClassName}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;