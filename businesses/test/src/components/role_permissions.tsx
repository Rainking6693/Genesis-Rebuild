import React, { useState, useCallback, useEffect, useRef } from 'react';

interface Props {
  /** The initial value of the counter. Defaults to 0. */
  initialCount?: number;
  /** The amount to increment or decrement the counter by. Defaults to 1. */
  incrementStep?: number;
  /** The minimum value the counter can be. Defaults to negative infinity. */
  min?: number;
  /** The maximum value the counter can be. Defaults to positive infinity. */
  max?: number;
  /** Aria label for the increment button. Defaults to 'Increment'. */
  ariaLabelIncrement?: string;
  /** Aria label for the decrement button. Defaults to 'Decrement'. */
  ariaLabelDecrement?: string;
  /** Callback function that is called when the count changes. Debounced. */
  onCountChange?: (count: number) => void;
  /** Debounce delay in milliseconds for the onCountChange callback. Defaults to 200. */
  debounceDelay?: number;
  /** Custom CSS class name for the container div. */
  className?: string;
  /** Custom CSS class name for the count display paragraph. */
  countClassName?: string;
  /** Custom CSS class name for the increment button. */
  incrementButtonClassName?: string;
  /** Custom CSS class name for the decrement button. */
  decrementButtonClassName?: string;
}

const Counter: React.FC<Props> = ({
  initialCount = 0,
  incrementStep = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
  debounceDelay = 200,
  className,
  countClassName,
  incrementButtonClassName,
  decrementButtonClassName,
}) => {
  const [count, setCount] = useState<number>(() => {
    // Initialize state using a function to avoid unnecessary calculations on every render
    return Math.max(min, Math.min(initialCount, max));
  });
  const [isIncrementing, setIsIncrementing] = useState(false);
  const [isDecrementing, setIsDecrementing] = useState(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(false); // Track if the component is mounted

  // Prop validation with more specific checks and error messages
  useEffect(() => {
    if (typeof initialCount !== 'number' || !Number.isFinite(initialCount)) {
      console.error('Counter: initialCount must be a finite number. Using default value 0.');
    }
    if (typeof incrementStep !== 'number' || !Number.isFinite(incrementStep) || incrementStep === 0) {
      console.error('Counter: incrementStep must be a non-zero finite number. Using default value 1.');
    }
    if (typeof min !== 'number' || !Number.isFinite(min)) {
      console.error('Counter: min must be a finite number. Using default value Number.NEGATIVE_INFINITY.');
    }
    if (typeof max !== 'number' || !Number.isFinite(max)) {
      console.error('Counter: max must be a finite number. Using default value Number.POSITIVE_INFINITY.');
    }
    if (min >= max) {
      console.error('Counter: min must be less than max. No limits will be applied.');
    }
    if (typeof debounceDelay !== 'number' || !Number.isInteger(debounceDelay) || debounceDelay < 0) {
      console.error('Counter: debounceDelay must be a non-negative integer. Using default value 200.');
    }
  }, [initialCount, incrementStep, min, max, debounceDelay]);

  // Debounced onCountChange handler
  const handleCountChange = useCallback(
    (newCount: number) => {
      if (onCountChange) {
        if (timeoutId.current) {
          clearTimeout(timeoutId.current);
        }

        timeoutId.current = setTimeout(() => {
          onCountChange(newCount);
        }, debounceDelay);
      }
    },
    [onCountChange, debounceDelay]
  );

  // Increment function
  const increment = useCallback(() => {
    setIsIncrementing(true);
    setCount((prevCount) => {
      const newCount = prevCount + incrementStep;
      const clampedCount = Math.min(newCount, max);
      return clampedCount;
    });
  }, [incrementStep, max]);

  // Decrement function
  const decrement = useCallback(() => {
    setIsDecrementing(true);
    setCount((prevCount) => {
      const newCount = prevCount - incrementStep;
      const clampedCount = Math.max(newCount, min);
      return clampedCount;
    });
  }, [incrementStep, min]);

  // useEffect to handle side effects after count is updated
  useEffect(() => {
    if (isMounted.current) {
      handleCountChange(count);
    } else {
      isMounted.current = true; // Mark component as mounted after initial render
    }
    setIsIncrementing(false);
    setIsDecrementing(false);
  }, [count, handleCountChange]);

  // Initialize count and handle min/max constraints on initial render or prop change
  useEffect(() => {
    const initialClampedCount = Math.max(min, Math.min(initialCount, max));
    setCount(initialClampedCount);
  }, [initialCount, min, max]);

  return (
    <div className={className}>
      <p aria-live="polite" className={countClassName}>
        Count: {count}
      </p>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={count <= min || isDecrementing}
        className={decrementButtonClassName}
      >
        Decrement
      </button>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={count >= max || isIncrementing}
        className={incrementButtonClassName}
      >
        Increment
      </button>
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useEffect, useRef } from 'react';

interface Props {
  /** The initial value of the counter. Defaults to 0. */
  initialCount?: number;
  /** The amount to increment or decrement the counter by. Defaults to 1. */
  incrementStep?: number;
  /** The minimum value the counter can be. Defaults to negative infinity. */
  min?: number;
  /** The maximum value the counter can be. Defaults to positive infinity. */
  max?: number;
  /** Aria label for the increment button. Defaults to 'Increment'. */
  ariaLabelIncrement?: string;
  /** Aria label for the decrement button. Defaults to 'Decrement'. */
  ariaLabelDecrement?: string;
  /** Callback function that is called when the count changes. Debounced. */
  onCountChange?: (count: number) => void;
  /** Debounce delay in milliseconds for the onCountChange callback. Defaults to 200. */
  debounceDelay?: number;
  /** Custom CSS class name for the container div. */
  className?: string;
  /** Custom CSS class name for the count display paragraph. */
  countClassName?: string;
  /** Custom CSS class name for the increment button. */
  incrementButtonClassName?: string;
  /** Custom CSS class name for the decrement button. */
  decrementButtonClassName?: string;
}

const Counter: React.FC<Props> = ({
  initialCount = 0,
  incrementStep = 1,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  ariaLabelIncrement = 'Increment',
  ariaLabelDecrement = 'Decrement',
  onCountChange,
  debounceDelay = 200,
  className,
  countClassName,
  incrementButtonClassName,
  decrementButtonClassName,
}) => {
  const [count, setCount] = useState<number>(() => {
    // Initialize state using a function to avoid unnecessary calculations on every render
    return Math.max(min, Math.min(initialCount, max));
  });
  const [isIncrementing, setIsIncrementing] = useState(false);
  const [isDecrementing, setIsDecrementing] = useState(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(false); // Track if the component is mounted

  // Prop validation with more specific checks and error messages
  useEffect(() => {
    if (typeof initialCount !== 'number' || !Number.isFinite(initialCount)) {
      console.error('Counter: initialCount must be a finite number. Using default value 0.');
    }
    if (typeof incrementStep !== 'number' || !Number.isFinite(incrementStep) || incrementStep === 0) {
      console.error('Counter: incrementStep must be a non-zero finite number. Using default value 1.');
    }
    if (typeof min !== 'number' || !Number.isFinite(min)) {
      console.error('Counter: min must be a finite number. Using default value Number.NEGATIVE_INFINITY.');
    }
    if (typeof max !== 'number' || !Number.isFinite(max)) {
      console.error('Counter: max must be a finite number. Using default value Number.POSITIVE_INFINITY.');
    }
    if (min >= max) {
      console.error('Counter: min must be less than max. No limits will be applied.');
    }
    if (typeof debounceDelay !== 'number' || !Number.isInteger(debounceDelay) || debounceDelay < 0) {
      console.error('Counter: debounceDelay must be a non-negative integer. Using default value 200.');
    }
  }, [initialCount, incrementStep, min, max, debounceDelay]);

  // Debounced onCountChange handler
  const handleCountChange = useCallback(
    (newCount: number) => {
      if (onCountChange) {
        if (timeoutId.current) {
          clearTimeout(timeoutId.current);
        }

        timeoutId.current = setTimeout(() => {
          onCountChange(newCount);
        }, debounceDelay);
      }
    },
    [onCountChange, debounceDelay]
  );

  // Increment function
  const increment = useCallback(() => {
    setIsIncrementing(true);
    setCount((prevCount) => {
      const newCount = prevCount + incrementStep;
      const clampedCount = Math.min(newCount, max);
      return clampedCount;
    });
  }, [incrementStep, max]);

  // Decrement function
  const decrement = useCallback(() => {
    setIsDecrementing(true);
    setCount((prevCount) => {
      const newCount = prevCount - incrementStep;
      const clampedCount = Math.max(newCount, min);
      return clampedCount;
    });
  }, [incrementStep, min]);

  // useEffect to handle side effects after count is updated
  useEffect(() => {
    if (isMounted.current) {
      handleCountChange(count);
    } else {
      isMounted.current = true; // Mark component as mounted after initial render
    }
    setIsIncrementing(false);
    setIsDecrementing(false);
  }, [count, handleCountChange]);

  // Initialize count and handle min/max constraints on initial render or prop change
  useEffect(() => {
    const initialClampedCount = Math.max(min, Math.min(initialCount, max));
    setCount(initialClampedCount);
  }, [initialCount, min, max]);

  return (
    <div className={className}>
      <p aria-live="polite" className={countClassName}>
        Count: {count}
      </p>
      <button
        onClick={decrement}
        aria-label={ariaLabelDecrement}
        disabled={count <= min || isDecrementing}
        className={decrementButtonClassName}
      >
        Decrement
      </button>
      <button
        onClick={increment}
        aria-label={ariaLabelIncrement}
        disabled={count >= max || isIncrementing}
        className={incrementButtonClassName}
      >
        Increment
      </button>
    </div>
  );
};

export default Counter;