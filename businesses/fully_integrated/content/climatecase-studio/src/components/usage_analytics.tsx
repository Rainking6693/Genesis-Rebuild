import React, { memo, useCallback, useState, useEffect } from 'react';

interface MyComponentProps {
  title: string;
  description: string;
  onClick?: () => Promise<void> | void;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, description, onClick }) => {
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  const handleClick = useCallback(async () => {
    if (onClick) {
      try {
        setIsLoading(true);
        await onClick();
        setIsButtonClicked(true);
      } catch (err) {
        setError(err);
        console.error('Error occurred while handling click event:', err);
      } finally {
        setIsLoading(false);
      }
    }
  }, [onClick]);

  useEffect(() => {
    if (error) {
      // Handle error, e.g., display an error message to the user
      console.error('Error occurred:', error);
    }
  }, [error]);

  return (
    <div data-testid="my-component" aria-live="polite">
      <h2>{title}</h2>
      <p>{description}</p>
      <button
        onClick={handleClick}
        data-testid="my-component-button"
        disabled={isButtonClicked || isLoading}
        aria-label={
          isButtonClicked
            ? 'Button has been clicked'
            : isLoading
            ? 'Loading...'
            : 'Click me'
        }
      >
        {isButtonClicked ? 'Clicked' : isLoading ? 'Loading...' : 'Click me'}
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

import React, { memo, useCallback, useState, useEffect } from 'react';

interface MyComponentProps {
  title: string;
  description: string;
  onClick?: () => Promise<void> | void;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, description, onClick }) => {
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  const handleClick = useCallback(async () => {
    if (onClick) {
      try {
        setIsLoading(true);
        await onClick();
        setIsButtonClicked(true);
      } catch (err) {
        setError(err);
        console.error('Error occurred while handling click event:', err);
      } finally {
        setIsLoading(false);
      }
    }
  }, [onClick]);

  useEffect(() => {
    if (error) {
      // Handle error, e.g., display an error message to the user
      console.error('Error occurred:', error);
    }
  }, [error]);

  return (
    <div data-testid="my-component" aria-live="polite">
      <h2>{title}</h2>
      <p>{description}</p>
      <button
        onClick={handleClick}
        data-testid="my-component-button"
        disabled={isButtonClicked || isLoading}
        aria-label={
          isButtonClicked
            ? 'Button has been clicked'
            : isLoading
            ? 'Loading...'
            : 'Click me'
        }
      >
        {isButtonClicked ? 'Clicked' : isLoading ? 'Loading...' : 'Click me'}
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