import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode;
  isError?: boolean;
}

const BackupSystemMessage: FC<Props> = ({ className, message, isError = false, children, ...rest }) => {
  const rootClasses = `backup-system-message ${className || ''} ${isError ? 'error' : ''}`;

  return (
    <div {...rest} className={rootClasses}>
      {children || message}
      <span className={`sr-only`}>Backup system message</span>
    </div>
  );
};

export default BackupSystemMessage;

import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode;
  isError?: boolean;
}

const BackupSystemMessage: FC<Props> = ({ className, message, isError = false, children, ...rest }) => {
  const rootClasses = `backup-system-message ${className || ''} ${isError ? 'error' : ''}`;

  return (
    <div {...rest} className={rootClasses}>
      {children || message}
      <span className={`sr-only`}>Backup system message</span>
    </div>
  );
};

export default BackupSystemMessage;