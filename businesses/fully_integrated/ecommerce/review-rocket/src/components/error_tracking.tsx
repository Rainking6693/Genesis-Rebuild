import React, { useState, useEffect, ErrorInfo } from 'react';
import { logError } from './error_logging_service'; // Import your error logging service

interface ErrorBoundaryProps {
  children: React.ReactNode;
  componentName?: string; // Optional: Name of the component being wrapped
  fallbackComponent?: React.ReactNode; // Custom fallback component
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    logError(error, errorInfo, this.props.componentName);
    this.setState({ errorInfo: errorInfo }); // Store error info for display
  }

  render() {
    if (this.state.hasError) {
      // Render the custom fallback component if provided, otherwise use the default fallback
      return this.props.fallbackComponent || (
        <div role="alert">
          <h2>Something went wrong in {this.props.componentName || 'this component'}.</h2>
          <p>Please try again later. If the problem persists, contact support.</p>
          {process.env.NODE_ENV === 'development' && (
            <>
              <h3>Error Details:</h3>
              <details style={{ whiteSpace: 'pre-wrap' }}>
                {this.state.error && <p>Error: {this.state.error.message}</p>}
                {this.state.errorInfo && (
                  <>
                    <p>Stack Trace:</p>
                    <p>{this.state.errorInfo.componentStack}</p>
                  </>
                )}
              </details>
            </>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// Example error logging service (replace with your actual implementation)
export const logError = (error: Error, errorInfo: ErrorInfo, componentName?: string) => {
  console.error(`Error in component ${componentName || 'Unknown'}:`, error, errorInfo);
  // Send error to a logging service like Sentry, Bugsnag, or your own API
  // Example:
  // fetch('/api/log-error', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     error: error.message,
  //     stackTrace: errorInfo.componentStack,
  //     componentName: componentName,
  //   }),
  // });
};

interface MyComponentProps {
  title?: string; // Optional title
  content?: string; // Optional content
  isLoading?: boolean; // Optional loading state
}

const MyComponent: React.FC<MyComponentProps> = ({ title = 'Default Title', content = 'Default Content', isLoading = false }) => {
  const [localTitle, setLocalTitle] = useState<string>(title);
  const [localContent, setLocalContent] = useState<string>(content);

  useEffect(() => {
    setLocalTitle(title);
  }, [title]);

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  if (isLoading) {
    return <div data-testid="my-component-loading">Loading...</div>; // Display loading indicator
  }

  // Handle empty strings gracefully
  const safeTitle = typeof title === 'string' ? title : 'Invalid Title';
  const safeContent = typeof content === 'string' ? content : 'Invalid Content';

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalTitle(event.target.value);
  };

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalContent(event.target.value);
  };

  return (
    <div data-testid="my-component">
      <label htmlFor="title-input">Title:</label>
      <input
        type="text"
        id="title-input"
        data-testid="title-input"
        value={localTitle}
        onChange={handleTitleChange}
        aria-label="Title input"
      />

      <h1 data-testid="title">{safeTitle}</h1>

      <label htmlFor="content-textarea">Content:</label>
      <textarea
        id="content-textarea"
        data-testid="content-textarea"
        value={localContent}
        onChange={handleContentChange}
        aria-label="Content input"
      />
      <p data-testid="content">{safeContent}</p>
    </div>
  );
};

export const WrappedMyComponent = (props: MyComponentProps) => (
  <ErrorBoundary componentName="MyComponent" fallbackComponent={<div>An error occurred. Please try again later.</div>}>
    <MyComponent {...props} />
  </ErrorBoundary>
);

export default WrappedMyComponent;

import React, { useState, useEffect, ErrorInfo } from 'react';
import { logError } from './error_logging_service'; // Import your error logging service

interface ErrorBoundaryProps {
  children: React.ReactNode;
  componentName?: string; // Optional: Name of the component being wrapped
  fallbackComponent?: React.ReactNode; // Custom fallback component
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    logError(error, errorInfo, this.props.componentName);
    this.setState({ errorInfo: errorInfo }); // Store error info for display
  }

  render() {
    if (this.state.hasError) {
      // Render the custom fallback component if provided, otherwise use the default fallback
      return this.props.fallbackComponent || (
        <div role="alert">
          <h2>Something went wrong in {this.props.componentName || 'this component'}.</h2>
          <p>Please try again later. If the problem persists, contact support.</p>
          {process.env.NODE_ENV === 'development' && (
            <>
              <h3>Error Details:</h3>
              <details style={{ whiteSpace: 'pre-wrap' }}>
                {this.state.error && <p>Error: {this.state.error.message}</p>}
                {this.state.errorInfo && (
                  <>
                    <p>Stack Trace:</p>
                    <p>{this.state.errorInfo.componentStack}</p>
                  </>
                )}
              </details>
            </>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// Example error logging service (replace with your actual implementation)
export const logError = (error: Error, errorInfo: ErrorInfo, componentName?: string) => {
  console.error(`Error in component ${componentName || 'Unknown'}:`, error, errorInfo);
  // Send error to a logging service like Sentry, Bugsnag, or your own API
  // Example:
  // fetch('/api/log-error', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     error: error.message,
  //     stackTrace: errorInfo.componentStack,
  //     componentName: componentName,
  //   }),
  // });
};

interface MyComponentProps {
  title?: string; // Optional title
  content?: string; // Optional content
  isLoading?: boolean; // Optional loading state
}

const MyComponent: React.FC<MyComponentProps> = ({ title = 'Default Title', content = 'Default Content', isLoading = false }) => {
  const [localTitle, setLocalTitle] = useState<string>(title);
  const [localContent, setLocalContent] = useState<string>(content);

  useEffect(() => {
    setLocalTitle(title);
  }, [title]);

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  if (isLoading) {
    return <div data-testid="my-component-loading">Loading...</div>; // Display loading indicator
  }

  // Handle empty strings gracefully
  const safeTitle = typeof title === 'string' ? title : 'Invalid Title';
  const safeContent = typeof content === 'string' ? content : 'Invalid Content';

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalTitle(event.target.value);
  };

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalContent(event.target.value);
  };

  return (
    <div data-testid="my-component">
      <label htmlFor="title-input">Title:</label>
      <input
        type="text"
        id="title-input"
        data-testid="title-input"
        value={localTitle}
        onChange={handleTitleChange}
        aria-label="Title input"
      />

      <h1 data-testid="title">{safeTitle}</h1>

      <label htmlFor="content-textarea">Content:</label>
      <textarea
        id="content-textarea"
        data-testid="content-textarea"
        value={localContent}
        onChange={handleContentChange}
        aria-label="Content input"
      />
      <p data-testid="content">{safeContent}</p>
    </div>
  );
};

export const WrappedMyComponent = (props: MyComponentProps) => (
  <ErrorBoundary componentName="MyComponent" fallbackComponent={<div>An error occurred. Please try again later.</div>}>
    <MyComponent {...props} />
  </ErrorBoundary>
);

export default WrappedMyComponent;