import React, { FC, ReactNode, useEffect, useState } from 'react';

interface Props {
  errorMessage: string; // Use errorMessage instead of message for better semantics
}

const ErrorComponent: FC<Props> = ({ errorMessage }) => {
  return (
    <div className="error-message" role="alert">
      <h2 className="sr-only">Error message</h2>
      <div className="error-message__content">
        {errorMessage}
      </div>
    </div>
  );
};

// Add a custom error boundary to handle and display errors at the component level
class CustomErrorBoundary extends React.Component<any, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state synchronously for the rendered error message
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ hasError: true });
    // Log the error to an error reporting service
    // ...
  }

  componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
    // Clear error state if the error message prop is no longer present
    if (!this.props.errorMessage && !prevProps.errorMessage && !this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      // You can return any custom error UI or redirect to an error page
      return <ErrorComponent errorMessage="An error occurred. Please try again later." />;
    }

    // Provide a fallback UI for when a child component throws an error
    return this.props.children || <div>An unexpected error occurred.</div>;
  }
}

// Wrap your MyComponent with the CustomErrorBoundary
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
      <h2 className="sr-only">Error message</h2>
      <div className="error-message__content">
        {errorMessage}
      </div>
    </div>
  );
};

// Add a custom error boundary to handle and display errors at the component level
class CustomErrorBoundary extends React.Component<any, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state synchronously for the rendered error message
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ hasError: true });
    // Log the error to an error reporting service
    // ...
  }

  componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
    // Clear error state if the error message prop is no longer present
    if (!this.props.errorMessage && !prevProps.errorMessage && !this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      // You can return any custom error UI or redirect to an error page
      return <ErrorComponent errorMessage="An error occurred. Please try again later." />;
    }

    // Provide a fallback UI for when a child component throws an error
    return this.props.children || <div>An unexpected error occurred.</div>;
  }
}

// Wrap your MyComponent with the CustomErrorBoundary
const MyComponentWithErrorBoundary = (WrappedComponent: FC<any>) => {
  return (props: any) => (
    <CustomErrorBoundary>
      <WrappedComponent {...props} />
    </CustomErrorBoundary>
  );
};

export default MyComponentWithErrorBoundary(MyComponent);