import React, { useState, useCallback, useEffect, Dispatch, SetStateAction } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  maxCount?: number;
  minCount?: number;
}

const Counter: React.FC<CounterProps> = ({ initialCount = 0, incrementStep = 1, maxCount, minCount }) => {
  const [count, setCount] = useState<number>(initialCount);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const handleIncrement = useCallback(() => {
    if (count < maxCount) {
      setCount(prevCount => prevCount + incrementStep);
    }
    setIsDisabled(count === maxCount);
  }, [count, incrementStep, maxCount]);

  const handleDecrement = useCallback(() => {
    if (count > minCount) {
      setCount(prevCount => prevCount - incrementStep);
    }
    setIsDisabled(count === minCount);
  }, [count, incrementStep, minCount]);

  useEffect(() => {
    if (count < minCount) {
      setCount(minCount);
    }
    if (count > maxCount) {
      setCount(maxCount);
      setIsDisabled(true);
    }
  }, [count, maxCount, minCount]);

  return (
    <div>
      <p>Count: {count}</p>
      <button disabled={isDisabled} onClick={handleIncrement} aria-label={`Increment to ${maxCount}`}>Increment</button>
      <button disabled={isDisabled} onClick={handleDecrement} aria-label={`Decrement to ${minCount}`}>Decrement</button>
    </div>
  );
};

export default Counter;

In this updated version, I've added more descriptive `aria-label` attributes to improve accessibility. I've also updated the `handleIncrement` and `handleDecrement` functions to set the `isDisabled` state based on the final count value, making the code more maintainable. Lastly, I've updated the `aria-label` attributes to reflect the new maximum and minimum values.