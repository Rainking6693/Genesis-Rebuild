import React, { useMemo, useState } from 'react';
import { sanitizeUserInput, handleEmptyMessage } from '../../utils/security';
import { forwardRef } from 'react';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The message to be rendered in the component.
   */
  message: string;
}

const MyComponent = forwardRef<HTMLDivElement, Props>(({ message, ...rest }, ref) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message);
  const [defaultMessage, setDefaultMessage] = useState(handleEmptyMessage(message));

  React.useEffect(() => {
    setSanitizedMessage(sanitizeUserInput(message));
    setDefaultMessage(handleEmptyMessage(message));
  }, [message]);

  const memoizedComponent = useMemo(() => {
    if (!sanitizedMessage) return <div dangerouslySetInnerHTML={{ __html: defaultMessage }} {...rest} ref={ref} />;
    return <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} {...rest} ref={ref} />;
  }, [sanitizedMessage, defaultMessage, rest]);

  return memoizedComponent;
});

MyComponent.displayName = 'MyComponent';

export default MyComponent;

import React, { useMemo, useState } from 'react';
import { sanitizeUserInput, handleEmptyMessage } from '../../utils/security';
import { forwardRef } from 'react';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The message to be rendered in the component.
   */
  message: string;
}

const MyComponent = forwardRef<HTMLDivElement, Props>(({ message, ...rest }, ref) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message);
  const [defaultMessage, setDefaultMessage] = useState(handleEmptyMessage(message));

  React.useEffect(() => {
    setSanitizedMessage(sanitizeUserInput(message));
    setDefaultMessage(handleEmptyMessage(message));
  }, [message]);

  const memoizedComponent = useMemo(() => {
    if (!sanitizedMessage) return <div dangerouslySetInnerHTML={{ __html: defaultMessage }} {...rest} ref={ref} />;
    return <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} {...rest} ref={ref} />;
  }, [sanitizedMessage, defaultMessage, rest]);

  return memoizedComponent;
});

MyComponent.displayName = 'MyComponent';

export default MyComponent;