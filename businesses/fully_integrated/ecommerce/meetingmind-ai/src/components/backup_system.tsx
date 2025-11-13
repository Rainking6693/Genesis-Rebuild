import React, { memo, useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

interface MyComponentProps {
  title?: string;
  content?: string | React.ReactNode; // Allow ReactNode for richer content
  errorTitle?: string; // Title to display on error
  errorContent?: string | React.ReactNode; // Content to display on error
  isLoading?: boolean;
  className?: string; // Allow custom class names
  onRetry?: () => void; // Callback for retry functionality
  dataTestId?: string; // For end-to-end testing
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({
    title,
    content,
    errorTitle = 'Error',
    errorContent = 'An error occurred.',
    isLoading = false,
    className = '',
    onRetry,
    dataTestId,
  }) => {
    const [hasError, setHasError] = useState(false);

    // Reset error state when title or content changes
    useEffect(() => {
      setHasError(false);
    }, [title, content]);

    const safeTitle = useMemo(() => title || 'Default Title', [title]);

    // Handle potential errors during content rendering
    const safeContent = useMemo(() => {
      try {
        if (typeof content === 'string') {
          return content || 'Default Content';
        } else if (React.isValidElement(content)) {
          return content; // Return ReactNode directly
        } else if (content) {
          // Handle other content types if needed, or throw an error
          console.warn('Unexpected content type:', typeof content, content);
          return 'Unexpected Content Type';
        }
        return 'Default Content';
      } catch (error) {
        console.error('Error rendering content:', error);
        setHasError(true);
        return null; // Return null to prevent rendering the content
      }
    }, [content]);

    const handleRetry = () => {
      setHasError(false); // Clear error state
      if (onRetry) {
        onRetry(); // Call the provided retry function
      }
    };

    if (isLoading) {
      return (
        <div
          className={`my-component my-component--loading ${className}`}
          aria-label="My Component (Loading)"
          data-testid={dataTestId}
        >
          <p>Loading...</p>
        </div>
      );
    }

    if (hasError) {
      return (
        <div
          className={`my-component my-component--error ${className}`}
          aria-label="My Component (Error)"
          data-testid={dataTestId}
        >
          <h1 className="my-component__title my-component__title--error" aria-label="Error Title">
            {errorTitle}
          </h1>
          <p className="my-component__content my-component__content--error" aria-label="Error Content">
            {errorContent}
          </p>
          {onRetry && (
            <button onClick={handleRetry} aria-label="Retry">
              Retry
            </button>
          )}
        </div>
      );
    }

    return (
      <div
        className={`my-component ${className}`}
        aria-label="My Component"
        data-testid={dataTestId}
      >
        <h1 className="my-component__title" aria-label="Title">
          {safeTitle}
        </h1>
        <div className="my-component__content" aria-label="Content">
          {safeContent}
        </div>
      </div>
    );
  }
);

MyComponent.propTypes = {
  title: PropTypes.string,
  content: PropTypes.node, // Use PropTypes.node for ReactNode
  errorTitle: PropTypes.string,
  errorContent: PropTypes.node,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
  onRetry: PropTypes.func,
  dataTestId: PropTypes.string,
};

export default MyComponent;

import React, { memo, useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

interface MyComponentProps {
  title?: string;
  content?: string | React.ReactNode; // Allow ReactNode for richer content
  errorTitle?: string; // Title to display on error
  errorContent?: string | React.ReactNode; // Content to display on error
  isLoading?: boolean;
  className?: string; // Allow custom class names
  onRetry?: () => void; // Callback for retry functionality
  dataTestId?: string; // For end-to-end testing
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({
    title,
    content,
    errorTitle = 'Error',
    errorContent = 'An error occurred.',
    isLoading = false,
    className = '',
    onRetry,
    dataTestId,
  }) => {
    const [hasError, setHasError] = useState(false);

    // Reset error state when title or content changes
    useEffect(() => {
      setHasError(false);
    }, [title, content]);

    const safeTitle = useMemo(() => title || 'Default Title', [title]);

    // Handle potential errors during content rendering
    const safeContent = useMemo(() => {
      try {
        if (typeof content === 'string') {
          return content || 'Default Content';
        } else if (React.isValidElement(content)) {
          return content; // Return ReactNode directly
        } else if (content) {
          // Handle other content types if needed, or throw an error
          console.warn('Unexpected content type:', typeof content, content);
          return 'Unexpected Content Type';
        }
        return 'Default Content';
      } catch (error) {
        console.error('Error rendering content:', error);
        setHasError(true);
        return null; // Return null to prevent rendering the content
      }
    }, [content]);

    const handleRetry = () => {
      setHasError(false); // Clear error state
      if (onRetry) {
        onRetry(); // Call the provided retry function
      }
    };

    if (isLoading) {
      return (
        <div
          className={`my-component my-component--loading ${className}`}
          aria-label="My Component (Loading)"
          data-testid={dataTestId}
        >
          <p>Loading...</p>
        </div>
      );
    }

    if (hasError) {
      return (
        <div
          className={`my-component my-component--error ${className}`}
          aria-label="My Component (Error)"
          data-testid={dataTestId}
        >
          <h1 className="my-component__title my-component__title--error" aria-label="Error Title">
            {errorTitle}
          </h1>
          <p className="my-component__content my-component__content--error" aria-label="Error Content">
            {errorContent}
          </p>
          {onRetry && (
            <button onClick={handleRetry} aria-label="Retry">
              Retry
            </button>
          )}
        </div>
      );
    }

    return (
      <div
        className={`my-component ${className}`}
        aria-label="My Component"
        data-testid={dataTestId}
      >
        <h1 className="my-component__title" aria-label="Title">
          {safeTitle}
        </h1>
        <div className="my-component__content" aria-label="Content">
          {safeContent}
        </div>
      </div>
    );
  }
);

MyComponent.propTypes = {
  title: PropTypes.string,
  content: PropTypes.node, // Use PropTypes.node for ReactNode
  errorTitle: PropTypes.string,
  errorContent: PropTypes.node,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
  onRetry: PropTypes.func,
  dataTestId: PropTypes.string,
};

export default MyComponent;