import React, { FC, ReactNode, useEffect, useState } from 'react';

interface Props {
  errorMessage: string; // Use errorMessage instead of message for better semantics
}

const ErrorComponent: FC<Props> = ({ errorMessage }) => {
  return (
    <div className="error-message" role="alert">
      <h2 className="sr-only">Error message</h2> // Add screen reader text for accessibility
      {errorMessage}
    </div>
  );
};

// Add a custom error boundary to handle errors at the component tree level
class CustomErrorBoundary extends React.Component<{}, { hasError: boolean }> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): { hasError: boolean } {
    // This method is called in development only, and only if an error is caught
    // You can use it to transition to an error page.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ hasError: true });
    // Log the error to an error reporting service
    // For example, Sentry or Bugsnag
    console.error(error); // Temporary logging until the error reporting service is integrated
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: React.ReactNode): void {
    // Check if the errorMessage prop has changed and update the state accordingly
    if (prevProps.errorMessage !== this.props.errorMessage) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      // Render the error component
      return <ErrorComponent errorMessage="An error occurred. Please refresh the page." />;
    }

    // Otherwise, render children components
    return this.props.children;
  }
}

// Wrap the MyComponent with the custom error boundary
const MyComponentWithErrorBoundary = (WrappedComponent: FC<any>) => {
  return (props: any) => (
    <CustomErrorBoundary>
      <WrappedComponent {...props} />
    </CustomErrorBoundary>
  );
};

export default MyComponentWithErrorBoundary(MyComponent);

import React, { FC, ReactNode, useEffect, useState } from 'react';

interface Props {
  errorMessage: string; // Use errorMessage instead of message for better semantics
}

const ErrorComponent: FC<Props> = ({ errorMessage }) => {
  return (
    <div className="error-message" role="alert">
      <h2 className="sr-only">Error message</h2> // Add screen reader text for accessibility
      {errorMessage}
    </div>
  );
};

// Add a custom error boundary to handle errors at the component tree level
class CustomErrorBoundary extends React.Component<{}, { hasError: boolean }> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): { hasError: boolean } {
    // This method is called in development only, and only if an error is caught
    // You can use it to transition to an error page.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ hasError: true });
    // Log the error to an error reporting service
    // For example, Sentry or Bugsnag
    console.error(error); // Temporary logging until the error reporting service is integrated
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: React.ReactNode): void {
    // Check if the errorMessage prop has changed and update the state accordingly
    if (prevProps.errorMessage !== this.props.errorMessage) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      // Render the error component
      return <ErrorComponent errorMessage="An error occurred. Please refresh the page." />;
    }

    // Otherwise, render children components
    return this.props.children;
  }
}

// Wrap the MyComponent with the custom error boundary
const MyComponentWithErrorBoundary = (WrappedComponent: FC<any>) => {
  return (props: any) => (
    <CustomErrorBoundary>
      <WrappedComponent {...props} />
    </CustomErrorBoundary>
  );
};

export default MyComponentWithErrorBoundary(MyComponent);