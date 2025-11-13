import React, { FC, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

type SanitizedMessage = string;
type SetSanitizedMessage = React.Dispatch<React.SetStateAction<SanitizedMessage>>;
type Props = {
  message: string;
};

const MyComponent: FC<Props> = ({ message }: Props) => {
  const [sanitizedMessage, setSanitizedMessage]]: [SanitizedMessage, SetSanitizedMessage] = useState<SanitizedMessage>('');

  useEffect(() => {
    if (typeof message === 'string') {
      setSanitizedMessage(DOMPurify.sanitize(message));
    }
  }, [message]);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />;
};

export default MyComponent;

import React, { FC, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

type SanitizedMessage = string;
type SetSanitizedMessage = React.Dispatch<React.SetStateAction<SanitizedMessage>>;
type Props = {
  message: string;
};

const MyComponent: FC<Props> = ({ message }: Props) => {
  const [sanitizedMessage, setSanitizedMessage]]: [SanitizedMessage, SetSanitizedMessage] = useState<SanitizedMessage>('');

  useEffect(() => {
    if (typeof message === 'string') {
      setSanitizedMessage(DOMPurify.sanitize(message));
    }
  }, [message]);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />;
};

export default MyComponent;