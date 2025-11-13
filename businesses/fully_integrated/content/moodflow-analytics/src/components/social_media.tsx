import React, { useState } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  maxCount?: number;
  minCount?: number;
}

const Counter: React.FC<CounterProps> = ({ initialCount = 0, incrementStep = 1, maxCount, minCount }) => {
  // Check for non-negative incrementStep and valid minCount and maxCount
  if (incrementStep <= 0 || (maxCount && maxCount < initialCount) || (minCount && minCount > initialCount)) {
    throw new Error('Invalid props provided. Increment step must be a positive number, and minCount and maxCount (if provided) must be greater than initialCount.');
  }

  const [count, setCount] = useState(initialCount);

  const increment = () => {
    setCount(prevCount => Math.min(prevCount + incrementStep, maxCount || Number.MAX_SAFE_INTEGER));
  };

  const decrement = () => {
    setCount(prevCount => Math.max(prevCount - incrementStep, minCount || 0));
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
};

export default Counter;

import React, { useState } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  maxCount?: number;
  minCount?: number;
}

const Counter: React.FC<CounterProps> = ({ initialCount = 0, incrementStep = 1, maxCount, minCount }) => {
  // ... (previous code)

  return (
    <div>
      <p>Count: {count}</p>
      <button aria-label="Increment" onClick={increment}>Increment</button>
      <button aria-label="Decrement" onClick={decrement}>Decrement</button>
    </div>
  );
};

export default Counter;

import React, { useState } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  maxCount?: number;
  minCount?: number;
}

const Counter: React.FC<CounterProps> = ({ initialCount = 0, incrementStep = 1, maxCount, minCount }) => {
  // Check for non-negative incrementStep and valid minCount and maxCount
  if (incrementStep <= 0 || (maxCount && maxCount < initialCount) || (minCount && minCount > initialCount)) {
    throw new Error('Invalid props provided. Increment step must be a positive number, and minCount and maxCount (if provided) must be greater than initialCount.');
  }

  const [count, setCount] = useState(initialCount);

  const increment = () => {
    setCount(prevCount => Math.min(prevCount + incrementStep, maxCount || Number.MAX_SAFE_INTEGER));
  };

  const decrement = () => {
    setCount(prevCount => Math.max(prevCount - incrementStep, minCount || 0));
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
};

export default Counter;

import React, { useState } from 'react';

interface CounterProps {
  initialCount?: number;
  incrementStep?: number;
  maxCount?: number;
  minCount?: number;
}

const Counter: React.FC<CounterProps> = ({ initialCount = 0, incrementStep = 1, maxCount, minCount }) => {
  // ... (previous code)

  return (
    <div>
      <p>Count: {count}</p>
      <button aria-label="Increment" onClick={increment}>Increment</button>
      <button aria-label="Decrement" onClick={decrement}>Decrement</button>
    </div>
  );
};

export default Counter;

In this updated code, I've added the `maxCount` and `minCount` props to provide more flexibility in setting the upper and lower bounds for the counter. I've also added error handling for invalid props and improved the type safety by using the `min` and `max` functions to ensure the count stays within the valid range. Additionally, I've used the `Number.MAX_SAFE_INTEGER` constant to avoid potential issues with large numbers.

For accessibility, it's a good practice to add ARIA attributes to the buttons to help screen readers understand their purpose. Here's an example of how you can do that: