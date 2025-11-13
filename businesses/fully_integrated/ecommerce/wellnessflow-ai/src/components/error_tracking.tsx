import React, { useState, useCallback, useEffect } from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, info: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  info: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error, info: null };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in App

    this.setState({ error: error, info: info });

    if (this.props.onError) {
      this.props.onError(error, info);
    } else {
      console.error('Caught an error in ErrorBoundary:', error, info);
      // You can also log the error to an error reporting service
      // logErrorToMyService(error, info.componentStack);
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

interface MyComponentProps {
  title: string;
  description: string;
  onClick: () => Promise<void>; // Allow async onClick
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  loadingLabel?: string;
  defaultLabel?: string;
  disabled?: boolean;
}

const MyComponent: React.FC<MyComponentProps> = ({
  title,
  description,
  onClick,
  onSuccess,
  onError,
  loadingLabel = 'Loading...',
  defaultLabel = 'Click me',
  disabled = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleClick = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      if (isLoading || disabled) {
        return; // Prevent multiple clicks or clicks when disabled
      }

      setIsLoading(true);
      setError(null); // Clear any previous errors

      try {
        await onClick(); // Await the promise
        if (onSuccess) {
          onSuccess();
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error('Error in MyComponent:', error);
        setError(error);
        if (onError) {
          onError(error);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, onClick, onSuccess, onError, disabled]
  );

  // Reset error after a delay
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000); // Display error for 5 seconds

      return () => clearTimeout(timer); // Cleanup on unmount or error change
    }
  }, [error]);

  const buttonLabel = isLoading ? loadingLabel : defaultLabel;

  return (
    <ErrorBoundary
      fallback={
        <div>
          <h3>Error in component</h3>
          <p>Please try again later.</p>
        </div>
      }
      onError={(error, info) => {
        console.error('ErrorBoundary caught error:', error, info);
      }}
    >
      <div data-testid="my-component">
        <h2>{title}</h2>
        <p>{description}</p>
        <button
          onClick={handleClick}
          data-testid="my-component-button"
          disabled={isLoading || disabled}
          aria-label={buttonLabel}
        >
          {buttonLabel}
        </button>
        {error && (
          <div
            style={{
              color: 'red',
              marginTop: '10px',
              border: '1px solid red',
              padding: '5px',
            }}
            aria-live="polite"
          >
            Error: {error.message}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default MyComponent;

import React, { useState, useCallback, useEffect } from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, info: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  info: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error, info: null };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in App

    this.setState({ error: error, info: info });

    if (this.props.onError) {
      this.props.onError(error, info);
    } else {
      console.error('Caught an error in ErrorBoundary:', error, info);
      // You can also log the error to an error reporting service
      // logErrorToMyService(error, info.componentStack);
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

interface MyComponentProps {
  title: string;
  description: string;
  onClick: () => Promise<void>; // Allow async onClick
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  loadingLabel?: string;
  defaultLabel?: string;
  disabled?: boolean;
}

const MyComponent: React.FC<MyComponentProps> = ({
  title,
  description,
  onClick,
  onSuccess,
  onError,
  loadingLabel = 'Loading...',
  defaultLabel = 'Click me',
  disabled = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleClick = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      if (isLoading || disabled) {
        return; // Prevent multiple clicks or clicks when disabled
      }

      setIsLoading(true);
      setError(null); // Clear any previous errors

      try {
        await onClick(); // Await the promise
        if (onSuccess) {
          onSuccess();
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error('Error in MyComponent:', error);
        setError(error);
        if (onError) {
          onError(error);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, onClick, onSuccess, onError, disabled]
  );

  // Reset error after a delay
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000); // Display error for 5 seconds

      return () => clearTimeout(timer); // Cleanup on unmount or error change
    }
  }, [error]);

  const buttonLabel = isLoading ? loadingLabel : defaultLabel;

  return (
    <ErrorBoundary
      fallback={
        <div>
          <h3>Error in component</h3>
          <p>Please try again later.</p>
        </div>
      }
      onError={(error, info) => {
        console.error('ErrorBoundary caught error:', error, info);
      }}
    >
      <div data-testid="my-component">
        <h2>{title}</h2>
        <p>{description}</p>
        <button
          onClick={handleClick}
          data-testid="my-component-button"
          disabled={isLoading || disabled}
          aria-label={buttonLabel}
        >
          {buttonLabel}
        </button>
        {error && (
          <div
            style={{
              color: 'red',
              marginTop: '10px',
              border: '1px solid red',
              padding: '5px',
            }}
            aria-live="polite"
          >
            Error: {error.message}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default MyComponent;