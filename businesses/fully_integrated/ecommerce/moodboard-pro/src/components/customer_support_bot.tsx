import React, { useState, useCallback, useEffect } from 'react';

interface CustomerSupportBotProps {
  initialCount?: number;
  incrementBy?: number;
  minCount?: number;
  maxCount?: number;
  onCountChange?: (count: number) => void;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  isDisabled?: boolean;
  /**
   * Optional CSS class name to apply to the container div.
   */
  className?: string;
  /**
   * Optional style object to apply to the container div.
   */
  style?: React.CSSProperties;
}

/**
 * A simple counter component for demonstration purposes. In a real customer support bot,
 * this would be replaced with actual bot functionality (e.g., interacting with a knowledge base,
 * handling user input, etc.). This example focuses on React best practices and code quality.
 */
const CustomerSupportBot: React.FC<CustomerSupportBotProps> = ({
  initialCount = 0,
  incrementBy = 1,
  minCount = Number.MIN_SAFE_INTEGER,
  maxCount = Number.MAX_SAFE_INTEGER,
  onCountChange,
  ariaLabelIncrement = 'Increment count',
  ariaLabelDecrement = 'Decrement count',
  isDisabled = false,
  className,
  style,
}) => {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    // Validate props
    if (typeof initialCount !== 'number' || !Number.isFinite(initialCount)) {
      console.error('initialCount must be a finite number.  Using default value.');
      setCount(0);
      return;
    }

    if (typeof incrementBy !== 'number' || !Number.isFinite(incrementBy)) {
      console.error('incrementBy must be a finite number. Using default value.');
      incrementBy = 1; // Reset to default to prevent NaN propagation
    }

    if (typeof minCount !== 'number' || !Number.isFinite(minCount)) {
      console.error('minCount must be a finite number. Using default value.');
      minCount = Number.MIN_SAFE_INTEGER;
    }

    if (typeof maxCount !== 'number' || !Number.isFinite(maxCount)) {
      console.error('maxCount must be a finite number. Using default value.');
      maxCount = Number.MAX_SAFE_INTEGER;
    }

    if (minCount >= maxCount) {
      console.error('minCount must be less than maxCount.  Using default values.');
      minCount = Number.MIN_SAFE_INTEGER;
      maxCount = Number.MAX_SAFE_INTEGER;
    }

    // Ensure initialCount is within bounds
    let validatedInitialCount = initialCount;
    if (validatedInitialCount < minCount) {
      validatedInitialCount = minCount;
    } else if (validatedInitialCount > maxCount) {
      validatedInitialCount = maxCount;
    }

    if (validatedInitialCount !== count) {
      setCount(validatedInitialCount);
    }

  }, [initialCount, minCount, maxCount, count]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      if (isDisabled) return prevCount; // Prevent increment if disabled

      let newCount = prevCount + incrementBy;

      if (newCount > maxCount) {
        newCount = maxCount;
      }

      if (newCount !== prevCount && onCountChange) {
        onCountChange(newCount);
      }

      return newCount;
    });
  }, [incrementBy, maxCount, onCountChange, isDisabled]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      if (isDisabled) return prevCount; // Prevent decrement if disabled

      let newCount = prevCount - incrementBy;

      if (newCount < minCount) {
        newCount = minCount;
      }

      if (newCount !== prevCount && onCountChange) {
        onCountChange(newCount);
      }

      return newCount;
    });
  }, [incrementBy, minCount, onCountChange, isDisabled]);

  const isIncrementDisabled = isDisabled || count >= maxCount;
  const isDecrementDisabled = isDisabled || count <= minCount;

  return (
    <div className={className} style={style}>
      <p aria-live="polite">Count: {count}</p>
      <button
        onClick={increment}
        disabled={isIncrementDisabled}
        aria-label={ariaLabelIncrement}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        disabled={isDecrementDisabled}
        aria-label={ariaLabelDecrement}
      >
        Decrement
      </button>
    </div>
  );
};

export default CustomerSupportBot;

import React, { useState, useCallback, useEffect } from 'react';

interface CustomerSupportBotProps {
  initialCount?: number;
  incrementBy?: number;
  minCount?: number;
  maxCount?: number;
  onCountChange?: (count: number) => void;
  ariaLabelIncrement?: string;
  ariaLabelDecrement?: string;
  isDisabled?: boolean;
  /**
   * Optional CSS class name to apply to the container div.
   */
  className?: string;
  /**
   * Optional style object to apply to the container div.
   */
  style?: React.CSSProperties;
}

/**
 * A simple counter component for demonstration purposes. In a real customer support bot,
 * this would be replaced with actual bot functionality (e.g., interacting with a knowledge base,
 * handling user input, etc.). This example focuses on React best practices and code quality.
 */
const CustomerSupportBot: React.FC<CustomerSupportBotProps> = ({
  initialCount = 0,
  incrementBy = 1,
  minCount = Number.MIN_SAFE_INTEGER,
  maxCount = Number.MAX_SAFE_INTEGER,
  onCountChange,
  ariaLabelIncrement = 'Increment count',
  ariaLabelDecrement = 'Decrement count',
  isDisabled = false,
  className,
  style,
}) => {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    // Validate props
    if (typeof initialCount !== 'number' || !Number.isFinite(initialCount)) {
      console.error('initialCount must be a finite number.  Using default value.');
      setCount(0);
      return;
    }

    if (typeof incrementBy !== 'number' || !Number.isFinite(incrementBy)) {
      console.error('incrementBy must be a finite number. Using default value.');
      incrementBy = 1; // Reset to default to prevent NaN propagation
    }

    if (typeof minCount !== 'number' || !Number.isFinite(minCount)) {
      console.error('minCount must be a finite number. Using default value.');
      minCount = Number.MIN_SAFE_INTEGER;
    }

    if (typeof maxCount !== 'number' || !Number.isFinite(maxCount)) {
      console.error('maxCount must be a finite number. Using default value.');
      maxCount = Number.MAX_SAFE_INTEGER;
    }

    if (minCount >= maxCount) {
      console.error('minCount must be less than maxCount.  Using default values.');
      minCount = Number.MIN_SAFE_INTEGER;
      maxCount = Number.MAX_SAFE_INTEGER;
    }

    // Ensure initialCount is within bounds
    let validatedInitialCount = initialCount;
    if (validatedInitialCount < minCount) {
      validatedInitialCount = minCount;
    } else if (validatedInitialCount > maxCount) {
      validatedInitialCount = maxCount;
    }

    if (validatedInitialCount !== count) {
      setCount(validatedInitialCount);
    }

  }, [initialCount, minCount, maxCount, count]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      if (isDisabled) return prevCount; // Prevent increment if disabled

      let newCount = prevCount + incrementBy;

      if (newCount > maxCount) {
        newCount = maxCount;
      }

      if (newCount !== prevCount && onCountChange) {
        onCountChange(newCount);
      }

      return newCount;
    });
  }, [incrementBy, maxCount, onCountChange, isDisabled]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      if (isDisabled) return prevCount; // Prevent decrement if disabled

      let newCount = prevCount - incrementBy;

      if (newCount < minCount) {
        newCount = minCount;
      }

      if (newCount !== prevCount && onCountChange) {
        onCountChange(newCount);
      }

      return newCount;
    });
  }, [incrementBy, minCount, onCountChange, isDisabled]);

  const isIncrementDisabled = isDisabled || count >= maxCount;
  const isDecrementDisabled = isDisabled || count <= minCount;

  return (
    <div className={className} style={style}>
      <p aria-live="polite">Count: {count}</p>
      <button
        onClick={increment}
        disabled={isIncrementDisabled}
        aria-label={ariaLabelIncrement}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        disabled={isDecrementDisabled}
        aria-label={ariaLabelDecrement}
      >
        Decrement
      </button>
    </div>
  );
};

export default CustomerSupportBot;