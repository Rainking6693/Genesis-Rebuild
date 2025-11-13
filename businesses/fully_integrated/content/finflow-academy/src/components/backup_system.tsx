import React, { FC, DetailedHTMLProps, HTMLAttributes, Key } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  id?: string; // Add an optional id for accessibility and easier reference
  role?: 'alert' | 'status'; // Add a role for accessibility
}

const BackupSystemMessage: FC<Props> = ({ id, role = 'alert', className, message, ...rest }) => {
  const rootClasses = `backup-system-message ${className || ''}`;

  // Add a unique key for each message instance to avoid React warnings
  const uniqueKey = id || String(Math.random());

  return (
    <div {...rest} id={id} role={role} className={rootClasses} key={uniqueKey}>
      {message}
    </div>
  );
};

export default BackupSystemMessage;

import React, { FC, DetailedHTMLProps, HTMLAttributes, Key } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  id?: string; // Add an optional id for accessibility and easier reference
  role?: 'alert' | 'status'; // Add a role for accessibility
}

const BackupSystemMessage: FC<Props> = ({ id, role = 'alert', className, message, ...rest }) => {
  const rootClasses = `backup-system-message ${className || ''}`;

  // Add a unique key for each message instance to avoid React warnings
  const uniqueKey = id || String(Math.random());

  return (
    <div {...rest} id={id} role={role} className={rootClasses} key={uniqueKey}>
      {message}
    </div>
  );
};

export default BackupSystemMessage;