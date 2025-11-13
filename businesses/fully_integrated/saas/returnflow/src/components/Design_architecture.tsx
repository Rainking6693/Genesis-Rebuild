import React, { memo, useMemo, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

interface MyComponentProps {
  title: string;
  content: string;
  /**
   * Optional class name for custom styling.
   */
  className?: string;
  /**
   *  A fallback title to display if the main title is empty or undefined.
   */
  titleFallback?: string;
  /**
   * A fallback content to display if the main content is empty or undefined.
   */
  contentFallback?: string;
  /**
   *  A boolean to indicate if the component should be rendered in a loading state.
   */
  isLoading?: boolean;
  /**
   *  A function to handle errors that might occur during rendering or data fetching.
   */
  onError?: (error: Error) => void;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({
    title,
    content,
    className,
    titleFallback = 'No Title Available',
    contentFallback = 'No Content Available',
    isLoading = false,
    onError,
  }) => {
    const [hasError, setHasError] = useState(false);

    // Handle potential errors during rendering.
    const safeTitle = useMemo(() => {
      if (isLoading) {
        return 'Loading...'; // Or a loading spinner component
      }
      if (!title && title !== '') {
        return titleFallback;
      }
      return title;
    }, [title, titleFallback, isLoading]);

    const safeContent = useMemo(() => {
      if (isLoading) {
        return 'Loading...'; // Or a loading spinner component
      }
      if (!content && content !== '') {
        return contentFallback;
      }
      return content;
    }, [content, contentFallback, isLoading]);

    // Accessibility considerations: Use semantic HTML and ARIA attributes where appropriate.
    // Consider adding role="alert" to the div if this component displays important messages.

    // Error handling and fallback
    const handleError = useCallback(
      (error: Error) => {
        console.error('Error rendering MyComponent:', error);
        setHasError(true);
        onError?.(error); // Call the error handler if provided.
      },
      [onError]
    );

    useEffect(() => {
      // Reset the error state when props change
      setHasError(false);
    }, [title, content, isLoading]);

    if (hasError) {
      return (
        <div data-testid="my-component-error">
          Error rendering component. See console for details.
        </div>
      );
    }

    try {
      return (
        <div
          data-testid="my-component"
          className={className} // Allow custom styling
          aria-busy={isLoading} // Indicate loading state for screen readers
          role="alert" // Indicate that this component displays important information
        >
          <h1 data-testid="title">{safeTitle || titleFallback}</h1>
          <p data-testid="content">{safeContent || contentFallback}</p>
        </div>
      );
    } catch (error: any) {
      handleError(error);
      return null; // Return null to prevent the component from rendering further
    }
  }
);

MyComponent.propTypes = {
  // Example of using PropTypes for runtime type checking (optional)
  title: PropTypes.string,
  content: PropTypes.string,
  className: PropTypes.string,
  titleFallback: PropTypes.string,
  contentFallback: PropTypes.string,
  isLoading: PropTypes.bool,
  onError: PropTypes.func,
};

export default MyComponent;

import React, { memo, useMemo, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

interface MyComponentProps {
  title: string;
  content: string;
  /**
   * Optional class name for custom styling.
   */
  className?: string;
  /**
   *  A fallback title to display if the main title is empty or undefined.
   */
  titleFallback?: string;
  /**
   * A fallback content to display if the main content is empty or undefined.
   */
  contentFallback?: string;
  /**
   *  A boolean to indicate if the component should be rendered in a loading state.
   */
  isLoading?: boolean;
  /**
   *  A function to handle errors that might occur during rendering or data fetching.
   */
  onError?: (error: Error) => void;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({
    title,
    content,
    className,
    titleFallback = 'No Title Available',
    contentFallback = 'No Content Available',
    isLoading = false,
    onError,
  }) => {
    const [hasError, setHasError] = useState(false);

    // Handle potential errors during rendering.
    const safeTitle = useMemo(() => {
      if (isLoading) {
        return 'Loading...'; // Or a loading spinner component
      }
      if (!title && title !== '') {
        return titleFallback;
      }
      return title;
    }, [title, titleFallback, isLoading]);

    const safeContent = useMemo(() => {
      if (isLoading) {
        return 'Loading...'; // Or a loading spinner component
      }
      if (!content && content !== '') {
        return contentFallback;
      }
      return content;
    }, [content, contentFallback, isLoading]);

    // Accessibility considerations: Use semantic HTML and ARIA attributes where appropriate.
    // Consider adding role="alert" to the div if this component displays important messages.

    // Error handling and fallback
    const handleError = useCallback(
      (error: Error) => {
        console.error('Error rendering MyComponent:', error);
        setHasError(true);
        onError?.(error); // Call the error handler if provided.
      },
      [onError]
    );

    useEffect(() => {
      // Reset the error state when props change
      setHasError(false);
    }, [title, content, isLoading]);

    if (hasError) {
      return (
        <div data-testid="my-component-error">
          Error rendering component. See console for details.
        </div>
      );
    }

    try {
      return (
        <div
          data-testid="my-component"
          className={className} // Allow custom styling
          aria-busy={isLoading} // Indicate loading state for screen readers
          role="alert" // Indicate that this component displays important information
        >
          <h1 data-testid="title">{safeTitle || titleFallback}</h1>
          <p data-testid="content">{safeContent || contentFallback}</p>
        </div>
      );
    } catch (error: any) {
      handleError(error);
      return null; // Return null to prevent the component from rendering further
    }
  }
);

MyComponent.propTypes = {
  // Example of using PropTypes for runtime type checking (optional)
  title: PropTypes.string,
  content: PropTypes.string,
  className: PropTypes.string,
  titleFallback: PropTypes.string,
  contentFallback: PropTypes.string,
  isLoading: PropTypes.bool,
  onError: PropTypes.func,
};

export default MyComponent;