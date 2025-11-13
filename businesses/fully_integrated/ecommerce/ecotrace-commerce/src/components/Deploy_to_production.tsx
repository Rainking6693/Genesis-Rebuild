import React, { FC, useState, useEffect, ReactNode, forwardRef } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

interface Props {
  message: ReactNode | ((setHtmlMessage: React.Dispatch<React.SetStateAction<string>>) => ReactNode);
}

const MyComponent = forwardRef<HTMLDivElement, Props>(({ message }, ref) => {
  const [htmlMessage, setHtmlMessage] = useState<string>('');

  useEffect(() => {
    if (typeof message === 'function') {
      const sanitizedMessage = DOMPurify.sanitize(message(setHtmlMessage));
      setHtmlMessage(sanitizedMessage);
    } else {
      const sanitizedMessage = DOMPurify.sanitize(message as string);
      setHtmlMessage(sanitizedMessage);
    }
  }, [message]);

  return (
    <div ref={ref} aria-label={htmlMessage || 'Message content'}>
      {htmlMessage && (
        <div dangerouslySetInnerHTML={{ __html: htmlMessage }} />
      )}
      {!htmlMessage && <div>Fallback text</div>}
    </div>
  );
});

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

export default MyComponent;

import React, { FC, useState, useEffect, ReactNode, forwardRef } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

interface Props {
  message: ReactNode | ((setHtmlMessage: React.Dispatch<React.SetStateAction<string>>) => ReactNode);
}

const MyComponent = forwardRef<HTMLDivElement, Props>(({ message }, ref) => {
  const [htmlMessage, setHtmlMessage] = useState<string>('');

  useEffect(() => {
    if (typeof message === 'function') {
      const sanitizedMessage = DOMPurify.sanitize(message(setHtmlMessage));
      setHtmlMessage(sanitizedMessage);
    } else {
      const sanitizedMessage = DOMPurify.sanitize(message as string);
      setHtmlMessage(sanitizedMessage);
    }
  }, [message]);

  return (
    <div ref={ref} aria-label={htmlMessage || 'Message content'}>
      {htmlMessage && (
        <div dangerouslySetInnerHTML={{ __html: htmlMessage }} />
      )}
      {!htmlMessage && <div>Fallback text</div>}
    </div>
  );
});

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

export default MyComponent;