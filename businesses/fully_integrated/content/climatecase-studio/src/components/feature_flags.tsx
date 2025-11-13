import React, { useState, useCallback, useEffect } from 'react';

interface MyComponentProps {
  title: string;
  description: string;
  onClickCallback: () => Promise<void>;
  /** Optional error boundary fallback component.  If not provided, a default message will be shown. */
  ErrorBoundaryFallback?: React.ComponentType<{ error: Error }>;
  /** Optional aria label for the button. Defaults to "Click me". */
  buttonAriaLabel?: string;
  /** Optional button text. Defaults to "Click me". */
  buttonText?: string;
  /** Optional loading text. Defaults to "Loading...". */
  loadingText?: string;
}

const DefaultErrorBoundaryFallback: React.FC<{ error: Error }> = ({ error }) => (
  <div role="alert" aria-live="assertive">
    <p>An error occurred: {error.message}</p>
    <p>Please try again later.</p>
  </div>
);

const MyComponent: React.FC<MyComponentProps> = ({
  title,
  description,
  onClickCallback,
  ErrorBoundaryFallback = DefaultErrorBoundaryFallback,
  buttonAriaLabel = 'Click me',
  buttonText = 'Click me',
  loadingText = 'Loading...',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleClick = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await onClickCallback();
    } catch (err) {
      const safeError = err instanceof Error ? err : new Error(String(err)); // Ensure err is always an Error object
      setError(safeError);
      console.error('Error in MyComponent:', safeError);
    } finally {
      setIsLoading(false);
    }
  }, [onClickCallback]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault(); // Prevent scrolling
        handleClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClick]);

  const buttonLabel = isLoading ? loadingText : buttonText;
  const ariaLabel = isLoading ? loadingText : buttonAriaLabel;

  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      <button
        onClick={handleClick}
        disabled={isLoading}
        aria-label={ariaLabel}
        aria-busy={isLoading}
        tabIndex={0}
      >
        {buttonLabel}
      </button>
      {error && (
        <ErrorBoundaryFallback error={error} />
      )}
    </div>
  );
};

export default MyComponent;

import React, { useState, useCallback, useEffect } from 'react';

interface MyComponentProps {
  title: string;
  description: string;
  onClickCallback: () => Promise<void>;
  /** Optional error boundary fallback component.  If not provided, a default message will be shown. */
  ErrorBoundaryFallback?: React.ComponentType<{ error: Error }>;
  /** Optional aria label for the button. Defaults to "Click me". */
  buttonAriaLabel?: string;
  /** Optional button text. Defaults to "Click me". */
  buttonText?: string;
  /** Optional loading text. Defaults to "Loading...". */
  loadingText?: string;
}

const DefaultErrorBoundaryFallback: React.FC<{ error: Error }> = ({ error }) => (
  <div role="alert" aria-live="assertive">
    <p>An error occurred: {error.message}</p>
    <p>Please try again later.</p>
  </div>
);

const MyComponent: React.FC<MyComponentProps> = ({
  title,
  description,
  onClickCallback,
  ErrorBoundaryFallback = DefaultErrorBoundaryFallback,
  buttonAriaLabel = 'Click me',
  buttonText = 'Click me',
  loadingText = 'Loading...',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleClick = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await onClickCallback();
    } catch (err) {
      const safeError = err instanceof Error ? err : new Error(String(err)); // Ensure err is always an Error object
      setError(safeError);
      console.error('Error in MyComponent:', safeError);
    } finally {
      setIsLoading(false);
    }
  }, [onClickCallback]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault(); // Prevent scrolling
        handleClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClick]);

  const buttonLabel = isLoading ? loadingText : buttonText;
  const ariaLabel = isLoading ? loadingText : buttonAriaLabel;

  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      <button
        onClick={handleClick}
        disabled={isLoading}
        aria-label={ariaLabel}
        aria-busy={isLoading}
        tabIndex={0}
      >
        {buttonLabel}
      </button>
      {error && (
        <ErrorBoundaryFallback error={error} />
      )}
    </div>
  );
};

export default MyComponent;