import React, { useState, useCallback, useRef, useEffect } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelPrefix?: string;
  /** Custom class name for styling. */
  className?: string;
  /** Callback function when the count changes. */
  onChange?: (newCount: number) => void;
  /** Debounce time in milliseconds for onChange callback. */
  onChangeDebounce?: number;
}

/**
 * A simple counter component with increment and decrement functionality, including bounds and accessibility improvements.
 *
 * @param {CounterProps} props - The component's props.
 * @param {number} props.initialCount - The initial value of the counter (default: 0).
 * @param {number} props.incrementStep - The amount to increment/decrement the counter by (default: 1).
 * @param {number} props.min - The minimum allowed value for the counter.
 * @param {number} props.max - The maximum allowed value for the counter.
 * @param {string} props.ariaLabelPrefix - Prefix for aria-labels to allow for multiple counters on a page.
 * @param {string} props.className - Custom class name for styling.
 * @param {Function} props.onChange - Callback function when the count changes.
 * @param {number} props.onChangeDebounce - Debounce time in milliseconds for onChange callback.
 * @returns {JSX.Element} The rendered counter component.
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min = -Infinity,
  max = Infinity,
  ariaLabelPrefix = 'counter',
  className = '',
  onChange,
  onChangeDebounce = 0,
}) => {
  const [count, setCount] = useState(initialCount);
  const [isIncrementing, setIsIncrementing] = useState(false);
  const [isDecrementing, setIsDecrementing] = useState(false);
  const countRef = useRef(count);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    countRef.current = count;
  }, [count]);

  useEffect(() => {
    if (onChange) {
      if (onChangeDebounce > 0) {
        if (timeoutIdRef.current) {
          clearTimeout(timeoutIdRef.current);
        }
        timeoutIdRef.current = setTimeout(() => {
          onChange(count);
          timeoutIdRef.current = null;
        }, onChangeDebounce);
      } else {
        onChange(count);
      }
    }

    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, [count, onChange, onChangeDebounce]);

  const increment = useCallback(() => {
    setIsIncrementing(true);
    setCount((prevCount) => {
      const newValue = prevCount + incrementStep;
      if (newValue <= max) {
        return newValue;
      } else {
        return prevCount; // Reached max, don't increment
      }
    });
    setTimeout(() => setIsIncrementing(false), 100); // Small delay for visual feedback
  }, [incrementStep, max]);

  const decrement = useCallback(() => {
    setIsDecrementing(true);
    setCount((prevCount) => {
      const newValue = prevCount - incrementStep;
      if (newValue >= min) {
        return newValue;
      } else {
        return prevCount; // Reached min, don't decrement
      }
    });
    setTimeout(() => setIsDecrementing(false), 100); // Small delay for visual feedback
  }, [incrementStep, min]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault(); // Prevent scrolling the page
        if (!isMax) {
          increment();
        }
      } else if (event.key === 'ArrowDown') {
        event.preventDefault(); // Prevent scrolling the page
        if (!isMin) {
          decrement();
        }
      }
    },
    [increment, decrement, isMax, isMin]
  );

  const isMin = count <= min;
  const isMax = count >= max;

  const incrementButtonRef = useRef<HTMLButtonElement>(null);
  const decrementButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className={`counter-container ${className}`} onKeyDown={handleKeyDown} tabIndex={0} aria-label={`${ariaLabelPrefix} Counter`}>
      <p aria-live="polite" id={`${ariaLabelPrefix}-value`}>
        {ariaLabelPrefix}: {count}
      </p>
      <div className="counter-buttons">
        <button
          ref={incrementButtonRef}
          onClick={increment}
          aria-label={`${ariaLabelPrefix} Increment`}
          aria-describedby={`${ariaLabelPrefix}-value`}
          disabled={isMax}
          style={{ opacity: isMax ? 0.5 : 1, cursor: isMax ? 'not-allowed' : 'pointer' }}
        >
          Increment
        </button>
        <button
          ref={decrementButtonRef}
          onClick={decrement}
          aria-label={`${ariaLabelPrefix} Decrement`}
          aria-describedby={`${ariaLabelPrefix}-value`}
          disabled={isMin}
          style={{ opacity: isMin ? 0.5 : 1, cursor: isMin ? 'not-allowed' : 'pointer' }}
        >
          Decrement
        </button>
      </div>
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
  ariaLabelPrefix?: string;
  /** Custom class name for styling. */
  className?: string;
  /** Callback function when the count changes. */
  onChange?: (newCount: number) => void;
  /** Debounce time in milliseconds for onChange callback. */
  onChangeDebounce?: number;
}

/**
 * A simple counter component with increment and decrement functionality, including bounds and accessibility improvements.
 *
 * @param {CounterProps} props - The component's props.
 * @param {number} props.initialCount - The initial value of the counter (default: 0).
 * @param {number} props.incrementStep - The amount to increment/decrement the counter by (default: 1).
 * @param {number} props.min - The minimum allowed value for the counter.
 * @param {number} props.max - The maximum allowed value for the counter.
 * @param {string} props.ariaLabelPrefix - Prefix for aria-labels to allow for multiple counters on a page.
 * @param {string} props.className - Custom class name for styling.
 * @param {Function} props.onChange - Callback function when the count changes.
 * @param {number} props.onChangeDebounce - Debounce time in milliseconds for onChange callback.
 * @returns {JSX.Element} The rendered counter component.
 */
const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min = -Infinity,
  max = Infinity,
  ariaLabelPrefix = 'counter',
  className = '',
  onChange,
  onChangeDebounce = 0,
}) => {
  const [count, setCount] = useState(initialCount);
  const [isIncrementing, setIsIncrementing] = useState(false);
  const [isDecrementing, setIsDecrementing] = useState(false);
  const countRef = useRef(count);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    countRef.current = count;
  }, [count]);

  useEffect(() => {
    if (onChange) {
      if (onChangeDebounce > 0) {
        if (timeoutIdRef.current) {
          clearTimeout(timeoutIdRef.current);
        }
        timeoutIdRef.current = setTimeout(() => {
          onChange(count);
          timeoutIdRef.current = null;
        }, onChangeDebounce);
      } else {
        onChange(count);
      }
    }

    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, [count, onChange, onChangeDebounce]);

  const increment = useCallback(() => {
    setIsIncrementing(true);
    setCount((prevCount) => {
      const newValue = prevCount + incrementStep;
      if (newValue <= max) {
        return newValue;
      } else {
        return prevCount; // Reached max, don't increment
      }
    });
    setTimeout(() => setIsIncrementing(false), 100); // Small delay for visual feedback
  }, [incrementStep, max]);

  const decrement = useCallback(() => {
    setIsDecrementing(true);
    setCount((prevCount) => {
      const newValue = prevCount - incrementStep;
      if (newValue >= min) {
        return newValue;
      } else {
        return prevCount; // Reached min, don't decrement
      }
    });
    setTimeout(() => setIsDecrementing(false), 100); // Small delay for visual feedback
  }, [incrementStep, min]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault(); // Prevent scrolling the page
        if (!isMax) {
          increment();
        }
      } else if (event.key === 'ArrowDown') {
        event.preventDefault(); // Prevent scrolling the page
        if (!isMin) {
          decrement();
        }
      }
    },
    [increment, decrement, isMax, isMin]
  );

  const isMin = count <= min;
  const isMax = count >= max;

  const incrementButtonRef = useRef<HTMLButtonElement>(null);
  const decrementButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className={`counter-container ${className}`} onKeyDown={handleKeyDown} tabIndex={0} aria-label={`${ariaLabelPrefix} Counter`}>
      <p aria-live="polite" id={`${ariaLabelPrefix}-value`}>
        {ariaLabelPrefix}: {count}
      </p>
      <div className="counter-buttons">
        <button
          ref={incrementButtonRef}
          onClick={increment}
          aria-label={`${ariaLabelPrefix} Increment`}
          aria-describedby={`${ariaLabelPrefix}-value`}
          disabled={isMax}
          style={{ opacity: isMax ? 0.5 : 1, cursor: isMax ? 'not-allowed' : 'pointer' }}
        >
          Increment
        </button>
        <button
          ref={decrementButtonRef}
          onClick={decrement}
          aria-label={`${ariaLabelPrefix} Decrement`}
          aria-describedby={`${ariaLabelPrefix}-value`}
          disabled={isMin}
          style={{ opacity: isMin ? 0.5 : 1, cursor: isMin ? 'not-allowed' : 'pointer' }}
        >
          Decrement
        </button>
      </div>
    </div>
  );
};

export default Counter;