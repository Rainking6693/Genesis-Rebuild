import React, { useState, useCallback, useEffect, useRef } from 'react';

interface MyComponentProps {
  title: string;
  description: string;
  onClick: () => Promise<void>;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, description, onClick }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = useCallback(async () => {
    setIsLoading(true);
    try {
      await onClick();
      setIsClicked(true);
    } catch (err) {
      setError(err as Error);
      console.error('Error occurred while handling click:', err);
    } finally {
      setIsLoading(false);
    }
  }, [onClick]);

  useEffect(() => {
    // Reset the clicked state after a certain time (e.g., 5 seconds)
    resetTimeoutRef.current = setTimeout(() => {
      setIsClicked(false);
    }, 5000);

    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, [isClicked]);

  return (
    <div className="my-component" aria-label="My Component">
      <h2 className="my-component__title" id="my-component-title">
        {title}
      </h2>
      <p className="my-component__description" aria-describedby="my-component-title">
        {description}
      </p>
      <button
        className={`my-component__button ${isClicked ? 'my-component__button--clicked' : ''} ${
          isLoading ? 'my-component__button--loading' : ''
        }`}
        onClick={handleClick}
        aria-label={isClicked ? 'Clicked' : 'Click me'}
        aria-disabled={isLoading}
        disabled={isLoading}
      >
        {isClicked ? 'Clicked' : isLoading ? 'Loading...' : 'Click me'}
      </button>
      {error && (
        <div className="my-component__error" role="alert">
          {error.message}
        </div>
      )}
    </div>
  );
};

export default MyComponent;

import React, { useState, useCallback, useEffect, useRef } from 'react';

interface MyComponentProps {
  title: string;
  description: string;
  onClick: () => Promise<void>;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, description, onClick }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = useCallback(async () => {
    setIsLoading(true);
    try {
      await onClick();
      setIsClicked(true);
    } catch (err) {
      setError(err as Error);
      console.error('Error occurred while handling click:', err);
    } finally {
      setIsLoading(false);
    }
  }, [onClick]);

  useEffect(() => {
    // Reset the clicked state after a certain time (e.g., 5 seconds)
    resetTimeoutRef.current = setTimeout(() => {
      setIsClicked(false);
    }, 5000);

    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, [isClicked]);

  return (
    <div className="my-component" aria-label="My Component">
      <h2 className="my-component__title" id="my-component-title">
        {title}
      </h2>
      <p className="my-component__description" aria-describedby="my-component-title">
        {description}
      </p>
      <button
        className={`my-component__button ${isClicked ? 'my-component__button--clicked' : ''} ${
          isLoading ? 'my-component__button--loading' : ''
        }`}
        onClick={handleClick}
        aria-label={isClicked ? 'Clicked' : 'Click me'}
        aria-disabled={isLoading}
        disabled={isLoading}
      >
        {isClicked ? 'Clicked' : isLoading ? 'Loading...' : 'Click me'}
      </button>
      {error && (
        <div className="my-component__error" role="alert">
          {error.message}
        </div>
      )}
    </div>
  );
};

export default MyComponent;