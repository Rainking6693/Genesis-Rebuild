import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  message: string;
  error?: Error;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class MyComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: props.error || null };
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.error && !prevState.hasError) {
      return { hasError: true, error: nextProps.error };
    }
    return null;
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ hasError: true, error });
  }

  render(): ReactNode {
    const { hasError, error } = this.state;

    return (
      <div>
        {hasError && (
          <>
            <h2>An error occurred:</h2>
            <div role="alert">{error?.message}</div>
          </>
        )}
        {!hasError && <div>{this.props.message}</div>}
      </div>
    );
  }
}

export default MyComponent;

import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  message: string;
  error?: Error;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class MyComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: props.error || null };
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.error && !prevState.hasError) {
      return { hasError: true, error: nextProps.error };
    }
    return null;
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ hasError: true, error });
  }

  render(): ReactNode {
    const { hasError, error } = this.state;

    return (
      <div>
        {hasError && (
          <>
            <h2>An error occurred:</h2>
            <div role="alert">{error?.message}</div>
          </>
        )}
        {!hasError && <div>{this.props.message}</div>}
      </div>
    );
  }
}

export default MyComponent;