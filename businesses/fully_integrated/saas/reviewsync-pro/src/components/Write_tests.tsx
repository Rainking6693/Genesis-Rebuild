import React, { FunctionComponent, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const MyComponent: FunctionComponent<Props> = ({ className, style, message, ...rest }) => {
  const sanitizedMessage = sanitizeHtml(message); // Add a sanitize function to prevent XSS attacks

  return (
    <div
      className={className}
      style={style}
      {...rest}
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      aria-label={sanitizedMessage} // Add aria-label for accessibility
    />
  );
};

export default MyComponent;

import React, { FunctionComponent, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const MyComponent: FunctionComponent<Props> = ({ className, style, message, ...rest }) => {
  const sanitizedMessage = sanitizeHtml(message); // Add a sanitize function to prevent XSS attacks

  return (
    <div
      className={className}
      style={style}
      {...rest}
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      aria-label={sanitizedMessage} // Add aria-label for accessibility
    />
  );
};

export default MyComponent;