import React, { memo, useMemo, ReactNode } from 'react';
import PropTypes from 'prop-types'; // Optional, but good for runtime type checking in development

interface MyComponentProps {
  title?: string;
  content?: string | ReactNode; // Allow ReactNode for richer content
  className?: string; // Allow external styling
  errorContent?: ReactNode; // Content to display on error
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content, className, errorContent }) => {
  const safeTitle = useMemo(() => {
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return 'Untitled';
    }
    return title.trim(); // Trim whitespace
  }, [title]);

  const safeContent = useMemo(() => {
    if (!content) {
      return 'No content available';
    }

    if (typeof content === 'string') {
      const trimmedContent = content.trim();
      return trimmedContent === '' ? 'No content available' : trimmedContent;
    }

    return content; // Return ReactNode directly
  }, [content]);

  const hasContent = useMemo(() => safeContent !== 'No content available', [safeContent]);

  // Error handling:  If content is missing and errorContent is provided, display it.
  if (!hasContent && errorContent) {
    return (
      <div className={`my-component error ${className || ''}`} aria-label="Error: Content missing">
        {errorContent}
      </div>
    );
  }

  return (
    <div className={`my-component ${className || ''}`} aria-label={safeTitle}>
      <h2 className="my-component__title" title={safeTitle}>
        {safeTitle}
      </h2>
      {typeof safeContent === 'string' ? (
        <p className="my-component__content" title={safeContent}>
          {safeContent}
        </p>
      ) : (
        <div className="my-component__content">{safeContent}</div> // Render ReactNode content
      )}
    </div>
  );
});

MyComponent.propTypes = { // Optional: PropTypes for runtime type checking (development only)
  title: PropTypes.string,
  content: PropTypes.node, // ReactNode allows strings, numbers, elements, or an array of them
  className: PropTypes.string,
  errorContent: PropTypes.node,
};

MyComponent.defaultProps = {
  errorContent: null, // Explicitly set default to null
};

export default MyComponent;

import React, { memo, useMemo, ReactNode } from 'react';
import PropTypes from 'prop-types'; // Optional, but good for runtime type checking in development

interface MyComponentProps {
  title?: string;
  content?: string | ReactNode; // Allow ReactNode for richer content
  className?: string; // Allow external styling
  errorContent?: ReactNode; // Content to display on error
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content, className, errorContent }) => {
  const safeTitle = useMemo(() => {
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return 'Untitled';
    }
    return title.trim(); // Trim whitespace
  }, [title]);

  const safeContent = useMemo(() => {
    if (!content) {
      return 'No content available';
    }

    if (typeof content === 'string') {
      const trimmedContent = content.trim();
      return trimmedContent === '' ? 'No content available' : trimmedContent;
    }

    return content; // Return ReactNode directly
  }, [content]);

  const hasContent = useMemo(() => safeContent !== 'No content available', [safeContent]);

  // Error handling:  If content is missing and errorContent is provided, display it.
  if (!hasContent && errorContent) {
    return (
      <div className={`my-component error ${className || ''}`} aria-label="Error: Content missing">
        {errorContent}
      </div>
    );
  }

  return (
    <div className={`my-component ${className || ''}`} aria-label={safeTitle}>
      <h2 className="my-component__title" title={safeTitle}>
        {safeTitle}
      </h2>
      {typeof safeContent === 'string' ? (
        <p className="my-component__content" title={safeContent}>
          {safeContent}
        </p>
      ) : (
        <div className="my-component__content">{safeContent}</div> // Render ReactNode content
      )}
    </div>
  );
});

MyComponent.propTypes = { // Optional: PropTypes for runtime type checking (development only)
  title: PropTypes.string,
  content: PropTypes.node, // ReactNode allows strings, numbers, elements, or an array of them
  className: PropTypes.string,
  errorContent: PropTypes.node,
};

MyComponent.defaultProps = {
  errorContent: null, // Explicitly set default to null
};

export default MyComponent;