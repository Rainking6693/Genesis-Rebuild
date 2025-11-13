import React, { FC, ReactNode, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }: Props) => {
  const [sanitizedMessage, setSanitizedMessage] = useState('');

  useEffect(() => {
    const sanitized = DOMPurify.sanitize(message);
    setSanitizedMessage(sanitized);
  }, [message]);

  const renderComponent = () => {
    if (sanitizedMessage) {
      return (
        <div key={sanitizedMessage} data-testid="message-content" dangerouslySetInnerHTML={{ __html: sanitizedMessage }} aria-label="Message content" />
      );
    }

    return <div data-testid="message-placeholder" aria-hidden="true" />;
  };

  return renderComponent();
};

export default MyComponent;

import React, { FC, ReactNode, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }: Props) => {
  const [sanitizedMessage, setSanitizedMessage] = useState('');

  useEffect(() => {
    const sanitized = DOMPurify.sanitize(message);
    setSanitizedMessage(sanitized);
  }, [message]);

  const renderComponent = () => {
    if (sanitizedMessage) {
      return (
        <div key={sanitizedMessage} data-testid="message-content" dangerouslySetInnerHTML={{ __html: sanitizedMessage }} aria-label="Message content" />
      );
    }

    return <div data-testid="message-placeholder" aria-hidden="true" />;
  };

  return renderComponent();
};

export default MyComponent;