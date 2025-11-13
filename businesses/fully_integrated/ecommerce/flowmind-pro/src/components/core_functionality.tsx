import React, { memo, useCallback, useState, useEffect } from 'react';

interface MyComponentProps {
  title: string;
  description: string;
  onClick: () => Promise<void>;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, description, onClick }) => {
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleClick = useCallback(async () => {
    setIsLoading(true);
    try {
      await onClick();
      setIsButtonClicked(true);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [onClick]);

  useEffect(() => {
    if (error) {
      console.error('Error occurred while handling click:', error);
      setError(null);
    }
  }, [error]);

  return (
    <div data-testid="my-component" className="my-component">
      <h2 className="my-component__title">{title}</h2>
      <p className="my-component__description">{description}</p>
      <button
        onClick={handleClick}
        data-testid="my-component-button"
        className="my-component__button"
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
        <div className="my-component__error" role="alert">
          An error occurred: {error.message}
        </div>
      )}
    </div>
  );
});

MyComponent.displayName = 'MyComponent';

export default MyComponent;

import React, { memo, useCallback, useState, useEffect } from 'react';

interface MyComponentProps {
  title: string;
  description: string;
  onClick: () => Promise<void>;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, description, onClick }) => {
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleClick = useCallback(async () => {
    setIsLoading(true);
    try {
      await onClick();
      setIsButtonClicked(true);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [onClick]);

  useEffect(() => {
    if (error) {
      console.error('Error occurred while handling click:', error);
      setError(null);
    }
  }, [error]);

  return (
    <div data-testid="my-component" className="my-component">
      <h2 className="my-component__title">{title}</h2>
      <p className="my-component__description">{description}</p>
      <button
        onClick={handleClick}
        data-testid="my-component-button"
        className="my-component__button"
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
        <div className="my-component__error" role="alert">
          An error occurred: {error.message}
        </div>
      )}
    </div>
  );
});

MyComponent.displayName = 'MyComponent';

export default MyComponent;