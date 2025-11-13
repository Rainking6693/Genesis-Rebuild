import React, { ErrorInfo, ReactNode, useState } from 'react';

interface Props {
  message: string;
  errorMessage?: string;
  errorFallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error | null;
  errorInfo?: ErrorInfo | null;
}

const MyComponent: React.FC<Props> = (props) => {
  const [state, setState] = useState<State>({ hasError: false, error: null, errorInfo: null });

  React.useEffect(() => {
    const handleError = (error: Error, info: ErrorInfo) => {
      console.error(error, info);
      setState({ hasError: true, error, errorInfo });
    };

    // Add error handling for synchronous errors
    try {
      // Your component logic here
    } catch (error) {
      handleError(error, undefined);
    }

    // Add error handling for asynchronous errors
    const subscription = window.addEventListener('error', (event) => {
      handleError(new Error(event.message), event);
    });

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('error', subscription);
    };
  }, []);

  if (state.hasError) {
    return props.errorFallback || (
      <div role="alert">
        <h2>An error occurred:</h2>
        <p>{state.error?.message || 'An unknown error occurred.'}</p>
        {state.errorInfo && (
          <pre>{JSON.stringify(state.errorInfo, null, 2)}</pre>
        )}
      </div>
    );
  }

  return <div>{props.message}</div>;
};

export default MyComponent;

import React, { ErrorInfo, ReactNode, useState } from 'react';

interface Props {
  message: string;
  errorMessage?: string;
  errorFallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error | null;
  errorInfo?: ErrorInfo | null;
}

const MyComponent: React.FC<Props> = (props) => {
  const [state, setState] = useState<State>({ hasError: false, error: null, errorInfo: null });

  React.useEffect(() => {
    const handleError = (error: Error, info: ErrorInfo) => {
      console.error(error, info);
      setState({ hasError: true, error, errorInfo });
    };

    // Add error handling for synchronous errors
    try {
      // Your component logic here
    } catch (error) {
      handleError(error, undefined);
    }

    // Add error handling for asynchronous errors
    const subscription = window.addEventListener('error', (event) => {
      handleError(new Error(event.message), event);
    });

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('error', subscription);
    };
  }, []);

  if (state.hasError) {
    return props.errorFallback || (
      <div role="alert">
        <h2>An error occurred:</h2>
        <p>{state.error?.message || 'An unknown error occurred.'}</p>
        {state.errorInfo && (
          <pre>{JSON.stringify(state.errorInfo, null, 2)}</pre>
        )}
      </div>
    );
  }

  return <div>{props.message}</div>;
};

export default MyComponent;