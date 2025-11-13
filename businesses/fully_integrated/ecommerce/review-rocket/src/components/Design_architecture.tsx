import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

interface MyComponentProps {
  title: string;
  content: string;
  /**
   * Optional class name for custom styling.
   */
  className?: string;
  /**
   * Error message to display if content loading fails.
   */
  errorMessage?: string;
  /**
   * Callback function to execute after the component mounts.
   */
  onMount?: () => void;
  /**
   * Callback function to execute if an error occurs during content loading.
   */
  onError?: (error: Error) => void;
}

const MyComponent: React.FC<MyComponentProps> = ({
  title,
  content,
  className = '',
  errorMessage = 'Failed to load content.',
  onMount,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [processedContent, setProcessedContent] = useState<string>('');

  // Simulate content loading with a delay (for demonstration purposes)
  useEffect(() => {
    const loadContent = async () => {
      try {
        // Simulate an asynchronous operation (e.g., fetching data)
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (!content) {
          throw new Error('Content is empty.'); // Simulate an error
        }

        // Simulate content processing (e.g., sanitization)
        setProcessedContent(sanitizeContent(content));
        setIsLoading(false);
        setHasError(false);
      } catch (error: any) {
        console.error('Error loading content:', error);
        setIsLoading(false);
        setHasError(true);

        // Call the onError callback if provided
        if (onError) {
          onError(error);
        }
      }
    };

    loadContent();

    if (onMount) {
      onMount();
    }

    // Cleanup function (optional)
    return () => {
      // Perform any cleanup tasks here (e.g., aborting a fetch request)
    };
  }, [content, errorMessage, onMount, onError]);

  // Memoize the title to prevent unnecessary re-renders if the title prop doesn't change
  const memoizedTitle = useMemo(() => title, [title]);

  // useCallback for handling potential user interactions (example)
  const handleContentClick = useCallback(() => {
    console.log('Content clicked!');
  }, []);

  // Accessibility considerations:  Use semantic HTML elements and ARIA attributes where necessary.
  // For example, if the content is interactive, consider using a button or link with appropriate ARIA attributes.

  if (isLoading) {
    return (
      <div className={`my-component ${className}`} aria-live="polite">
        Loading...
      </div>
    ); // Display a loading indicator with ARIA live region
  }

  if (hasError) {
    return (
      <div className={`my-component ${className}`} role="alert">
        <h1 className="my-component__title">Error</h1>
        <p className="my-component__content">{errorMessage}</p>
      </div>
    ); // Display an error message with ARIA role="alert"
  }

  return (
    <div className={`my-component ${className}`}>
      <h1 className="my-component__title">{memoizedTitle}</h1>
      <p
        className="my-component__content"
        onClick={handleContentClick}
        aria-live="polite" // Announce content updates to screen readers
      >
        {processedContent}
      </p>
    </div>
  );
};

// Example of content sanitization (replace with a more robust solution)
const sanitizeContent = (content: string): string => {
  // Basic example:  Escape HTML entities to prevent XSS attacks
  return content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

// Prop type validation using PropTypes (optional but recommended)
MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  className: PropTypes.string,
  errorMessage: PropTypes.string,
  onMount: PropTypes.func,
  onError: PropTypes.func,
};

MyComponent.defaultProps = {
  className: '',
  errorMessage: 'Failed to load content.',
};

export default MyComponent;

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

interface MyComponentProps {
  title: string;
  content: string;
  /**
   * Optional class name for custom styling.
   */
  className?: string;
  /**
   * Error message to display if content loading fails.
   */
  errorMessage?: string;
  /**
   * Callback function to execute after the component mounts.
   */
  onMount?: () => void;
  /**
   * Callback function to execute if an error occurs during content loading.
   */
  onError?: (error: Error) => void;
}

const MyComponent: React.FC<MyComponentProps> = ({
  title,
  content,
  className = '',
  errorMessage = 'Failed to load content.',
  onMount,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [processedContent, setProcessedContent] = useState<string>('');

  // Simulate content loading with a delay (for demonstration purposes)
  useEffect(() => {
    const loadContent = async () => {
      try {
        // Simulate an asynchronous operation (e.g., fetching data)
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (!content) {
          throw new Error('Content is empty.'); // Simulate an error
        }

        // Simulate content processing (e.g., sanitization)
        setProcessedContent(sanitizeContent(content));
        setIsLoading(false);
        setHasError(false);
      } catch (error: any) {
        console.error('Error loading content:', error);
        setIsLoading(false);
        setHasError(true);

        // Call the onError callback if provided
        if (onError) {
          onError(error);
        }
      }
    };

    loadContent();

    if (onMount) {
      onMount();
    }

    // Cleanup function (optional)
    return () => {
      // Perform any cleanup tasks here (e.g., aborting a fetch request)
    };
  }, [content, errorMessage, onMount, onError]);

  // Memoize the title to prevent unnecessary re-renders if the title prop doesn't change
  const memoizedTitle = useMemo(() => title, [title]);

  // useCallback for handling potential user interactions (example)
  const handleContentClick = useCallback(() => {
    console.log('Content clicked!');
  }, []);

  // Accessibility considerations:  Use semantic HTML elements and ARIA attributes where necessary.
  // For example, if the content is interactive, consider using a button or link with appropriate ARIA attributes.

  if (isLoading) {
    return (
      <div className={`my-component ${className}`} aria-live="polite">
        Loading...
      </div>
    ); // Display a loading indicator with ARIA live region
  }

  if (hasError) {
    return (
      <div className={`my-component ${className}`} role="alert">
        <h1 className="my-component__title">Error</h1>
        <p className="my-component__content">{errorMessage}</p>
      </div>
    ); // Display an error message with ARIA role="alert"
  }

  return (
    <div className={`my-component ${className}`}>
      <h1 className="my-component__title">{memoizedTitle}</h1>
      <p
        className="my-component__content"
        onClick={handleContentClick}
        aria-live="polite" // Announce content updates to screen readers
      >
        {processedContent}
      </p>
    </div>
  );
};

// Example of content sanitization (replace with a more robust solution)
const sanitizeContent = (content: string): string => {
  // Basic example:  Escape HTML entities to prevent XSS attacks
  return content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

// Prop type validation using PropTypes (optional but recommended)
MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  className: PropTypes.string,
  errorMessage: PropTypes.string,
  onMount: PropTypes.func,
  onError: PropTypes.func,
};

MyComponent.defaultProps = {
  className: '',
  errorMessage: 'Failed to load content.',
};

export default MyComponent;