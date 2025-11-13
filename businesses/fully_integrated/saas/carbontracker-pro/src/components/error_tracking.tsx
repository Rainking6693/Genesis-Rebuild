import React, { FC, ReactNode, useEffect, useState } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

interface Props {
  errorMessage: string;
  errorDetails?: string;
}

const ErrorComponent: FC<Props> = ({ errorMessage, errorDetails }) => {
  const [hasError, setHasError] = useState(!!errorMessage);
  const errorMessageRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasError(!!errorMessage);
  }, [errorMessage]);

  if (!hasError) {
    return null;
  }

  return (
    <ErrorBoundary>
      <div className="error-wrapper" data-testid="error-wrapper">
        <React.Fragment>
          <span className="sr-only">Error:</span>
          <div className="error-message" role="alert" ref={errorMessageRef}>
            <h2>{errorMessage}</h2>
            {errorDetails && <p>{errorDetails}</p>}
          </div>
        </React.Fragment>
      </div>
    </ErrorBoundary>
  );
};

// Custom error boundary to handle errors during rendering and component tree
const ErrorBoundary: React.FC<ReactNode> = (props) => {
  const [hasError, setHasError] = React.useState(false);

  useEffect(() => {
    const handleError = (error: Error) => {
      console.error('Error rendering ErrorComponent or its children:', error);
      setHasError(true);
    };

    const errorHandler = new ErrorBoundaryErrorHandler(handleError);
    errorHandler.registerComponent(props.children);

    return () => {
      errorHandler.unregisterComponent();
    };
  }, []);

  if (hasError) {
    return <div>{props.children}</div>;
  }

  return props.children;
};

// ErrorBoundaryErrorHandler to handle errors for specific components
class ErrorBoundaryErrorHandler {
  private components: Map<React.ComponentType<any>, Function>;

  constructor(private handleError: (error: Error) => void) {
    this.components = new Map();
  }

  registerComponent(component: React.ComponentType<any>) {
    this.components.set(component, this.handleError);
  }

  unregisterComponent(component: React.ComponentType<any>) {
    this.components.delete(component);
  }

  handleComponentError(error: Error, component: React.ComponentType<any>) {
    const handler = this.components.get(component);
    if (handler) {
      handler(error);
    } else {
      console.error('No error handler registered for component:', component);
    }
  }
}

export default ErrorComponent;