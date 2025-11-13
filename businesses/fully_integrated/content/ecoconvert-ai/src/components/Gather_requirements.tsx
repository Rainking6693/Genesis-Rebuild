import React, { FC, useState } from 'react';
import DOMPurify from 'dompurify';
import PropTypes from 'prop-types';

type SanitizerOptions = Parameters<typeof DOMPurify.sanitize>[1];

interface Props {
  message: string | null | undefined;
}

interface State {
  sanitizedMessage: string | null | undefined;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState<string | null | undefined>(
    MyComponent.sanitizeMessage(message as string)
  );

  React.useEffect(() => {
    if (message) {
      setSanitizedMessage(MyComponent.sanitizeMessage(message));
    }
  }, [message]);

  return (
    <div>
      {/* Add a more descriptive aria-label */}
      <div
        dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
        aria-label={`Content: ${message || 'No message provided'}`}
      />
    </div>
  );
};

MyComponent.defaultProps = {
  message: null,
};

MyComponent.propTypes = {
  message: PropTypes.InferProps<Props>['message'],
};

MyComponent.sanitizeMessage = (message: string, options?: SanitizerOptions) => {
  try {
    return DOMPurify.sanitize(message, options);
  } catch (error) {
    console.error('Error sanitizing message:', error);
    return '';
  }
};

export default MyComponent;

import React, { FC, useState } from 'react';
import DOMPurify from 'dompurify';
import PropTypes from 'prop-types';

type SanitizerOptions = Parameters<typeof DOMPurify.sanitize>[1];

interface Props {
  message: string | null | undefined;
}

interface State {
  sanitizedMessage: string | null | undefined;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState<string | null | undefined>(
    MyComponent.sanitizeMessage(message as string)
  );

  React.useEffect(() => {
    if (message) {
      setSanitizedMessage(MyComponent.sanitizeMessage(message));
    }
  }, [message]);

  return (
    <div>
      {/* Add a more descriptive aria-label */}
      <div
        dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
        aria-label={`Content: ${message || 'No message provided'}`}
      />
    </div>
  );
};

MyComponent.defaultProps = {
  message: null,
};

MyComponent.propTypes = {
  message: PropTypes.InferProps<Props>['message'],
};

MyComponent.sanitizeMessage = (message: string, options?: SanitizerOptions) => {
  try {
    return DOMPurify.sanitize(message, options);
  } catch (error) {
    console.error('Error sanitizing message:', error);
    return '';
  }
};

export default MyComponent;