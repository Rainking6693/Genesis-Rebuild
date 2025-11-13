import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import { sanitizeUserInput } from '../../security/input_sanitizer';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const MyComponent: FC<Props> = ({ message, ...divProps }) => {
  const sanitizedMessage = sanitizeUserInput(message);

  if (!sanitizedMessage) return null; // Prevent rendering an empty div

  const safeHTML: ReactNode = { __html: sanitizedMessage };

  return (
    <div {...divProps} aria-label="User message">
      {/* Add a fallback for screen readers */}
      <div>{sanitizedMessage}</div>
      <div dangerouslySetInnerHTML={safeHTML} />
    </div>
  );
};

MyComponent.propTypes = {
  message: PropTypes.string,
};

export default MyComponent;

import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import { sanitizeUserInput } from '../../security/input_sanitizer';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const MyComponent: FC<Props> = ({ message, ...divProps }) => {
  const sanitizedMessage = sanitizeUserInput(message);

  if (!sanitizedMessage) return null; // Prevent rendering an empty div

  const safeHTML: ReactNode = { __html: sanitizedMessage };

  return (
    <div {...divProps} aria-label="User message">
      {/* Add a fallback for screen readers */}
      <div>{sanitizedMessage}</div>
      <div dangerouslySetInnerHTML={safeHTML} />
    </div>
  );
};

MyComponent.propTypes = {
  message: PropTypes.string,
};

export default MyComponent;