import React, { useState, useEffect, useCallback, useRef } from 'react';

interface CounterProps {
  /** The initial value of the counter. Defaults to 0. */
  initialCount?: number;
  /** The amount to increment or decrement the counter by. Defaults to 1. */
  incrementStep?: number;
  /** The minimum value the counter can have. If undefined, there is no minimum. */
  min?: number;
  /** The maximum value the counter can have. If undefined, there is no maximum. */
  max?: number;
  /** A callback function that is called when the counter value changes. */
  onCountChange?: (count: number) => void;
  /** Aria label for the increment button. Defaults to 'Increment'. */
  ariaLabelIncrement?: string;
  /** Aria label for the decrement button. Defaults to 'Decrement'. */
  ariaLabelDecrement?: string;
  /** Whether the counter is disabled. Defaults to false. */
  disabled?: boolean;
  /** Custom CSS class for the container. */
  containerClassName?: string;
  /** Custom CSS class for the count display. */
  countClassName?: string;
  /** Custom CSS class for the increment button. */
  incrementButtonClassName?: string;
  /** Custom CSS class for the decrement button. */
  decrementButtonClassName?: string;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min,
  max,
  onCountChange,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  disabled = false,
  containerClassName,
  countClassName,
  incrementButtonClassName,
  decrementButtonClassName,
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const isFirstRender = useRef(true);
  const [isIncrementDisabled, setIsIncrementDisabled] = useState(disabled || (max !== undefined && initialCount >= max));
  const [isDecrementDisabled, setIsDecrementDisabled] = useState(disabled || (min !== undefined && initialCount <= min));

  const validateCount = useCallback(
    (newCount: number): number => {
      let validatedCount = newCount;
      if (min !== undefined && newCount < min) {
        validatedCount = min;
      }
      if (max !== undefined && newCount > max) {
        validatedCount = max;
      }
      return validatedCount;
    },
    [min, max]
  );

  useEffect(() => {
    const validatedCount = validateCount(count);
    if (validatedCount !== count) {
      setCount(validatedCount);
    }
  }, [count, validateCount]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  useEffect(() => {
    setIsIncrementDisabled(disabled || (max !== undefined && count >= max));
    setIsDecrementDisabled(disabled || (min !== undefined && count <= min));
  }, [count, max, min, disabled]);

  const increment = useCallback(() => {
    if (disabled || isIncrementDisabled) return;
    setCount((prevCount) => {
      const newCount = prevCount + incrementStep;
      return validateCount(newCount);
    });
  }, [incrementStep, validateCount, disabled, isIncrementDisabled]);

  const decrement = useCallback(() => {
    if (disabled || isDecrementDisabled) return;
    setCount((prevCount) => {
      const newCount = prevCount - incrementStep;
      return validateCount(newCount);
    });
  }, [incrementStep, validateCount, disabled, isDecrementDisabled]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault(); // Prevent scrolling
        if (event.currentTarget.name === 'increment' && !isIncrementDisabled) {
          increment();
        } else if (event.currentTarget.name === 'decrement' && !isDecrementDisabled) {
          decrement();
        }
      }
    },
    [increment, decrement, disabled, isIncrementDisabled, isDecrementDisabled]
  );

  return (
    <div className={containerClassName}>
      <p aria-live="polite" className={countClassName}>
        Count: {count}
      </p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={isIncrementDisabled}
        onKeyDown={handleKeyDown}
        name="increment"
        className={incrementButtonClassName}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={isDecrementDisabled}
        onKeyDown={handleKeyDown}
        name="decrement"
        className={decrementButtonClassName}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface CounterProps {
  /** The initial value of the counter. Defaults to 0. */
  initialCount?: number;
  /** The amount to increment or decrement the counter by. Defaults to 1. */
  incrementStep?: number;
  /** The minimum value the counter can have. If undefined, there is no minimum. */
  min?: number;
  /** The maximum value the counter can have. If undefined, there is no maximum. */
  max?: number;
  /** A callback function that is called when the counter value changes. */
  onCountChange?: (count: number) => void;
  /** Aria label for the increment button. Defaults to 'Increment'. */
  ariaLabelIncrement?: string;
  /** Aria label for the decrement button. Defaults to 'Decrement'. */
  ariaLabelDecrement?: string;
  /** Whether the counter is disabled. Defaults to false. */
  disabled?: boolean;
  /** Custom CSS class for the container. */
  containerClassName?: string;
  /** Custom CSS class for the count display. */
  countClassName?: string;
  /** Custom CSS class for the increment button. */
  incrementButtonClassName?: string;
  /** Custom CSS class for the decrement button. */
  decrementButtonClassName?: string;
}

const Counter: React.FC<CounterProps> = ({
  initialCount = 0,
  incrementStep = 1,
  min,
  max,
  onCountChange,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  disabled = false,
  containerClassName,
  countClassName,
  incrementButtonClassName,
  decrementButtonClassName,
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const isFirstRender = useRef(true);
  const [isIncrementDisabled, setIsIncrementDisabled] = useState(disabled || (max !== undefined && initialCount >= max));
  const [isDecrementDisabled, setIsDecrementDisabled] = useState(disabled || (min !== undefined && initialCount <= min));

  const validateCount = useCallback(
    (newCount: number): number => {
      let validatedCount = newCount;
      if (min !== undefined && newCount < min) {
        validatedCount = min;
      }
      if (max !== undefined && newCount > max) {
        validatedCount = max;
      }
      return validatedCount;
    },
    [min, max]
  );

  useEffect(() => {
    const validatedCount = validateCount(count);
    if (validatedCount !== count) {
      setCount(validatedCount);
    }
  }, [count, validateCount]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  useEffect(() => {
    setIsIncrementDisabled(disabled || (max !== undefined && count >= max));
    setIsDecrementDisabled(disabled || (min !== undefined && count <= min));
  }, [count, max, min, disabled]);

  const increment = useCallback(() => {
    if (disabled || isIncrementDisabled) return;
    setCount((prevCount) => {
      const newCount = prevCount + incrementStep;
      return validateCount(newCount);
    });
  }, [incrementStep, validateCount, disabled, isIncrementDisabled]);

  const decrement = useCallback(() => {
    if (disabled || isDecrementDisabled) return;
    setCount((prevCount) => {
      const newCount = prevCount - incrementStep;
      return validateCount(newCount);
    });
  }, [incrementStep, validateCount, disabled, isDecrementDisabled]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault(); // Prevent scrolling
        if (event.currentTarget.name === 'increment' && !isIncrementDisabled) {
          increment();
        } else if (event.currentTarget.name === 'decrement' && !isDecrementDisabled) {
          decrement();
        }
      }
    },
    [increment, decrement, disabled, isIncrementDisabled, isDecrementDisabled]
  );

  return (
    <div className={containerClassName}>
      <p aria-live="polite" className={countClassName}>
        Count: {count}
      </p>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={isIncrementDisabled}
        onKeyDown={handleKeyDown}
        name="increment"
        className={incrementButtonClassName}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={isDecrementDisabled}
        onKeyDown={handleKeyDown}
        name="decrement"
        className={decrementButtonClassName}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;