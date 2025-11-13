import React, { memo, useMemo, ReactNode } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { useErrorBoundary } from 'react-error-boundary';

interface MyComponentProps {
  title?: string | ReactNode;
  content?: string | ReactNode;
  className?: string;
  errorTitle?: string;
  errorContent?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({ title, content, className = '', errorTitle = 'Error', errorContent = 'An error occurred.', ...rest }) => {
    const { showBoundary } = useErrorBoundary();

    const safeTitle = useMemo<ReactNode>(() => {
      if (typeof title === 'string' && title.trim() === '') {
        return 'Default Title';
      }
      return title || 'Default Title';
    }, [title]);

    const safeContent = useMemo<ReactNode>(() => {
      if (typeof content === 'string' && content.trim() === '') {
        return 'Default Content';
      }
      return content || 'Default Content';
    }, [content]);

    const handleTitleError = () => {
      showBoundary(new Error('Error rendering title'));
    };

    const handleContentError = () => {
      showBoundary(new Error('Error rendering content'));
    };

    return (
      <div className={`my-component ${className}`} aria-label="My Component" {...rest}>
        <h1 className="my-component__title" aria-label="Component Title">
          {typeof safeTitle === 'string' ? (
            safeTitle
          ) : (
            <React.Suspense fallback={<div>Loading Title...</div>}>
              {/* Error boundary for title rendering */}
              <ErrorBoundary fallback={<p>{errorTitle}</p>} onError={handleTitleError}>
                {safeTitle}
              </ErrorBoundary>
            </React.Suspense>
          )}
        </h1>
        <p className="my-component__content" aria-label="Component Content">
          {typeof safeContent === 'string' ? (
            safeContent
          ) : (
            <React.Suspense fallback={<div>Loading Content...</div>}>
              {/* Error boundary for content rendering */}
              <ErrorBoundary fallback={<p>{errorContent}</p>} onError={handleContentError}>
                {safeContent}
              </ErrorBoundary>
            </React.Suspense>
          )}
        </p>
      </div>
    );
  },
);

MyComponent.displayName = 'MyComponent';

MyComponent.propTypes = {
  title: PropTypes.node,
  content: PropTypes.node,
  className: PropTypes.string,
  errorTitle: PropTypes.string,
  errorContent: PropTypes.string,
};

export default MyComponent;

// ErrorBoundary component (separate file or within the same file)
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  info: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error, info: null };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in App (created by Root)
    //   in Root
    this.setState({error: error, info: info});
    if (this.props.onError) {
      this.props.onError(error, info);
    }
    console.error("Caught an error in ErrorBoundary", error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

import React, { memo, useMemo, ReactNode } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { useErrorBoundary } from 'react-error-boundary';

interface MyComponentProps {
  title?: string | ReactNode;
  content?: string | ReactNode;
  className?: string;
  errorTitle?: string;
  errorContent?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({ title, content, className = '', errorTitle = 'Error', errorContent = 'An error occurred.', ...rest }) => {
    const { showBoundary } = useErrorBoundary();

    const safeTitle = useMemo<ReactNode>(() => {
      if (typeof title === 'string' && title.trim() === '') {
        return 'Default Title';
      }
      return title || 'Default Title';
    }, [title]);

    const safeContent = useMemo<ReactNode>(() => {
      if (typeof content === 'string' && content.trim() === '') {
        return 'Default Content';
      }
      return content || 'Default Content';
    }, [content]);

    const handleTitleError = () => {
      showBoundary(new Error('Error rendering title'));
    };

    const handleContentError = () => {
      showBoundary(new Error('Error rendering content'));
    };

    return (
      <div className={`my-component ${className}`} aria-label="My Component" {...rest}>
        <h1 className="my-component__title" aria-label="Component Title">
          {typeof safeTitle === 'string' ? (
            safeTitle
          ) : (
            <React.Suspense fallback={<div>Loading Title...</div>}>
              {/* Error boundary for title rendering */}
              <ErrorBoundary fallback={<p>{errorTitle}</p>} onError={handleTitleError}>
                {safeTitle}
              </ErrorBoundary>
            </React.Suspense>
          )}
        </h1>
        <p className="my-component__content" aria-label="Component Content">
          {typeof safeContent === 'string' ? (
            safeContent
          ) : (
            <React.Suspense fallback={<div>Loading Content...</div>}>
              {/* Error boundary for content rendering */}
              <ErrorBoundary fallback={<p>{errorContent}</p>} onError={handleContentError}>
                {safeContent}
              </ErrorBoundary>
            </React.Suspense>
          )}
        </p>
      </div>
    );
  },
);

MyComponent.displayName = 'MyComponent';

MyComponent.propTypes = {
  title: PropTypes.node,
  content: PropTypes.node,
  className: PropTypes.string,
  errorTitle: PropTypes.string,
  errorContent: PropTypes.string,
};

export default MyComponent;

// ErrorBoundary component (separate file or within the same file)
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  info: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error, info: null };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in App (created by Root)
    //   in Root
    this.setState({error: error, info: info});
    if (this.props.onError) {
      this.props.onError(error, info);
    }
    console.error("Caught an error in ErrorBoundary", error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;