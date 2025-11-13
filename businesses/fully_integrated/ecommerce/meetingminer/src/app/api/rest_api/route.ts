import React, { FC, ReactNode, ComponentType, ErrorInfo } from 'react';

interface MessageProps {
  message: string;
  error?: boolean;
  children?: ReactNode;
}

const BaseMessage: FC<MessageProps> = ({ message, error = false, children }) => {
  const messageClass = error ? 'error-message' : 'message';

  return (
    <div className={messageClass}>
      {children || message}
      <span className="sr-only">{message}</span>
    </div>
  );
};

const MessageComponent: FC<MessageProps> = ({ message }) => {
  return <BaseMessage message={message} />;
};

const ErrorMessageComponent: FC<MessageProps> = ({ message }) => {
  return <BaseMessage message={message} error={true} />;
};

export { MessageComponent, ErrorMessageComponent };

// Adding a custom error boundary to handle API errors
interface ErrorBoundaryProps {
  FallbackComponent: ComponentType<any>;
}

class CustomErrorBoundary extends React.Component<ErrorBoundaryProps> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryProps> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled error:', error, info);
  }

  render() {
    const { FallbackComponent } = this.props;
    const { hasError } = this.state;

    return hasError ? (
      <FallbackComponent />
    ) : (
      <React.Fragment>{this.props.children}</React.Fragment>
    );
  }
}

export const APIErrorBoundary = (WrappedComponent: ComponentType<any>) => {
  return (props: any) => (
    <ErrorBoundary FallbackComponent={ErrorMessageComponent}>
      <CustomErrorBoundary>
        <WrappedComponent {...props} />
      </CustomErrorBoundary>
    </ErrorBoundary>
  );
};

import React, { FC, ReactNode, ComponentType, ErrorInfo } from 'react';

interface MessageProps {
  message: string;
  error?: boolean;
  children?: ReactNode;
}

const BaseMessage: FC<MessageProps> = ({ message, error = false, children }) => {
  const messageClass = error ? 'error-message' : 'message';

  return (
    <div className={messageClass}>
      {children || message}
      <span className="sr-only">{message}</span>
    </div>
  );
};

const MessageComponent: FC<MessageProps> = ({ message }) => {
  return <BaseMessage message={message} />;
};

const ErrorMessageComponent: FC<MessageProps> = ({ message }) => {
  return <BaseMessage message={message} error={true} />;
};

export { MessageComponent, ErrorMessageComponent };

// Adding a custom error boundary to handle API errors
interface ErrorBoundaryProps {
  FallbackComponent: ComponentType<any>;
}

class CustomErrorBoundary extends React.Component<ErrorBoundaryProps> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryProps> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled error:', error, info);
  }

  render() {
    const { FallbackComponent } = this.props;
    const { hasError } = this.state;

    return hasError ? (
      <FallbackComponent />
    ) : (
      <React.Fragment>{this.props.children}</React.Fragment>
    );
  }
}

export const APIErrorBoundary = (WrappedComponent: ComponentType<any>) => {
  return (props: any) => (
    <ErrorBoundary FallbackComponent={ErrorMessageComponent}>
      <CustomErrorBoundary>
        <WrappedComponent {...props} />
      </CustomErrorBoundary>
    </ErrorBoundary>
  );
};