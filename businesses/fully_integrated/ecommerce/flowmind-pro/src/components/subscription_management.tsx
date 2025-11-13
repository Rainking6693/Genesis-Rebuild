import React, { useState, useEffect, useCallback, useRef } from 'react';

interface SubscriptionProps {
  initialCount?: number;
  incrementStep?: number;
  maxCount?: number;
  minCount?: number;
  onCountChange?: (count: number) => void;
  'aria-label'?: string;
}

const Subscription: React.FC<SubscriptionProps> = ({
  initialCount = 0,
  incrementStep = 1,
  maxCount = Number.MAX_SAFE_INTEGER,
  minCount = 0,
  onCountChange,
  'aria-label': ariaLabel = 'Subscription counter',
}) => {
  const [count, setCount] = useState(initialCount);
  const prevCountRef = useRef(initialCount);

  useEffect(() => {
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  useEffect(() => {
    prevCountRef.current = count;
  }, [count]);

  const handleIncrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + incrementStep;
      return newCount <= maxCount ? newCount : prevCount;
    });
  }, [incrementStep, maxCount]);

  const handleDecrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - incrementStep;
      return newCount >= minCount ? newCount : prevCount;
    });
  }, [incrementStep, minCount]);

  const isInvalidCount = count < minCount || count > maxCount;

  return (
    <div>
      <p aria-label={ariaLabel}>
        Count: {isInvalidCount ? prevCountRef.current : count}
      </p>
      <button
        onClick={handleIncrement}
        disabled={count >= maxCount}
        aria-label="Increment subscription"
      >
        Increment
      </button>
      <button
        onClick={handleDecrement}
        disabled={count <= minCount}
        aria-label="Decrement subscription"
      >
        Decrement
      </button>
    </div>
  );
};

export default Subscription;

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface SubscriptionProps {
  initialCount?: number;
  incrementStep?: number;
  maxCount?: number;
  minCount?: number;
  onCountChange?: (count: number) => void;
  'aria-label'?: string;
}

const Subscription: React.FC<SubscriptionProps> = ({
  initialCount = 0,
  incrementStep = 1,
  maxCount = Number.MAX_SAFE_INTEGER,
  minCount = 0,
  onCountChange,
  'aria-label': ariaLabel = 'Subscription counter',
}) => {
  const [count, setCount] = useState(initialCount);
  const prevCountRef = useRef(initialCount);

  useEffect(() => {
    if (onCountChange) {
      onCountChange(count);
    }
  }, [count, onCountChange]);

  useEffect(() => {
    prevCountRef.current = count;
  }, [count]);

  const handleIncrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount + incrementStep;
      return newCount <= maxCount ? newCount : prevCount;
    });
  }, [incrementStep, maxCount]);

  const handleDecrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount - incrementStep;
      return newCount >= minCount ? newCount : prevCount;
    });
  }, [incrementStep, minCount]);

  const isInvalidCount = count < minCount || count > maxCount;

  return (
    <div>
      <p aria-label={ariaLabel}>
        Count: {isInvalidCount ? prevCountRef.current : count}
      </p>
      <button
        onClick={handleIncrement}
        disabled={count >= maxCount}
        aria-label="Increment subscription"
      >
        Increment
      </button>
      <button
        onClick={handleDecrement}
        disabled={count <= minCount}
        aria-label="Decrement subscription"
      >
        Decrement
      </button>
    </div>
  );
};

export default Subscription;