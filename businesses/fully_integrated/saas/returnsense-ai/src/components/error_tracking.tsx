import React, { ErrorBoundary, ReactNode, useEffect, useState } from 'react';

interface Props {
  errorMessage: string; // Use errorMessage instead of message for better semantics
}

const ErrorComponent: React.FC<Props> = ({ errorMessage }) => {
  return (
    <div className="error-message" role="alert">
      {errorMessage}
      <button onClick={() => window.location.reload()}>Refresh</button>
      <button onClick={() => window.open('mailto:support@yourcompany.com', '_blank')}>Contact Support</button>
    </div>
  );
};

// Add a custom error boundary to handle and log errors
class CustomErrorBoundary extends ErrorBoundary {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to an error tracking service like Sentry
    // You can use a library like axios to send the error data to your backend
    console.error('Unhandled error:', error);
    this.setState({ hasError: true });
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.errorMessage !== prevProps.errorMessage && !this.state.hasError) {
      this.setState({ hasError: true });
    }
  }

  render() {
    if (this.state.hasError) {
      // You can replace ErrorComponent with a custom component that displays a user-friendly error message
      return <ErrorComponent errorMessage={this.props.errorMessage} />;
    }

    // Render children if there's no error
    const children = this.props.children as ReactNode;
    return children;
  }
}

// Wrap your components with the custom error boundary
const MyComponent: React.FC<Props> = ({ errorMessage }) => {
  const [localErrorMessage, setLocalErrorMessage] = useState(errorMessage);

  useEffect(() => {
    setLocalErrorMessage(errorMessage);
  }, [errorMessage]);

  const fallback = <CustomErrorBoundary errorMessage={localErrorMessage} />;

  return (
    <React.Suspense fallback={fallback}>
      {errorMessage ? <ErrorComponent errorMessage={errorMessage} /> : <>{fallback}</>}
    </React.Suspense>
  );
};

export default MyComponent;

import React, { ErrorBoundary, ReactNode, useEffect, useState } from 'react';

interface Props {
  errorMessage: string; // Use errorMessage instead of message for better semantics
}

const ErrorComponent: React.FC<Props> = ({ errorMessage }) => {
  return (
    <div className="error-message" role="alert">
      {errorMessage}
      <button onClick={() => window.location.reload()}>Refresh</button>
      <button onClick={() => window.open('mailto:support@yourcompany.com', '_blank')}>Contact Support</button>
    </div>
  );
};

// Add a custom error boundary to handle and log errors
class CustomErrorBoundary extends ErrorBoundary {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to an error tracking service like Sentry
    // You can use a library like axios to send the error data to your backend
    console.error('Unhandled error:', error);
    this.setState({ hasError: true });
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.errorMessage !== prevProps.errorMessage && !this.state.hasError) {
      this.setState({ hasError: true });
    }
  }

  render() {
    if (this.state.hasError) {
      // You can replace ErrorComponent with a custom component that displays a user-friendly error message
      return <ErrorComponent errorMessage={this.props.errorMessage} />;
    }

    // Render children if there's no error
    const children = this.props.children as ReactNode;
    return children;
  }
}

// Wrap your components with the custom error boundary
const MyComponent: React.FC<Props> = ({ errorMessage }) => {
  const [localErrorMessage, setLocalErrorMessage] = useState(errorMessage);

  useEffect(() => {
    setLocalErrorMessage(errorMessage);
  }, [errorMessage]);

  const fallback = <CustomErrorBoundary errorMessage={localErrorMessage} />;

  return (
    <React.Suspense fallback={fallback}>
      {errorMessage ? <ErrorComponent errorMessage={errorMessage} /> : <>{fallback}</>}
    </React.Suspense>
  );
};

export default MyComponent;