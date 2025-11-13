import React, { FC, PropsWithChildren, useEffect, useState } from 'react';
import { sanitize } from 'dompurify';

interface Props extends PropsWithChildren {
  message?: string;
  className?: string;
  error?: boolean; // Add error prop to handle error messages
  id?: string; // Add id prop for accessibility and potential future use
}

const UserAuth: FC<Props> = ({ children, message, className, error = false, id }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(children);
  const [sanitizedId, setSanitizedId] = useState(id || 'user-auth');

  useEffect(() => {
    const sanitizedChildren = sanitize(children as string);
    setSanitizedMessage(sanitizedChildren);
  }, [children]);

  // Add aria-live for accessibility
  const ariaLive = error ? 'assertive' : 'polite';

  return (
    <div id={sanitizedId} className={className} role="alert" aria-live={ariaLive}>
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      {message && <div dangerouslySetInnerHTML={{ __html: sanitize(message) }} />}
    </div>
  );
};

export default memo(UserAuth);

import React, { FC, PropsWithChildren, useEffect, useState } from 'react';
import { sanitize } from 'dompurify';

interface Props extends PropsWithChildren {
  message?: string;
  className?: string;
  error?: boolean; // Add error prop to handle error messages
  id?: string; // Add id prop for accessibility and potential future use
}

const UserAuth: FC<Props> = ({ children, message, className, error = false, id }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(children);
  const [sanitizedId, setSanitizedId] = useState(id || 'user-auth');

  useEffect(() => {
    const sanitizedChildren = sanitize(children as string);
    setSanitizedMessage(sanitizedChildren);
  }, [children]);

  // Add aria-live for accessibility
  const ariaLive = error ? 'assertive' : 'polite';

  return (
    <div id={sanitizedId} className={className} role="alert" aria-live={ariaLive}>
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      {message && <div dangerouslySetInnerHTML={{ __html: sanitize(message) }} />}
    </div>
  );
};

export default memo(UserAuth);