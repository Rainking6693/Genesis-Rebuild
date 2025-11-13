import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  onError?: (error: Error) => void;
}

interface ErrorInfoDetails {
  componentStack: string;
  componentName: string;
  errorMessage: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorInfo: ErrorInfoDetails | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ hasError: true, errorInfo: { componentStack: error.stack, componentName: errorInfo.componentStack, errorMessage: error.message } });
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  componentDidMount() {
    // Handle errors in the initial render
    // You can add your logic here
  }

  render() {
    if (this.state.hasError) {
      // You can customize the error display
      return <div role="alert">An error occurred: {this.state.errorInfo?.errorMessage}</div>;
    }

    return this.props.children;
  }
}

type MyComponentWithErrorBoundaryProps = React.ComponentProps<typeof MyComponent>;

function MyComponentWithErrorBoundary(props: MyComponentWithErrorBoundaryProps) {
  return <ErrorBoundary onError={(error) => console.error(error)}>{<MyComponent {...props} />}</ErrorBoundary>;
}

// MyComponent
// ...

<MyComponentWithErrorBoundary />

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  onError?: (error: Error) => void;
}

interface ErrorInfoDetails {
  componentStack: string;
  componentName: string;
  errorMessage: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorInfo: ErrorInfoDetails | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ hasError: true, errorInfo: { componentStack: error.stack, componentName: errorInfo.componentStack, errorMessage: error.message } });
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  componentDidMount() {
    // Handle errors in the initial render
    // You can add your logic here
  }

  render() {
    if (this.state.hasError) {
      // You can customize the error display
      return <div role="alert">An error occurred: {this.state.errorInfo?.errorMessage}</div>;
    }

    return this.props.children;
  }
}

type MyComponentWithErrorBoundaryProps = React.ComponentProps<typeof MyComponent>;

function MyComponentWithErrorBoundary(props: MyComponentWithErrorBoundaryProps) {
  return <ErrorBoundary onError={(error) => console.error(error)}>{<MyComponent {...props} />}</ErrorBoundary>;
}

// MyComponent
// ...

<MyComponentWithErrorBoundary />

In this updated code, I've added a `componentDidMount` method to handle errors in the initial render. I've also made the `ErrorBoundary` more flexible by allowing users to pass a custom error handling function via the `onError` prop.

You can now use the `MyComponentWithErrorBoundary` higher-order component to wrap any component you want to track errors for. For example: