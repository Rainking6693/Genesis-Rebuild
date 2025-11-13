import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode; // Allows for additional content within the component
  isError?: boolean; // Flag for error messages to apply specific styles
}

const EcoTraceComponent: FC<Props> = ({ className, message, isError = false, ...rest }) => {
  const rootClassName = `eco-trace-message ${className || ''} ${isError ? 'error' : ''}`;

  return (
    <div {...rest} className={rootClassName} role="alert">
      {message}
      {/* Add ARIA attributes for accessibility */}
      <span className="sr-only">{isError ? 'Error' : 'Message'}</span>
      {/* Allow for additional content within the component */}
      {rest.children}
    </div>
  );
};

export default EcoTraceComponent;

import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode; // Allows for additional content within the component
  isError?: boolean; // Flag for error messages to apply specific styles
}

const EcoTraceComponent: FC<Props> = ({ className, message, isError = false, ...rest }) => {
  const rootClassName = `eco-trace-message ${className || ''} ${isError ? 'error' : ''}`;

  return (
    <div {...rest} className={rootClassName} role="alert">
      {message}
      {/* Add ARIA attributes for accessibility */}
      <span className="sr-only">{isError ? 'Error' : 'Message'}</span>
      {/* Allow for additional content within the component */}
      {rest.children}
    </div>
  );
};

export default EcoTraceComponent;