import React, { useEffect, useState, useMemo, forwardRef } from 'react';
import PropTypes from 'prop-types';
import DOMParser from 'html-react-parser';

interface Props {
  message: string;
  ref?: React.RefObject<HTMLDivElement>;
}

const MyComponent = forwardRef<HTMLDivElement, Props>(({ message, ref }, refObj) => {
  const [sanitizedMessage, setSanitizedMessage] = useState('');

  const sanitizeHtml = useMemo(() => {
    return (unsafeHtml: string) => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = unsafeHtml;
      return tempDiv.textContent;
    };
  }, []);

  useEffect(() => {
    if (message) {
      try {
        const sanitizedMessage = sanitizeHtml(message);
        setSanitizedMessage(sanitizedMessage);
      } catch (error) {
        console.error('Invalid or malicious input detected:', error);
        setSanitizedMessage('Error: Invalid or malicious input detected.');
      }
    }
  }, [message, sanitizeHtml]);

  return (
    <div ref={refObj || ref} aria-label="Sanitized message">
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
    </div>
  );
});

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
  ref: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.instanceOf(HTMLDivElement) })]),
};

MyComponent.prototype.sanitizeHtml = function (unsafeHtml) {
  // Implement your custom sanitization function here
  // For example, using DOMParser:
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = unsafeHtml;
  return tempDiv.textContent;
};

export default MyComponent;

import React, { useEffect, useState, useMemo, forwardRef } from 'react';
import PropTypes from 'prop-types';
import DOMParser from 'html-react-parser';

interface Props {
  message: string;
  ref?: React.RefObject<HTMLDivElement>;
}

const MyComponent = forwardRef<HTMLDivElement, Props>(({ message, ref }, refObj) => {
  const [sanitizedMessage, setSanitizedMessage] = useState('');

  const sanitizeHtml = useMemo(() => {
    return (unsafeHtml: string) => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = unsafeHtml;
      return tempDiv.textContent;
    };
  }, []);

  useEffect(() => {
    if (message) {
      try {
        const sanitizedMessage = sanitizeHtml(message);
        setSanitizedMessage(sanitizedMessage);
      } catch (error) {
        console.error('Invalid or malicious input detected:', error);
        setSanitizedMessage('Error: Invalid or malicious input detected.');
      }
    }
  }, [message, sanitizeHtml]);

  return (
    <div ref={refObj || ref} aria-label="Sanitized message">
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
    </div>
  );
});

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
  ref: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.instanceOf(HTMLDivElement) })]),
};

MyComponent.prototype.sanitizeHtml = function (unsafeHtml) {
  // Implement your custom sanitization function here
  // For example, using DOMParser:
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = unsafeHtml;
  return tempDiv.textContent;
};

export default MyComponent;