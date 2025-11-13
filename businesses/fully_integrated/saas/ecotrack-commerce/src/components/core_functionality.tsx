import React, { memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { useErrorBoundary } from 'react-error-boundary'; // Import for error handling

interface MyComponentProps {
  title?: string | null; // Allow null for title
  content?: string | null; // Allow null for content
  truncateContentLength?: number; // Optional prop for content truncation
  className?: string; // Optional prop for custom class names
  onContentClick?: () => void; // Optional prop for content click handler
  dataTestId?: string; // Optional prop for data-testid
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({
    title,
    content,
    truncateContentLength,
    className,
    onContentClick,
    dataTestId,
  }) => {
    const { showBoundary } = useErrorBoundary();

    const safeTitle = useMemo(() => {
      if (typeof title !== 'string' || title.trim() === '') {
        return 'Default Title';
      }
      return title.trim();
    }, [title]);

    const safeContent = useMemo(() => {
      if (typeof content !== 'string' || content.trim() === '') {
        return 'Default Content';
      }

      const trimmedContent = content.trim();

      if (truncateContentLength && trimmedContent.length > truncateContentLength) {
        return trimmedContent.substring(0, truncateContentLength) + '...';
      }

      return trimmedContent;
    }, [content, truncateContentLength]);

    const handleClick = useCallback(() => {
      if (onContentClick) {
        try {
          onContentClick();
        } catch (error) {
          console.error('Error in onContentClick handler:', error);
          showBoundary(error); // Trigger error boundary
        }
      }
    }, [onContentClick, showBoundary]);

    const componentClassName = useMemo(() => {
      let baseClassName = 'my-component';
      if (className) {
        baseClassName += ` ${className}`;
      }
      return baseClassName;
    }, [className]);

    return (
      <div
        className={componentClassName}
        aria-label="My Component"
        data-testid={dataTestId}
      >
        <h1 className="my-component__title" aria-label="Title">
          {safeTitle}
        </h1>
        <p
          className="my-component__content"
          aria-label="Content"
          onClick={handleClick}
          style={{ cursor: onContentClick ? 'pointer' : 'default' }}
        >
          {safeContent}
        </p>
      </div>
    );
  }
);

MyComponent.displayName = 'MyComponent';

// PropTypes for runtime type checking and documentation
MyComponent.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  truncateContentLength: PropTypes.number,
  className: PropTypes.string,
  onContentClick: PropTypes.func,
  dataTestId: PropTypes.string,
};

export default MyComponent;

import React, { memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { useErrorBoundary } from 'react-error-boundary'; // Import for error handling

interface MyComponentProps {
  title?: string | null; // Allow null for title
  content?: string | null; // Allow null for content
  truncateContentLength?: number; // Optional prop for content truncation
  className?: string; // Optional prop for custom class names
  onContentClick?: () => void; // Optional prop for content click handler
  dataTestId?: string; // Optional prop for data-testid
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({
    title,
    content,
    truncateContentLength,
    className,
    onContentClick,
    dataTestId,
  }) => {
    const { showBoundary } = useErrorBoundary();

    const safeTitle = useMemo(() => {
      if (typeof title !== 'string' || title.trim() === '') {
        return 'Default Title';
      }
      return title.trim();
    }, [title]);

    const safeContent = useMemo(() => {
      if (typeof content !== 'string' || content.trim() === '') {
        return 'Default Content';
      }

      const trimmedContent = content.trim();

      if (truncateContentLength && trimmedContent.length > truncateContentLength) {
        return trimmedContent.substring(0, truncateContentLength) + '...';
      }

      return trimmedContent;
    }, [content, truncateContentLength]);

    const handleClick = useCallback(() => {
      if (onContentClick) {
        try {
          onContentClick();
        } catch (error) {
          console.error('Error in onContentClick handler:', error);
          showBoundary(error); // Trigger error boundary
        }
      }
    }, [onContentClick, showBoundary]);

    const componentClassName = useMemo(() => {
      let baseClassName = 'my-component';
      if (className) {
        baseClassName += ` ${className}`;
      }
      return baseClassName;
    }, [className]);

    return (
      <div
        className={componentClassName}
        aria-label="My Component"
        data-testid={dataTestId}
      >
        <h1 className="my-component__title" aria-label="Title">
          {safeTitle}
        </h1>
        <p
          className="my-component__content"
          aria-label="Content"
          onClick={handleClick}
          style={{ cursor: onContentClick ? 'pointer' : 'default' }}
        >
          {safeContent}
        </p>
      </div>
    );
  }
);

MyComponent.displayName = 'MyComponent';

// PropTypes for runtime type checking and documentation
MyComponent.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  truncateContentLength: PropTypes.number,
  className: PropTypes.string,
  onContentClick: PropTypes.func,
  dataTestId: PropTypes.string,
};

export default MyComponent;