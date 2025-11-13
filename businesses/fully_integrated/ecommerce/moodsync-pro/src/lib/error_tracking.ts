import React, { FC, RefObject, useEffect, useRef } from 'react';

interface Props {
  errorMessage: string; // Rename 'message' to 'errorMessage' for better clarity
}

const ErrorComponent: FC<Props> = ({ errorMessage }) => {
  return (
    <div className="error-message" role="alert">
      {errorMessage}
    </div>
  );
};

// Add a custom error-handling component for better error handling and user experience
const ErrorBoundary: FC<{ children: React.ReactNode; onError?: (error: Error) => void }> = ({ children, onError }) => {
  const [error, setError] = React.useState(null);
  const errorRef = useRef(null);

  useEffect(() => {
    const errorHandler = (error: Error) => {
      setError(error);
      onError && onError(error);
    };

    // Catch errors in React components, third-party libraries, and browser
    const globalErrorHandler = (event: ErrorEvent) => {
      if (event.error) {
        errorHandler(event.error);
      }
    };

    // Prevent default error handling and bubble up custom error handling
    window.onerror = globalErrorHandler;

    return () => {
      window.onerror = null;
    };
  }, [onError]);

  return (
    <>
      {error && <ErrorComponent errorMessage={error.message} ref={errorRef} />}
      {children}
    </>
  );
};

// Wrap your component with the ErrorBoundary component
const MyComponent: FC<Props & { ref?: RefObject<HTMLDivElement> }> = ({ errorMessage, ref }) => {
  return <div ref={ref}>{errorMessage}</div>;
};

// Wrap your component with the ErrorBoundary component
MyComponent = React.forwardRef((props, ref) => (
  <ErrorBoundary {...props} ref={ref}>
    <MyComponent {...props} />
  </ErrorBoundary>
));

export { ErrorComponent, ErrorBoundary, MyComponent };

1. Renamed `message` to `errorMessage` for better clarity.
2. Added a `role="alert"` to the `ErrorComponent` for better accessibility.
3. Added an optional `onError` prop to the `ErrorBoundary` component to allow custom error handling.
4. Implemented a global error handler to catch errors in React components, third-party libraries, and the browser.
5. Added a cleanup function to remove the global error handler when the component unmounts.
6. Added a `ref` prop to the `MyComponent` for potential future use cases.
7. Updated the `MyComponent` to use the `ref` prop when wrapping it with the `ErrorBoundary`.
8. Added a `ref` to the `ErrorComponent` for potential future use cases.