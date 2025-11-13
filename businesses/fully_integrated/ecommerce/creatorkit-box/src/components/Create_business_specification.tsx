import React, { FC, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import sanitizeHtml from 'sanitize-html';

interface Props {
  message?: string; // Adding optional prop for better edge cases handling
}

const MyComponent: FC<Props> = ({ message }) => {
  const sanitize = useCallback((raw: string) => {
    if (!raw) return '';
    const allowedTags = ['div'];
    return sanitizeHtml(raw, { allowedTags });
  }, []);

  const sanitizedMessage = useMemo(() => sanitize(message), [message, sanitize]); // Memoize sanitizedMessage for performance optimization

  return (
    <div>
      {/* Adding a fallback text for accessibility */}
      <div>{message || 'No message provided'}</div>
      <div
        // Adding ARIA-label for screen readers to announce the content of the sanitized message
        aria-label={sanitizedMessage}
        dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      />
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string, // Changed to optional prop type
};

export default MyComponent;

import React, { FC, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import sanitizeHtml from 'sanitize-html';

interface Props {
  message?: string; // Adding optional prop for better edge cases handling
}

const MyComponent: FC<Props> = ({ message }) => {
  const sanitize = useCallback((raw: string) => {
    if (!raw) return '';
    const allowedTags = ['div'];
    return sanitizeHtml(raw, { allowedTags });
  }, []);

  const sanitizedMessage = useMemo(() => sanitize(message), [message, sanitize]); // Memoize sanitizedMessage for performance optimization

  return (
    <div>
      {/* Adding a fallback text for accessibility */}
      <div>{message || 'No message provided'}</div>
      <div
        // Adding ARIA-label for screen readers to announce the content of the sanitized message
        aria-label={sanitizedMessage}
        dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      />
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string, // Changed to optional prop type
};

export default MyComponent;