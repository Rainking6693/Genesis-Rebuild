import React, { ReactNode, ErrorInfo, ComponentType } from 'react';
import { useErrorTracker } from 'your-error-tracking-library';

type Props = {
  message: string;
  ErrorComponent?: ComponentType<any>;
};

type State = Readonly<{
  hasError: boolean;
  error?: Error;
}>;

class MyComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ hasError: true, error });
    MyComponent.useErrorTracker(error);
  }

  render() {
    const { hasError, error } = this.state;
    const { ErrorComponent = DefaultErrorComponent } = this.props;

    if (hasError) {
      return <ErrorComponent error={error} />;
    }

    return <div>{this.props.message}</div>;
  }
}

const DefaultErrorComponent: React.FC<{ error: Error }> = ({ error }) => (
  <div role="alert">
    <h2>An error occurred:</h2>
    <pre>{error.message}</pre>
    {/* You can add additional error details or a link to report the error here */}
  </div>
);

export default MyComponent;

import React, { ReactNode, ErrorInfo, ComponentType } from 'react';
import { useErrorTracker } from 'your-error-tracking-library';

type Props = {
  message: string;
  ErrorComponent?: ComponentType<any>;
};

type State = Readonly<{
  hasError: boolean;
  error?: Error;
}>;

class MyComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ hasError: true, error });
    MyComponent.useErrorTracker(error);
  }

  render() {
    const { hasError, error } = this.state;
    const { ErrorComponent = DefaultErrorComponent } = this.props;

    if (hasError) {
      return <ErrorComponent error={error} />;
    }

    return <div>{this.props.message}</div>;
  }
}

const DefaultErrorComponent: React.FC<{ error: Error }> = ({ error }) => (
  <div role="alert">
    <h2>An error occurred:</h2>
    <pre>{error.message}</pre>
    {/* You can add additional error details or a link to report the error here */}
  </div>
);

export default MyComponent;