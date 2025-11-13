import React, { FC, useMemo, useId } from 'react';
import DOMPurify from 'dompurify';

interface SanitizedHTMLString {
  __html: string;
}

const sanitize = (html: string) => DOMPurify.sanitize(html);

interface Props {
  message?: string;
  className?: string;
  ariaLabel?: string;
  id?: string;
}

const MyComponent: FC<Props> = ({ message = '', className, ariaLabel, id }) => {
  const sanitizedMessage = useMemo(() => sanitize(message), [message]);
  const componentId = useId();

  if (!message) return null;

  return (
    <div id={id || componentId} className={className} aria-label={ariaLabel}>
      <div dangerouslySetInnerHTML={sanitizedMessage} />
    </div>
  );
};

export default MyComponent;

import React, { FC, useMemo, useId } from 'react';
import DOMPurify from 'dompurify';

interface SanitizedHTMLString {
  __html: string;
}

const sanitize = (html: string) => DOMPurify.sanitize(html);

interface Props {
  message?: string;
  className?: string;
  ariaLabel?: string;
  id?: string;
}

const MyComponent: FC<Props> = ({ message = '', className, ariaLabel, id }) => {
  const sanitizedMessage = useMemo(() => sanitize(message), [message]);
  const componentId = useId();

  if (!message) return null;

  return (
    <div id={id || componentId} className={className} aria-label={ariaLabel}>
      <div dangerouslySetInnerHTML={sanitizedMessage} />
    </div>
  );
};

export default MyComponent;