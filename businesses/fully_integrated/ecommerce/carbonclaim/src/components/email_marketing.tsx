import React, { useState, useEffect, useCallback, useRef } from 'react';

interface Props {
  /**
   * The initial count for the counter. Defaults to 0.
   */
  initialCount?: number;
  /**
   * The amount to increment or decrement the counter by. Defaults to 1.
   */
  incrementStep?: number;
  /**
   * A unique identifier for the counter, used for local storage.  If not provided, state is not persisted.
   */
  counterId?: string;
  /**
   * A callback function to be executed when the count changes.
   * @param newCount The new count value.
   */
  onCountChange?: (newCount: number) => void;
  /**
   * A minimum value for the counter.  The counter will not decrement below this value. Defaults to undefined (no minimum).
   */
  minValue?: number;
  /**
   * A maximum value for the counter. The counter will not increment above this value. Defaults to undefined (no maximum).
   */
  maxValue?: number;
  /**
   *  A function to render the counter's display.  Defaults to a simple paragraph.
   *  @param count The current count value.
   */
  renderCount?: (count: number) => React.ReactNode;
  /**
   * A function to render the increment button. Defaults to a simple button.
   * @param increment The increment function.
   */
  renderIncrement?: (increment: () => void) => React.ReactNode;
  /**
   * A function to render the decrement button. Defaults to a simple button.
   * @param decrement The decrement function.
   */
  renderDecrement?: (decrement: () => void) => React.ReactNode;
  /**
   * A message to display when localStorage is not available. Defaults to "Local storage is not available."
   */
  localStorageUnavailableMessage?: string;
}

/**
 * A simple counter component. Persists its state to local storage if a counterId is provided.
 */
const Counter: React.FC<Props> = ({
  initialCount = 0,
  incrementStep = 1,
  counterId,
  onCountChange,
  minValue,
  maxValue,
  renderCount,
  renderIncrement,
  renderDecrement,
  localStorageUnavailableMessage = 'Local storage is not available.',
}) => {
  const [count, setCount] = useState<number>(() => {
    if (counterId && typeof window !== 'undefined') {
      try {
        const storedCount = localStorage.getItem(`counter-${counterId}`);
        if (storedCount) {
          const parsedCount = parseInt(storedCount, 10);
          if (!isNaN(parsedCount)) {
            return parsedCount;
          } else {
            console.warn(
              `Invalid stored count for counterId "${counterId}". Using initialCount.`
            );
            return initialCount;
          }
        }
      } catch (error) {
        console.error(
          `Error reading from localStorage for counterId "${counterId}":`,
          error
        );
        return initialCount; // Fallback to initialCount in case of localStorage error
      }
    }
    return initialCount;
  });

  const isLocalStorageAvailable = useRef(typeof window !== 'undefined');

  useEffect(() => {
    if (typeof window === 'undefined') {
      isLocalStorageAvailable.current = false;
    }
  }, []);

  // Use useCallback to memoize the increment and decrement functions
  const increment = useCallback(() => {
    setCount((prevCount) => {
      let newValue = prevCount + incrementStep;

      if (maxValue !== undefined && newValue > maxValue) {
        newValue = maxValue;
      }

      return newValue;
    });
  }, [incrementStep, maxValue]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      let newValue = prevCount - incrementStep;

      if (minValue !== undefined && newValue < minValue) {
        newValue = minValue;
      }

      return newValue;
    });
  }, [incrementStep, minValue]);

  useEffect(() => {
    if (counterId && isLocalStorageAvailable.current) {
      try {
        localStorage.setItem(`counter-${counterId}`, count.toString());
      } catch (error) {
        console.error(
          `Error writing to localStorage for counterId "${counterId}":`,
          error
        );
      }
    }
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, counterId, onCountChange]);

  const renderDefaultCount = (currentCount: number) => (
    <p aria-live="polite">Count: {currentCount}</p>
  );

  const renderDefaultIncrement = (incrementHandler: () => void) => (
    <button onClick={incrementHandler} aria-label="Increment">
      Increment
    </button>
  );

  const renderDefaultDecrement = (decrementHandler: () => void) => (
    <button onClick={decrementHandler} aria-label="Decrement">
      Decrement
    </button>
  );

  const countDisplay = renderCount ? renderCount(count) : renderDefaultCount(count);
  const incrementButton = renderIncrement
    ? renderIncrement(increment)
    : renderDefaultIncrement(increment);
  const decrementButton = renderDecrement
    ? renderDecrement(decrement)
    : renderDefaultDecrement(decrement);

  return (
    <div>
      {isLocalStorageAvailable.current ? (
        <>
          {countDisplay}
          {incrementButton}
          {decrementButton}
        </>
      ) : (
        <p>{localStorageUnavailableMessage}</p>
      )}
    </div>
  );
};

export default Counter;

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface Props {
  /**
   * The initial count for the counter. Defaults to 0.
   */
  initialCount?: number;
  /**
   * The amount to increment or decrement the counter by. Defaults to 1.
   */
  incrementStep?: number;
  /**
   * A unique identifier for the counter, used for local storage.  If not provided, state is not persisted.
   */
  counterId?: string;
  /**
   * A callback function to be executed when the count changes.
   * @param newCount The new count value.
   */
  onCountChange?: (newCount: number) => void;
  /**
   * A minimum value for the counter.  The counter will not decrement below this value. Defaults to undefined (no minimum).
   */
  minValue?: number;
  /**
   * A maximum value for the counter. The counter will not increment above this value. Defaults to undefined (no maximum).
   */
  maxValue?: number;
  /**
   *  A function to render the counter's display.  Defaults to a simple paragraph.
   *  @param count The current count value.
   */
  renderCount?: (count: number) => React.ReactNode;
  /**
   * A function to render the increment button. Defaults to a simple button.
   * @param increment The increment function.
   */
  renderIncrement?: (increment: () => void) => React.ReactNode;
  /**
   * A function to render the decrement button. Defaults to a simple button.
   * @param decrement The decrement function.
   */
  renderDecrement?: (decrement: () => void) => React.ReactNode;
  /**
   * A message to display when localStorage is not available. Defaults to "Local storage is not available."
   */
  localStorageUnavailableMessage?: string;
}

/**
 * A simple counter component. Persists its state to local storage if a counterId is provided.
 */
const Counter: React.FC<Props> = ({
  initialCount = 0,
  incrementStep = 1,
  counterId,
  onCountChange,
  minValue,
  maxValue,
  renderCount,
  renderIncrement,
  renderDecrement,
  localStorageUnavailableMessage = 'Local storage is not available.',
}) => {
  const [count, setCount] = useState<number>(() => {
    if (counterId && typeof window !== 'undefined') {
      try {
        const storedCount = localStorage.getItem(`counter-${counterId}`);
        if (storedCount) {
          const parsedCount = parseInt(storedCount, 10);
          if (!isNaN(parsedCount)) {
            return parsedCount;
          } else {
            console.warn(
              `Invalid stored count for counterId "${counterId}". Using initialCount.`
            );
            return initialCount;
          }
        }
      } catch (error) {
        console.error(
          `Error reading from localStorage for counterId "${counterId}":`,
          error
        );
        return initialCount; // Fallback to initialCount in case of localStorage error
      }
    }
    return initialCount;
  });

  const isLocalStorageAvailable = useRef(typeof window !== 'undefined');

  useEffect(() => {
    if (typeof window === 'undefined') {
      isLocalStorageAvailable.current = false;
    }
  }, []);

  // Use useCallback to memoize the increment and decrement functions
  const increment = useCallback(() => {
    setCount((prevCount) => {
      let newValue = prevCount + incrementStep;

      if (maxValue !== undefined && newValue > maxValue) {
        newValue = maxValue;
      }

      return newValue;
    });
  }, [incrementStep, maxValue]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      let newValue = prevCount - incrementStep;

      if (minValue !== undefined && newValue < minValue) {
        newValue = minValue;
      }

      return newValue;
    });
  }, [incrementStep, minValue]);

  useEffect(() => {
    if (counterId && isLocalStorageAvailable.current) {
      try {
        localStorage.setItem(`counter-${counterId}`, count.toString());
      } catch (error) {
        console.error(
          `Error writing to localStorage for counterId "${counterId}":`,
          error
        );
      }
    }
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, counterId, onCountChange]);

  const renderDefaultCount = (currentCount: number) => (
    <p aria-live="polite">Count: {currentCount}</p>
  );

  const renderDefaultIncrement = (incrementHandler: () => void) => (
    <button onClick={incrementHandler} aria-label="Increment">
      Increment
    </button>
  );

  const renderDefaultDecrement = (decrementHandler: () => void) => (
    <button onClick={decrementHandler} aria-label="Decrement">
      Decrement
    </button>
  );

  const countDisplay = renderCount ? renderCount(count) : renderDefaultCount(count);
  const incrementButton = renderIncrement
    ? renderIncrement(increment)
    : renderDefaultIncrement(increment);
  const decrementButton = renderDecrement
    ? renderDecrement(decrement)
    : renderDefaultDecrement(decrement);

  return (
    <div>
      {isLocalStorageAvailable.current ? (
        <>
          {countDisplay}
          {incrementButton}
          {decrementButton}
        </>
      ) : (
        <p>{localStorageUnavailableMessage}</p>
      )}
    </div>
  );
};

export default Counter;