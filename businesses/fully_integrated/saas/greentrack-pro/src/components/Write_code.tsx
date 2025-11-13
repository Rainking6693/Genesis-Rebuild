import React, { FC, ReactNode, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { useId } from '@reach/auto-id';

interface Props {
  message?: string | ReactNode;
}

const MyComponent: FC<Props> = ({ message }) => {
  const id = useId();
  const [sanitizedMessage, setSanitizedMessage] = useState<ReactNode | null>(null);

  useEffect(() => {
    if (!message) return;

    const sanitized = DOMPurify.sanitize(message.toString());

    if (React.isValidElement(sanitized)) {
      setSanitizedMessage(sanitized);
      return;
    }

    setSanitizedMessage(<div dangerouslySetInnerHTML={{ __html: sanitized }} key={id} data-testid="my-component" />);
  }, [message]);

  return sanitizedMessage;
};

export default MyComponent;

import React, { FC, ReactNode, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { useId } from '@reach/auto-id';

interface Props {
  message?: string | ReactNode;
}

const MyComponent: FC<Props> = ({ message }) => {
  const id = useId();
  const [sanitizedMessage, setSanitizedMessage] = useState<ReactNode | null>(null);

  useEffect(() => {
    if (!message) return;

    const sanitized = DOMPurify.sanitize(message.toString());

    if (React.isValidElement(sanitized)) {
      setSanitizedMessage(sanitized);
      return;
    }

    setSanitizedMessage(<div dangerouslySetInnerHTML={{ __html: sanitized }} key={id} data-testid="my-component" />);
  }, [message]);

  return sanitizedMessage;
};

export default MyComponent;