import React, { FC, ReactNode, useEffect, useRef } from 'react';

type ErrorMessage = string | null;
type ErrorHandler = (error: Error) => void;
type ComponentWithOnError = React.ReactElement<any> & { props: { onError?: ErrorHandler } };

interface Props {
  errorMessage?: ErrorMessage;
  children?: ReactNode;
}

const MyComponent: FC<Props> = ({ errorMessage, children }) => {
  const [message, setMessage] = React.useState<ErrorMessage>(null);
  const errorHandlerRef = useRef<ErrorHandler | null>(null);

  useEffect(() => {
    if (errorMessage) {
      setMessage(errorMessage);
    }

    if (!errorHandlerRef.current) {
      errorHandlerRef.current = handleError;
    }
  }, [errorMessage]);

  const handleError = (error: Error) => {
    setMessage(error.message);
    errorHandlerRef.current?.(error);
  };

  useEffect(() => {
    const handleGlobalError = (event: Event) => {
      const target = event.target as HTMLDivElement;
      if (target.classList.contains('error-message')) {
        return;
      }
      handleError(new Error(`Global error: ${(event.target as HTMLElement).outerHTML}`));
    };

    const errorHandler = (error: Error) => {
      handleError(error);
    };

    const currentComponent = typeof window !== 'undefined' ? window.addEventListener('error', handleGlobalError) : null;

    const childrenComponents = React.Children.toArray(children).map((child) => {
      if (child && child.type !== ErrorBoundary) {
        if (child.props.onError) {
          child.props.onError = (error) => {
            errorHandler(error);
            child.props.onError(error);
          };
        } else {
          child.props.onError = errorHandler;
        }
      }
      return child;
    });

    return () => {
      if (currentComponent) {
        window.removeEventListener('error', handleGlobalError);
      }
    };
  }, [children]);

  if (message) {
    return <div className="error-message" role="alert">{message}</div>;
  }

  return <>{children}</>;
};

// Create an ErrorBoundary component to handle errors in child components
const ErrorBoundary: FC<{ children: ReactNode }> = ({ children }) => {
  const [error, setError] = React.useState<Error | null>(null);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  const handleError = (error: Error) => {
    setError(error);
  };

  return <>{children && children.props.onError ? (<React.Fragment>{children}</React.Fragment>) : (<div onError={handleError} suppressContentEditableWarning={true} />)}</>;
};

export { MyComponent, ErrorBoundary };

In this version, I've added type definitions for `ErrorMessage`, `ErrorHandler`, and `ComponentWithOnError`. I've also made the `ErrorBoundary` component accept a `children` prop with a specific type. Additionally, I've added a global error handler that checks if the error occurred on an error message element to prevent infinite loops. Lastly, I've updated the `MyComponent` to pass the error handler to child components that don't have one already.