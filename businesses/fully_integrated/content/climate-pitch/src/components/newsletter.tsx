import React, { useMemo, useState } from 'react';
import { sanitizeUserInput } from '../../utils/security';

interface Props {
  message: string;
}

const NewsletterComponent: React.FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(sanitizeUserInput(message));
  const [fallback, setFallback] = useState<JSX.Element | null>(null);

  const handleSanitizedMessageChange = (newMessage: string) => {
    setSanitizedMessage(newMessage);
    setFallback(<div dangerouslySetInnerHTML={{ __html: newMessage }} />);
  };

  const MemoizedComponent = useMemo(() => () => {
    return (
      <div>
        {sanitizedMessage && <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />}
        {!sanitizedMessage && fallback}
      </div>
    );
  }, [sanitizedMessage, fallback]);

  // Check if the message has changed and update the sanitized message and fallback accordingly
  React.useEffect(() => {
    handleSanitizedMessageChange(message);
  }, [message]);

  return MemoizedComponent();
};

export default NewsletterComponent;

import React, { useMemo, useState } from 'react';
import { sanitizeUserInput } from '../../utils/security';

interface Props {
  message: string;
}

const NewsletterComponent: React.FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(sanitizeUserInput(message));
  const [fallback, setFallback] = useState<JSX.Element | null>(null);

  const handleSanitizedMessageChange = (newMessage: string) => {
    setSanitizedMessage(newMessage);
    setFallback(<div dangerouslySetInnerHTML={{ __html: newMessage }} />);
  };

  const MemoizedComponent = useMemo(() => () => {
    return (
      <div>
        {sanitizedMessage && <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />}
        {!sanitizedMessage && fallback}
      </div>
    );
  }, [sanitizedMessage, fallback]);

  // Check if the message has changed and update the sanitized message and fallback accordingly
  React.useEffect(() => {
    handleSanitizedMessageChange(message);
  }, [message]);

  return MemoizedComponent();
};

export default NewsletterComponent;