import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

// Define the interface for the props
interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode;
}

// Create a named component using the functional component syntax
const AuditLogs: FC<Props> = ({ className, children, message, ...rest }) => {
  // Render the component using the provided message, optional className, and other HTML attributes
  return (
    <div className={className} {...rest}>
      {children || <span>{message}</span>}
    </div>
  );
};

// Export the component for use in other modules
export default AuditLogs;

import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

// Define the interface for the props
interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode;
}

// Create a named component using the functional component syntax
const AuditLogs: FC<Props> = ({ className, children, message, ...rest }) => {
  // Render the component using the provided message, optional className, and other HTML attributes
  return (
    <div className={className} {...rest}>
      {children || <span>{message}</span>}
    </div>
  );
};

// Export the component for use in other modules
export default AuditLogs;