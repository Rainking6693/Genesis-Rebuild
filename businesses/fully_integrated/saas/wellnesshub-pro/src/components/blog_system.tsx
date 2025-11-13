import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { sanitizeUserInput } from '../../security/sanitizer';
import { isValidElement, cloneElement } from 'react';
import { forwardRef } from 'react';

interface Props {
  message: string | JSX.Element;
  className?: string;
  ariaLabel?: string;
}

const MyComponent = forwardRef<HTMLDivElement, Props>(({ message, className, ariaLabel }, ref) => {
  const [sanitizedMessage, setSanitizedMessage] = useState<JSX.Element | null>(null);

  const handleSanitizeMessage = useCallback(() => {
    if (typeof message === 'string') {
      setSanitizedMessage(<span dangerouslySetInnerHTML={{ __html: sanitizeUserInput(message) }} />);
    } else if (isValidElement(message)) {
      setSanitizedMessage(
        cloneElement(message, {
          dangerouslySetInnerHTML: {
            __html: sanitizeUserInput(message.props.dangerouslySetInnerHTML.__html),
          },
        })
      );
    } else {
      setSanitizedMessage(message);
    }
  }, [message]);

  useEffect(() => {
    handleSanitizeMessage();
  }, [handleSanitizeMessage]);

  return (
    <div ref={ref} className={className} aria-label={ariaLabel}>
      {sanitizedMessage}
    </div>
  );
});

MyComponent.displayName = 'MyComponent';
MyComponent.error = (error: Error) => {
  console.error(error);
};

export default MyComponent;

import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { sanitizeUserInput } from '../../security/sanitizer';
import { isValidElement, cloneElement } from 'react';
import { forwardRef } from 'react';

interface Props {
  message: string | JSX.Element;
  className?: string;
  ariaLabel?: string;
}

const MyComponent = forwardRef<HTMLDivElement, Props>(({ message, className, ariaLabel }, ref) => {
  const [sanitizedMessage, setSanitizedMessage] = useState<JSX.Element | null>(null);

  const handleSanitizeMessage = useCallback(() => {
    if (typeof message === 'string') {
      setSanitizedMessage(<span dangerouslySetInnerHTML={{ __html: sanitizeUserInput(message) }} />);
    } else if (isValidElement(message)) {
      setSanitizedMessage(
        cloneElement(message, {
          dangerouslySetInnerHTML: {
            __html: sanitizeUserInput(message.props.dangerouslySetInnerHTML.__html),
          },
        })
      );
    } else {
      setSanitizedMessage(message);
    }
  }, [message]);

  useEffect(() => {
    handleSanitizeMessage();
  }, [handleSanitizeMessage]);

  return (
    <div ref={ref} className={className} aria-label={ariaLabel}>
      {sanitizedMessage}
    </div>
  );
});

MyComponent.displayName = 'MyComponent';
MyComponent.error = (error: Error) => {
  console.error(error);
};

export default MyComponent;