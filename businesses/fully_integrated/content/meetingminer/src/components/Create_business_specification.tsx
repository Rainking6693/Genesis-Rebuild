import React, { FC, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import { useCallback } from 'react';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState('');

  const handleSanitizeMessage = useCallback(() => {
    try {
      setSanitizedMessage(DOMPurify.sanitize(message));
    } catch (error) {
      console.error(`Content sanitization failed: ${error.message}`);
      setSanitizedMessage('');
    }
  }, [message]);

  useMemo(handleSanitizeMessage, [message]);

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: sanitizedMessage || '',
      }}
      aria-label={sanitizedMessage} // Adding aria-label for accessibility
    />
  );
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

// Optimize performance by memoizing the component if props don't change
export default React.memo(MyComponent);

import React, { FC, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import { useCallback } from 'react';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState('');

  const handleSanitizeMessage = useCallback(() => {
    try {
      setSanitizedMessage(DOMPurify.sanitize(message));
    } catch (error) {
      console.error(`Content sanitization failed: ${error.message}`);
      setSanitizedMessage('');
    }
  }, [message]);

  useMemo(handleSanitizeMessage, [message]);

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: sanitizedMessage || '',
      }}
      aria-label={sanitizedMessage} // Adding aria-label for accessibility
    />
  );
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

// Optimize performance by memoizing the component if props don't change
export default React.memo(MyComponent);