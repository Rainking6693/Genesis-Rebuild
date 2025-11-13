import React, { useState, useCallback, useRef, useEffect } from 'react';

interface Props {
  initialCount?: number;
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelPrefix?: string; // Added for better accessibility
}

/**
 * A simple counter component. While seemingly unrelated to CarbonScore Pro,
 * this component serves as a placeholder and example. In a real blog system,
 * this would be replaced with components for displaying blog posts,
 * managing content, and interacting with a content management system (CMS).
 *
 * Consider replacing this with a component that fetches and displays
 * sustainability-related articles, team challenges, or actionable tips
 * relevant to CarbonScore Pro's mission.
 */
const Counter: React.FC<Props> = ({
  initialCount = 0,
  incrementStep = 1,
  min = -Infinity,
  max = Infinity,
  ariaLabelPrefix = 'Counter',
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const [inputValue, setInputValue] = useState<string>(String(initialCount)); // Controlled input value

  const inputRef = useRef<HTMLInputElement>(null); // Ref for input element

  // Validate props on mount
  useEffect(() => {
    if (min >= max) {
      console.error("Counter: 'min' prop must be less than 'max' prop.");
    }
    if (incrementStep <= 0) {
      console.error("Counter: 'incrementStep' prop must be greater than zero.");
    }
  }, [min, max, incrementStep]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount + incrementStep;
      const validatedCount = Math.min(nextCount, max); // Ensure within bounds
      setInputValue(String(validatedCount)); // Update input value
      return validatedCount;
    });
  }, [incrementStep, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount - incrementStep;
      const validatedCount = Math.max(nextCount, min); // Ensure within bounds
      setInputValue(String(validatedCount)); // Update input value
      return validatedCount;
    });
  }, [incrementStep, min]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value); // Update controlled input value

    const newValue = Number(value);

    if (value === '') {
      setCount(0); // Reset to 0 if input is cleared
      return;
    }

    if (isNaN(newValue)) {
      return; // Ignore non-numeric input
    }

    if (newValue < min) {
      setCount(min);
      setInputValue(String(min));
      return;
    }

    if (newValue > max) {
      setCount(max);
      setInputValue(String(max));
      return;
    }

    setCount(newValue);
  }, [min, max]);

  const handleInputBlur = useCallback(() => {
    // Ensure the input value reflects the current count after blur
    setInputValue(String(count));
  }, [count]);

  const containerStyle = {
    padding: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '300px', // Added max width for better responsiveness
    margin: '0 auto', // Center the component
  };

  const buttonStyle = {
    margin: '8px',
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.2s ease', // Added transition for hover effect
    ':hover': {
      backgroundColor: '#0056b3', // Darken the color on hover
    },
  };

  const disabledButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#6c757d',
    cursor: 'not-allowed',
    ':hover': {
      backgroundColor: '#6c757d', // Keep the same color on hover when disabled
    },
  };

  const inputStyle = {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    textAlign: 'center',
    width: '80px',
    margin: '8px 0',
    fontSize: '1rem',
  };

  const labelStyle = {
    marginBottom: '4px',
    fontWeight: 'bold',
    fontSize: '1rem',
  };

  const isIncrementDisabled = count >= max;
  const isDecrementDisabled = count <= min;

  return (
    <div style={containerStyle}>
      <label htmlFor="counter-value" style={labelStyle}>
        Current Count:
      </label>
      <input
        ref={inputRef}
        type="number"
        id="counter-value"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        style={inputStyle}
        aria-label={`${ariaLabelPrefix} Value`}
        min={min}
        max={max}
        data-testid="counter-input" // Added data-testid for testing
      />

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={decrement}
          style={isDecrementDisabled ? disabledButtonStyle : buttonStyle}
          disabled={isDecrementDisabled}
          aria-label={`Decrement ${ariaLabelPrefix}`}
          data-testid="decrement-button" // Added data-testid for testing
        >
          Decrement
        </button>
        <button
          onClick={increment}
          style={isIncrementDisabled ? disabledButtonStyle : buttonStyle}
          disabled={isIncrementDisabled}
          aria-label={`Increment ${ariaLabelPrefix}`}
          data-testid="increment-button" // Added data-testid for testing
        >
          Increment
        </button>
      </div>
    </div>
  );
};

export default Counter;

import React, { useState, useCallback, useRef, useEffect } from 'react';

interface Props {
  initialCount?: number;
  incrementStep?: number;
  min?: number;
  max?: number;
  ariaLabelPrefix?: string; // Added for better accessibility
}

/**
 * A simple counter component. While seemingly unrelated to CarbonScore Pro,
 * this component serves as a placeholder and example. In a real blog system,
 * this would be replaced with components for displaying blog posts,
 * managing content, and interacting with a content management system (CMS).
 *
 * Consider replacing this with a component that fetches and displays
 * sustainability-related articles, team challenges, or actionable tips
 * relevant to CarbonScore Pro's mission.
 */
const Counter: React.FC<Props> = ({
  initialCount = 0,
  incrementStep = 1,
  min = -Infinity,
  max = Infinity,
  ariaLabelPrefix = 'Counter',
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const [inputValue, setInputValue] = useState<string>(String(initialCount)); // Controlled input value

  const inputRef = useRef<HTMLInputElement>(null); // Ref for input element

  // Validate props on mount
  useEffect(() => {
    if (min >= max) {
      console.error("Counter: 'min' prop must be less than 'max' prop.");
    }
    if (incrementStep <= 0) {
      console.error("Counter: 'incrementStep' prop must be greater than zero.");
    }
  }, [min, max, incrementStep]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount + incrementStep;
      const validatedCount = Math.min(nextCount, max); // Ensure within bounds
      setInputValue(String(validatedCount)); // Update input value
      return validatedCount;
    });
  }, [incrementStep, max]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const nextCount = prevCount - incrementStep;
      const validatedCount = Math.max(nextCount, min); // Ensure within bounds
      setInputValue(String(validatedCount)); // Update input value
      return validatedCount;
    });
  }, [incrementStep, min]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value); // Update controlled input value

    const newValue = Number(value);

    if (value === '') {
      setCount(0); // Reset to 0 if input is cleared
      return;
    }

    if (isNaN(newValue)) {
      return; // Ignore non-numeric input
    }

    if (newValue < min) {
      setCount(min);
      setInputValue(String(min));
      return;
    }

    if (newValue > max) {
      setCount(max);
      setInputValue(String(max));
      return;
    }

    setCount(newValue);
  }, [min, max]);

  const handleInputBlur = useCallback(() => {
    // Ensure the input value reflects the current count after blur
    setInputValue(String(count));
  }, [count]);

  const containerStyle = {
    padding: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '300px', // Added max width for better responsiveness
    margin: '0 auto', // Center the component
  };

  const buttonStyle = {
    margin: '8px',
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.2s ease', // Added transition for hover effect
    ':hover': {
      backgroundColor: '#0056b3', // Darken the color on hover
    },
  };

  const disabledButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#6c757d',
    cursor: 'not-allowed',
    ':hover': {
      backgroundColor: '#6c757d', // Keep the same color on hover when disabled
    },
  };

  const inputStyle = {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    textAlign: 'center',
    width: '80px',
    margin: '8px 0',
    fontSize: '1rem',
  };

  const labelStyle = {
    marginBottom: '4px',
    fontWeight: 'bold',
    fontSize: '1rem',
  };

  const isIncrementDisabled = count >= max;
  const isDecrementDisabled = count <= min;

  return (
    <div style={containerStyle}>
      <label htmlFor="counter-value" style={labelStyle}>
        Current Count:
      </label>
      <input
        ref={inputRef}
        type="number"
        id="counter-value"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        style={inputStyle}
        aria-label={`${ariaLabelPrefix} Value`}
        min={min}
        max={max}
        data-testid="counter-input" // Added data-testid for testing
      />

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={decrement}
          style={isDecrementDisabled ? disabledButtonStyle : buttonStyle}
          disabled={isDecrementDisabled}
          aria-label={`Decrement ${ariaLabelPrefix}`}
          data-testid="decrement-button" // Added data-testid for testing
        >
          Decrement
        </button>
        <button
          onClick={increment}
          style={isIncrementDisabled ? disabledButtonStyle : buttonStyle}
          disabled={isIncrementDisabled}
          aria-label={`Increment ${ariaLabelPrefix}`}
          data-testid="increment-button" // Added data-testid for testing
        >
          Increment
        </button>
      </div>
    </div>
  );
};

export default Counter;