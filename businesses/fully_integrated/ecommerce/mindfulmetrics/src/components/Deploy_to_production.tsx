import React, { memo, useCallback, useState, useEffect } from 'react';

interface MyComponentProps {
  title: string;
  description: string;
  onClick: () => Promise<void>;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, description, onClick }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleClick = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await onClick();
    } catch (err) {
      console.error('Error in MyComponent onClick handler:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [onClick]);

  useEffect(() => {
    if (error) {
      alert('An error occurred. Please try again later.');
    }
  }, [error]);

  return (
    <div data-testid="my-component" aria-label={title}>
      <h2>{title}</h2>
      <p>{description}</p>
      <button
        onClick={handleClick}
        data-testid="my-component-button"
        aria-label="Click me"
        disabled={typeof onClick !== 'function' || isLoading}
      >
        {isLoading ? 'Loading...' : 'Click me'}
      </button>
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleClick = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await onClick();
    } catch (err) {
      console.error('Error in MyComponent onClick handler:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [onClick]);

  useEffect(() => {
    if (error) {
      alert('An error occurred. Please try again later.');
    }
  }, [error]);

  return (
    <div data-testid="my-component" aria-label={title}>
      <h2>{title}</h2>
      <p>{description}</p>
      <button
        onClick={handleClick}
        data-testid="my-component-button"
        aria-label="Click me"
        disabled={typeof onClick !== 'function' || isLoading}
      >
        {isLoading ? 'Loading...' : 'Click me'}
      </button>
    </div>
  );
});

MyComponent.displayName = 'MyComponent';

export default MyComponent;