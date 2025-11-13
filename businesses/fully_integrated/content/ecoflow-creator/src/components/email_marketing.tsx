import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  subject?: string; // Add subject for email personalization, made optional
  message: string;
  children?: ReactNode; // Allow for additional content within the component
}

const MyComponent: FC<Props> = ({ id, className, subject, message, children, ...rest }) => {
  const generatedId = subject?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div id={id || generatedId} className={className} {...rest}>
      {/* Wrap subject in an h3 tag for better visual hierarchy */}
      <h3 id={generatedId}>{subject}</h3>

      {/* Wrap message in a p tag for better readability */}
      <p>{message}</p>

      {/* Allow for additional content within the component */}
      {children}
    </div>
  );
};

export default MyComponent;

import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  subject?: string; // Add subject for email personalization, made optional
  message: string;
  children?: ReactNode; // Allow for additional content within the component
}

const MyComponent: FC<Props> = ({ id, className, subject, message, children, ...rest }) => {
  const generatedId = subject?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div id={id || generatedId} className={className} {...rest}>
      {/* Wrap subject in an h3 tag for better visual hierarchy */}
      <h3 id={generatedId}>{subject}</h3>

      {/* Wrap message in a p tag for better readability */}
      <p>{message}</p>

      {/* Allow for additional content within the component */}
      {children}
    </div>
  );
};

export default MyComponent;