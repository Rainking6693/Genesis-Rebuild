import React, { ReactNode, ErrorInfo, ComponentType } from 'react';

interface Props {
  errorMessage: string; // Use errorMessage instead of message for better semantics
}

const ErrorComponent: React.FC<Props> = ({ errorMessage }) => {
  return (
    <div className="error" role="alert">
      <h2>Error</h2>
      <p>{errorMessage}</p>
      <button type="button" aria-label="Close error message">Close</button>
    </div>
  );
};

// Add a custom error boundary for better error handling
class GlobalErrorBoundary extends React.Component<ReactNode, { hasError: boolean }> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo); // Log the error to an error reporting service
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorComponent errorMessage="An error occurred. Please try again later." />;
    }

    return this.props.children;
  }
}

// Wrap your component with the error boundary
const withErrorBoundary = (WrappedComponent: ComponentType<any>) => {
  return class extends React.Component<Props> {
    render() {
      return (
        <GlobalErrorBoundary>
          {this.props.errorMessage && <ErrorComponent errorMessage={this.props.errorMessage} />}
          <WrappedComponent {...this.props} />
        </GlobalErrorBoundary>
      );
    }
  };
};

// Use the withErrorBoundary higher-order component to wrap your component
const MyComponent: React.FC<Props> = ({ errorMessage }) => {
  return (
    <withErrorBoundary>
      {errorMessage && <ErrorComponent errorMessage={errorMessage} />}
      {/* Rest of your component */}
    </withErrorBoundary>
  );
};

export default MyComponent;

import React, { ReactNode, ErrorInfo, ComponentType } from 'react';

interface Props {
  errorMessage: string; // Use errorMessage instead of message for better semantics
}

const ErrorComponent: React.FC<Props> = ({ errorMessage }) => {
  return (
    <div className="error" role="alert">
      <h2>Error</h2>
      <p>{errorMessage}</p>
      <button type="button" aria-label="Close error message">Close</button>
    </div>
  );
};

// Add a custom error boundary for better error handling
class GlobalErrorBoundary extends React.Component<ReactNode, { hasError: boolean }> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo); // Log the error to an error reporting service
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorComponent errorMessage="An error occurred. Please try again later." />;
    }

    return this.props.children;
  }
}

// Wrap your component with the error boundary
const withErrorBoundary = (WrappedComponent: ComponentType<any>) => {
  return class extends React.Component<Props> {
    render() {
      return (
        <GlobalErrorBoundary>
          {this.props.errorMessage && <ErrorComponent errorMessage={this.props.errorMessage} />}
          <WrappedComponent {...this.props} />
        </GlobalErrorBoundary>
      );
    }
  };
};

// Use the withErrorBoundary higher-order component to wrap your component
const MyComponent: React.FC<Props> = ({ errorMessage }) => {
  return (
    <withErrorBoundary>
      {errorMessage && <ErrorComponent errorMessage={errorMessage} />}
      {/* Rest of your component */}
    </withErrorBoundary>
  );
};

export default MyComponent;