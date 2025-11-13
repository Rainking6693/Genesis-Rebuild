import React, { useState, useCallback, useEffect, memo } from 'react';

interface MyComponentProps {
  title: string;
  description: string;
  onClickHandler?: () => void | Promise<void>;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, description, onClickHandler = () => {} }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    // Reset the clicked and error state if the component is re-rendered
    setIsClicked(false);
    setError(null);
  }, [title, description, onClickHandler]);

  const handleClick = useCallback(async () => {
    setIsClicked(true);
    setIsLoading(true);

    try {
      await onClickHandler();
    } catch (err) {
      console.error('Error in onClickHandler:', err);
      setError(err);
    } finally {
      setIsClicked(false);
      setIsLoading(false);
    }
  }, [onClickHandler]);

  return (
    <div data-testid="my-component" aria-live="polite">
      <h2>{title}</h2>
      <p>{description}</p>
      <button
        onClick={handleClick}
        disabled={isClicked || isLoading}
        aria-label={isClicked ? 'Clicked!' : 'Click me'}
        aria-live="polite"
      >
        {isClicked ? 'Clicked!' : isLoading ? 'Loading...' : 'Click me'}
      </button>
      {error && (
        <div role="alert" aria-live="assertive">
          An error occurred: {String(error)}
        </div>
      )}
    </div>
  );
});

export default MyComponent;

import React, { useState, useCallback, useEffect, memo } from 'react';

interface MyComponentProps {
  title: string;
  description: string;
  onClickHandler?: () => void | Promise<void>;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, description, onClickHandler = () => {} }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    // Reset the clicked and error state if the component is re-rendered
    setIsClicked(false);
    setError(null);
  }, [title, description, onClickHandler]);

  const handleClick = useCallback(async () => {
    setIsClicked(true);
    setIsLoading(true);

    try {
      await onClickHandler();
    } catch (err) {
      console.error('Error in onClickHandler:', err);
      setError(err);
    } finally {
      setIsClicked(false);
      setIsLoading(false);
    }
  }, [onClickHandler]);

  return (
    <div data-testid="my-component" aria-live="polite">
      <h2>{title}</h2>
      <p>{description}</p>
      <button
        onClick={handleClick}
        disabled={isClicked || isLoading}
        aria-label={isClicked ? 'Clicked!' : 'Click me'}
        aria-live="polite"
      >
        {isClicked ? 'Clicked!' : isLoading ? 'Loading...' : 'Click me'}
      </button>
      {error && (
        <div role="alert" aria-live="assertive">
          An error occurred: {String(error)}
        </div>
      )}
    </div>
  );
});

export default MyComponent;