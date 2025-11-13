import React, { useState, useCallback, useEffect } from 'react';

interface MyComponentProps {
  title: string;
  description: string;
  onClick?: () => Promise<void> | void;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, description, onClick }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  const handleClick = useCallback(async () => {
    if (onClick) {
      try {
        setIsLoading(true);
        await onClick();
        setIsClicked(true);
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
      // Handle error, e.g., display an error message
      console.error('Error occurred:', error);
    }
  }, [error]);

  return (
    <div className="my-component" aria-live="polite">
      <h2 className="my-component__title" id="my-component-title">
        {title}
      </h2>
      <p className="my-component__description" aria-describedby="my-component-title">
        {description}
      </p>
      <button
        className="my-component__button"
        onClick={handleClick}
        disabled={isClicked || isLoading}
        aria-label={isClicked ? 'Component has been clicked' : 'Click me'}
        aria-busy={isLoading}
      >
        {isClicked ? 'Clicked' : isLoading ? 'Loading...' : 'Click me'}
      </button>
    </div>
  );
};

export default MyComponent;

import React, { useState, useCallback, useEffect } from 'react';

interface MyComponentProps {
  title: string;
  description: string;
  onClick?: () => Promise<void> | void;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, description, onClick }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  const handleClick = useCallback(async () => {
    if (onClick) {
      try {
        setIsLoading(true);
        await onClick();
        setIsClicked(true);
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
      // Handle error, e.g., display an error message
      console.error('Error occurred:', error);
    }
  }, [error]);

  return (
    <div className="my-component" aria-live="polite">
      <h2 className="my-component__title" id="my-component-title">
        {title}
      </h2>
      <p className="my-component__description" aria-describedby="my-component-title">
        {description}
      </p>
      <button
        className="my-component__button"
        onClick={handleClick}
        disabled={isClicked || isLoading}
        aria-label={isClicked ? 'Component has been clicked' : 'Click me'}
        aria-busy={isLoading}
      >
        {isClicked ? 'Clicked' : isLoading ? 'Loading...' : 'Click me'}
      </button>
    </div>
  );
};

export default MyComponent;