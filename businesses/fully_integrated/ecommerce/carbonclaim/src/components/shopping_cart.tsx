import React, { useState, useCallback, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  minCount?: number;
  maxCount?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  ariaLabelInput?: string;
  onChange?: (count: number) => void;
  onBlur?: () => void; // Callback for when the input loses focus
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  minCount = 0,
  maxCount = Infinity,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  ariaLabelInput = 'Counter Input',
  onChange,
  onBlur,
}) => {
  const [count, setCount] = useState(initialCount);
  const [inputValue, setInputValue] = useState(String(initialCount)); // Store input value as string

  useEffect(() => {
    setInputValue(String(count)); // Sync input value with count
  }, [count]);

  useEffect(() => {
    if (onChange) {
      onChange(count);
    }
  }, [count, onChange]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = Math.min(prevCount + incrementStep, maxCount);
      return newCount;
    });
  }, [incrementStep, maxCount]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = Math.max(prevCount - incrementStep, minCount);
      return newCount;
    });
  }, [incrementStep, minCount]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setInputValue(value);

      // Allow only numbers and handle empty input
      if (/^\d*$/.test(value)) {
        if (value === "") {
          setCount(minCount); // Reset to minCount if input is cleared
        } else {
          const parsedValue = parseInt(value, 10);
          if (!isNaN(parsedValue)) {
            setCount(parsedValue); // Update state immediately for responsiveness
          }
        }
      }
    },
    [minCount]
  );

  const handleInputBlur = useCallback(() => {
    let validatedValue = count;

    if (count < minCount) {
      validatedValue = minCount;
    } else if (count > maxCount) {
      validatedValue = maxCount;
    }

    setCount(validatedValue);
    setInputValue(String(validatedValue)); // Ensure input reflects validated value

    if (onBlur) {
      onBlur();
    }
  }, [count, minCount, maxCount, onBlur]);

  return (
    <div>
      <label htmlFor="counter-input">Count:</label>
      <input
        type="text" // Use text input to allow controlled input
        id="counter-input"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        aria-label={ariaLabelInput}
        inputMode="numeric" // Optimize for numeric input on mobile
      />
      <button onClick={increment} aria-label={ariaLabelIncrement} disabled={count >= maxCount}>
        Increment
      </button>
      <button onClick={decrement} aria-label={ariaLabelDecrement} disabled={count <= minCount}>
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
  minCount?: number;
  maxCount?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  ariaLabelInput?: string;
  onChange?: (count: number) => void;
  onBlur?: () => void; // Callback for when the input loses focus
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  minCount = 0,
  maxCount = Infinity,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  ariaLabelInput = 'Counter Input',
  onChange,
  onBlur,
}) => {
  const [count, setCount] = useState(initialCount);
  const [inputValue, setInputValue] = useState(String(initialCount)); // Store input value as string

  useEffect(() => {
    setInputValue(String(count)); // Sync input value with count
  }, [count]);

  useEffect(() => {
    if (onChange) {
      onChange(count);
    }
  }, [count, onChange]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newCount = Math.min(prevCount + incrementStep, maxCount);
      return newCount;
    });
  }, [incrementStep, maxCount]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = Math.max(prevCount - incrementStep, minCount);
      return newCount;
    });
  }, [incrementStep, minCount]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setInputValue(value);

      // Allow only numbers and handle empty input
      if (/^\d*$/.test(value)) {
        if (value === "") {
          setCount(minCount); // Reset to minCount if input is cleared
        } else {
          const parsedValue = parseInt(value, 10);
          if (!isNaN(parsedValue)) {
            setCount(parsedValue); // Update state immediately for responsiveness
          }
        }
      }
    },
    [minCount]
  );

  const handleInputBlur = useCallback(() => {
    let validatedValue = count;

    if (count < minCount) {
      validatedValue = minCount;
    } else if (count > maxCount) {
      validatedValue = maxCount;
    }

    setCount(validatedValue);
    setInputValue(String(validatedValue)); // Ensure input reflects validated value

    if (onBlur) {
      onBlur();
    }
  }, [count, minCount, maxCount, onBlur]);

  return (
    <div>
      <label htmlFor="counter-input">Count:</label>
      <input
        type="text" // Use text input to allow controlled input
        id="counter-input"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        aria-label={ariaLabelInput}
        inputMode="numeric" // Optimize for numeric input on mobile
      />
      <button onClick={increment} aria-label={ariaLabelIncrement} disabled={count >= maxCount}>
        Increment
      </button>
      <button onClick={decrement} aria-label={ariaLabelDecrement} disabled={count <= minCount}>
        Decrement
      </button>
    </div>
  );
};

export default Counter;