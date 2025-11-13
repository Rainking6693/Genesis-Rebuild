import React, { FC, useEffect, useCallback, SetStateAction } from 'react';

interface Props {
  errorMessage: string; // Use errorMessage instead of message for better semantics
}

const ErrorComponent: FC<Props> = ({ errorMessage }) => {
  return (
    <div className="error-message" role="alert">
      {errorMessage}
    </div>
  );
};

// Add a custom error boundary component to handle errors at the component tree level
const ErrorBoundary: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const reportError = useCallback((error: Error, componentStack: string) => {
    // Log the error and component stack to a centralized error tracking service
    // For example, Sentry or Rollbar
    console.error(error.stack);
  }, []);

  const wrapper = useCallback(
    (WrappedComponent: React.ComponentType<any>) => {
      return class extends React.Component<any> {
        componentDidCatch(error: Error, info: React.ErrorInfo) {
          reportError(error, error.stack);
        }

        render() {
          return <WrappedComponent {...this.props} />;
        }
      };
    },
    [reportError]
  );

  useEffect(() => {
    const handleError = (error: Error) => {
      setHasError(true);
      setErrorMessage(error.message);
      reportError(error, error.stack);
    };

    // Add error handling for components in the children tree
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type && !child.type.displayName) {
        child.type = wrapper(child.type);
      }
    });

    // Handle errors that occur during rendering
    const catchRenderError = (error: Error) => {
      setHasError(true);
      setErrorMessage(error.message);
      reportError(error, error.stack);
    };

    // Prevent JavaScript errors from crashing the application
    window.onerror = (message, source, line, column, error) => {
      handleError(new Error(message));
      return true;
    };

    // Clean up the error state when the component unmounts
    return () => {
      setHasError(false);
      setErrorMessage('');
    };
  }, [reportError]);

  return (
    <>
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? (
          <ErrorComponent errorMessage={hasError ? errorMessage : ''} key={child.key}>
            {child.props.children}
          </ErrorComponent>
        ) : (
          child
        )
      )}
      {hasError && (
        <div className="global-error-message" role="alert">
          {errorMessage}
          <br />
          Please refresh the page or contact support.
        </div>
      )}
    </>
  );
};

// Use the ErrorBoundary component to wrap the MyComponent
export const MyComponent = () => {
  const [message, setMessage] = React.useState('');

  // Fetch error messages from a centralized error tracking service
  // ...

  return <ErrorBoundary>{message && <ErrorComponent errorMessage={message} />}</ErrorBoundary>;
};

import React, { FC, useEffect, useCallback, SetStateAction } from 'react';

interface Props {
  errorMessage: string; // Use errorMessage instead of message for better semantics
}

const ErrorComponent: FC<Props> = ({ errorMessage }) => {
  return (
    <div className="error-message" role="alert">
      {errorMessage}
    </div>
  );
};

// Add a custom error boundary component to handle errors at the component tree level
const ErrorBoundary: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const reportError = useCallback((error: Error, componentStack: string) => {
    // Log the error and component stack to a centralized error tracking service
    // For example, Sentry or Rollbar
    console.error(error.stack);
  }, []);

  const wrapper = useCallback(
    (WrappedComponent: React.ComponentType<any>) => {
      return class extends React.Component<any> {
        componentDidCatch(error: Error, info: React.ErrorInfo) {
          reportError(error, error.stack);
        }

        render() {
          return <WrappedComponent {...this.props} />;
        }
      };
    },
    [reportError]
  );

  useEffect(() => {
    const handleError = (error: Error) => {
      setHasError(true);
      setErrorMessage(error.message);
      reportError(error, error.stack);
    };

    // Add error handling for components in the children tree
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type && !child.type.displayName) {
        child.type = wrapper(child.type);
      }
    });

    // Handle errors that occur during rendering
    const catchRenderError = (error: Error) => {
      setHasError(true);
      setErrorMessage(error.message);
      reportError(error, error.stack);
    };

    // Prevent JavaScript errors from crashing the application
    window.onerror = (message, source, line, column, error) => {
      handleError(new Error(message));
      return true;
    };

    // Clean up the error state when the component unmounts
    return () => {
      setHasError(false);
      setErrorMessage('');
    };
  }, [reportError]);

  return (
    <>
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? (
          <ErrorComponent errorMessage={hasError ? errorMessage : ''} key={child.key}>
            {child.props.children}
          </ErrorComponent>
        ) : (
          child
        )
      )}
      {hasError && (
        <div className="global-error-message" role="alert">
          {errorMessage}
          <br />
          Please refresh the page or contact support.
        </div>
      )}
    </>
  );
};

// Use the ErrorBoundary component to wrap the MyComponent
export const MyComponent = () => {
  const [message, setMessage] = React.useState('');

  // Fetch error messages from a centralized error tracking service
  // ...

  return <ErrorBoundary>{message && <ErrorComponent errorMessage={message} />}</ErrorBoundary>;
};