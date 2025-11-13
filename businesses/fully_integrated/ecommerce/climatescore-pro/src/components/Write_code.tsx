import React, { FC, ReactNode, useId } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
  className?: string;
  testID?: string;
  ariaLabel?: string;
}

const MyComponent: FC<Props> = ({ message, className, testID, ariaLabel }) => {
  const id = useId();

  const sanitizedMessage = DOMPurify.sanitize(message);

  return (
    <div
      id={id}
      className={className}
      data-testid={testID}
      aria-label={ariaLabel || id}
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
    />
  );
};

export default MyComponent;

import React, { FC, ReactNode, useId } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
  className?: string;
  testID?: string;
  ariaLabel?: string;
}

const MyComponent: FC<Props> = ({ message, className, testID, ariaLabel }) => {
  const id = useId();

  const sanitizedMessage = DOMPurify.sanitize(message);

  return (
    <div
      id={id}
      className={className}
      data-testid={testID}
      aria-label={ariaLabel || id}
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
    />
  );
};

export default MyComponent;