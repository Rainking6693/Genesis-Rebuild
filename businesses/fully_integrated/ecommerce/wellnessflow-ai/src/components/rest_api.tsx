import React, { memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types'; // Import prop-types
import { escape } from 'lodash'; // Import lodash escape

interface MyComponentProps {
  title: string;
  content: string;
  truncateContentLength?: number; // Optional prop for content truncation
  errorMessage?: string; // Optional prop for error message
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content, truncateContentLength = 0, errorMessage }) => {
  // Default values and type checking
  const safeTitle = title || '';
  const safeContent = content || '';

  // Sanitize title and content using lodash's escape function
  const sanitizedTitle = useMemo(() => escape(safeTitle), [safeTitle]);
  const sanitizedContent = useMemo(() => escape(safeContent), [safeContent]);

  // Truncate content if truncateContentLength is specified
  const truncatedContent = useMemo(() => {
    if (truncateContentLength > 0 && sanitizedContent.length > truncateContentLength) {
      return sanitizedContent.substring(0, truncateContentLength) + '...';
    }
    return sanitizedContent;
  }, [sanitizedContent, truncateContentLength]);

  // Handle potential errors gracefully
  const renderContent = useCallback(() => {
    if (errorMessage) {
      return <p className="my-component__error" role="alert">{errorMessage}</p>;
    }
    return (
      <p className="my-component__content" title={sanitizedContent}>
        {truncatedContent}
      </p>
    );
  }, [errorMessage, sanitizedContent, truncatedContent]);

  return (
    <div className="my-component" aria-label={sanitizedTitle}>
      <h1 className="my-component__title" title={sanitizedTitle}>
        {sanitizedTitle}
      </h1>
      {renderContent()}
    </div>
  );
});

// Prop type validation using prop-types
MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  truncateContentLength: PropTypes.number,
  errorMessage: PropTypes.string,
};

MyComponent.displayName = 'MyComponent'; // Explicitly set display name for debugging

export default MyComponent;

import React, { memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types'; // Import prop-types
import { escape } from 'lodash'; // Import lodash escape

interface MyComponentProps {
  title: string;
  content: string;
  truncateContentLength?: number; // Optional prop for content truncation
  errorMessage?: string; // Optional prop for error message
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content, truncateContentLength = 0, errorMessage }) => {
  // Default values and type checking
  const safeTitle = title || '';
  const safeContent = content || '';

  // Sanitize title and content using lodash's escape function
  const sanitizedTitle = useMemo(() => escape(safeTitle), [safeTitle]);
  const sanitizedContent = useMemo(() => escape(safeContent), [safeContent]);

  // Truncate content if truncateContentLength is specified
  const truncatedContent = useMemo(() => {
    if (truncateContentLength > 0 && sanitizedContent.length > truncateContentLength) {
      return sanitizedContent.substring(0, truncateContentLength) + '...';
    }
    return sanitizedContent;
  }, [sanitizedContent, truncateContentLength]);

  // Handle potential errors gracefully
  const renderContent = useCallback(() => {
    if (errorMessage) {
      return <p className="my-component__error" role="alert">{errorMessage}</p>;
    }
    return (
      <p className="my-component__content" title={sanitizedContent}>
        {truncatedContent}
      </p>
    );
  }, [errorMessage, sanitizedContent, truncatedContent]);

  return (
    <div className="my-component" aria-label={sanitizedTitle}>
      <h1 className="my-component__title" title={sanitizedTitle}>
        {sanitizedTitle}
      </h1>
      {renderContent()}
    </div>
  );
});

// Prop type validation using prop-types
MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  truncateContentLength: PropTypes.number,
  errorMessage: PropTypes.string,
};

MyComponent.displayName = 'MyComponent'; // Explicitly set display name for debugging

export default MyComponent;