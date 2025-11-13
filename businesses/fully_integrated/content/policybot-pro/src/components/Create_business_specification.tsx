import React, { useState } from 'react';
import { useMemoizedFn } from '@microsoft/fast-components';
import { validateNumber } from './utilities';

type Props = {
  initialCount?: number;
  incrementBy?: number;
  minCount?: number;
  maxCount?: number;
};

const Counter: React.FC<Props> = ({ initialCount = 0, incrementBy = 1, minCount = 0, maxCount }: Props) => {
  const [count, setCount] = useState<number>(initialCount);

  const validateInput = (value: number) => {
    if (value < 1) return 'Increment value should be greater than 0';
    if (maxCount && value > maxCount) return `Increment value should be less than or equal to ${maxCount}`;
    if (minCount && value < minCount) return `Increment value should be greater than or equal to ${minCount}`;
    return null;
  };

  const increment = useMemoizedFn(() => {
    const error = validateInput(incrementBy);
    if (error) {
      console.error(error); // Log the error for better debugging
      return;
    }
    setCount(prevCount => Math.max(Math.min(prevCount + incrementBy, maxCount), minCount));
  });

  const decrement = useMemoizedFn(() => {
    setCount(prevCount => Math.max(Math.min(prevCount - incrementBy, maxCount), minCount));
  });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter') {
      event.currentTarget.click(); // Simulate a click event when Enter key is pressed for better accessibility
    }
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment} onKeyDown={handleKeyDown}>Increment</button>
      <button onClick={decrement} onKeyDown={handleKeyDown}>Decrement</button>
    </div>
  );
};

export default Counter;

import React, { useState } from 'react';
import { useMemoizedFn } from '@microsoft/fast-components';
import { validateNumber } from './utilities';

type Props = {
  initialCount?: number;
  incrementBy?: number;
  minCount?: number;
  maxCount?: number;
};

const Counter: React.FC<Props> = ({ initialCount = 0, incrementBy = 1, minCount = 0, maxCount }: Props) => {
  const [count, setCount] = useState<number>(initialCount);

  const validateInput = (value: number) => {
    if (value < 1) return 'Increment value should be greater than 0';
    if (maxCount && value > maxCount) return `Increment value should be less than or equal to ${maxCount}`;
    if (minCount && value < minCount) return `Increment value should be greater than or equal to ${minCount}`;
    return null;
  };

  const increment = useMemoizedFn(() => {
    const error = validateInput(incrementBy);
    if (error) {
      console.error(error); // Log the error for better debugging
      return;
    }
    setCount(prevCount => Math.max(Math.min(prevCount + incrementBy, maxCount), minCount));
  });

  const decrement = useMemoizedFn(() => {
    setCount(prevCount => Math.max(Math.min(prevCount - incrementBy, maxCount), minCount));
  });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter') {
      event.currentTarget.click(); // Simulate a click event when Enter key is pressed for better accessibility
    }
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment} onKeyDown={handleKeyDown}>Increment</button>
      <button onClick={decrement} onKeyDown={handleKeyDown}>Decrement</button>
    </div>
  );
};

export default Counter;