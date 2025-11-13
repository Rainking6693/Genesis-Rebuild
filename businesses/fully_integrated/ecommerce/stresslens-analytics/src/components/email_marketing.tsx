import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import { sanitizeUserInput } from '../../security/input_sanitization';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message?: string;
}

const MyComponent: FC<Props> = ({ id, aria-label, className, style, message, ...rest }) => {
  let sanitizedMessage: ReactNode;

  try {
    sanitizedMessage = sanitizeUserInput(message || '');
  } catch (error) {
    sanitizedMessage = <div>Error sanitizing message: {error.message}</div>;
  }

  return (
    <div id={id} className={className} style={style} {...rest}>
      <div aria-label={aria-label}>
        <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      </div>
      <div id="email-marketing-message" aria-label="Email marketing message">
        {sanitizedMessage}
      </div>
    </div>
  );
};

export default MyComponent;

import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import { sanitizeUserInput } from '../../security/input_sanitization';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message?: string;
}

const MyComponent: FC<Props> = ({ id, aria-label, className, style, message, ...rest }) => {
  let sanitizedMessage: ReactNode;

  try {
    sanitizedMessage = sanitizeUserInput(message || '');
  } catch (error) {
    sanitizedMessage = <div>Error sanitizing message: {error.message}</div>;
  }

  return (
    <div id={id} className={className} style={style} {...rest}>
      <div aria-label={aria-label}>
        <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      </div>
      <div id="email-marketing-message" aria-label="Email marketing message">
        {sanitizedMessage}
      </div>
    </div>
  );
};

export default MyComponent;