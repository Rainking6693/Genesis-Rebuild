import React, { useState, useCallback, useEffect, useRef } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  onChange?: (count: number) => void;
  id?: string; // Unique ID for the counter
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min = -Infinity,
  max = Infinity,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onChange,
  id,
}) => {
  const [count, setCount] = useState(initialCount);
  const incrementButtonRef = useRef<HTMLButtonElement>(null);
  const decrementButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (onChange) {
      onChange(count);
    }
  }, [count, onChange]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newValue = prevCount + incrementStep;
      if (newValue <= max) {
        return newValue;
      }
      return prevCount;
    });
  }, [incrementStep, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newValue = prevCount - incrementStep;
      if (newValue >= min) {
        return newValue;
      }
      return prevCount;
    });
  }, [incrementStep, min]);

  // Consider using a single handler for both increment and decrement
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        (event.target as HTMLButtonElement).click();
      }
    },
    []
  );

  // Accessibility improvements:  Use aria-live for dynamic updates
  return (
    <div role="group" aria-label="Counter">
      <div aria-live="polite" className="counter-value">
        {/* Added a class for styling and potential screen reader customization */}
        Count: {count}
      </div>
      <button
        ref={incrementButtonRef}
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={count >= max}
        onKeyDown={handleKeyDown}
        data-testid={`${id}-increment`} // Add test ids
      >
        Increment
      </button>
      <button
        ref={decrementButtonRef}
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={count <= min}
        onKeyDown={handleKeyDown}
        data-testid={`${id}-decrement`} // Add test ids
      >
        Decrement
      </button>
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
  onChange?: (count: number) => void;
  id?: string; // Unique ID for the counter
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min = -Infinity,
  max = Infinity,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onChange,
  id,
}) => {
  const [count, setCount] = useState(initialCount);
  const incrementButtonRef = useRef<HTMLButtonElement>(null);
  const decrementButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (onChange) {
      onChange(count);
    }
  }, [count, onChange]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const newValue = prevCount + incrementStep;
      if (newValue <= max) {
        return newValue;
      }
      return prevCount;
    });
  }, [incrementStep, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newValue = prevCount - incrementStep;
      if (newValue >= min) {
        return newValue;
      }
      return prevCount;
    });
  }, [incrementStep, min]);

  // Consider using a single handler for both increment and decrement
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        (event.target as HTMLButtonElement).click();
      }
    },
    []
  );

  // Accessibility improvements:  Use aria-live for dynamic updates
  return (
    <div role="group" aria-label="Counter">
      <div aria-live="polite" className="counter-value">
        {/* Added a class for styling and potential screen reader customization */}
        Count: {count}
      </div>
      <button
        ref={incrementButtonRef}
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={count >= max}
        onKeyDown={handleKeyDown}
        data-testid={`${id}-increment`} // Add test ids
      >
        Increment
      </button>
      <button
        ref={decrementButtonRef}
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={count <= min}
        onKeyDown={handleKeyDown}
        data-testid={`${id}-decrement`} // Add test ids
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;