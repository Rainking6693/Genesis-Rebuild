import React, { FC, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const AuditLog: FC<Props> = ({ className, message, ...rest }) => {
  if (typeof message !== 'string') {
    console.error('AuditLog: message prop must be a string.');
    return null;
  }

  return (
    <div className={`audit-log ${className}`} {...rest}>
      <span>{message}</span>
    </div>
  );
};

export default AuditLog;

import React, { FC, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const AuditLog: FC<Props> = ({ className, message, ...rest }) => {
  if (typeof message !== 'string') {
    console.error('AuditLog: message prop must be a string.');
    return null;
  }

  if (typeof className !== 'string') {
    console.error('AuditLog: className prop must be a string.');
    className = '';
  }

  return (
    <div className={`audit-log ${className}`} {...rest}>
      <span>{message}</span>
    </div>
  );
};

export default AuditLog;

import React, { FC, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  ariaLabel?: string;
}

const AuditLog: FC<Props> = ({ className, message, ariaLabel, ...rest }) => {
  if (typeof message !== 'string') {
    console.error('AuditLog: message prop must be a string.');
    return null;
  }

  if (typeof className !== 'string') {
    console.error('AuditLog: className prop must be a string.');
    className = '';
  }

  return (
    <div className={`audit-log ${className}`} {...rest} aria-label={ariaLabel}>
      <span>{message}</span>
    </div>
  );
};

export default AuditLog;

import React, { FC, DetailedHTMLProps, HTMLAttributes } from 'react';
import styles from './audit-log.module.css';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  ariaLabel?: string;
}

const AuditLog: FC<Props> = ({ className, message, ariaLabel, ...rest }) => {
  if (typeof message !== 'string') {
    console.error('AuditLog: message prop must be a string.');
    return null;
  }

  if (typeof className !== 'string') {
    console.error('AuditLog: className prop must be a string.');
    className = '';
  }

  return (
    <div className={`${styles.auditLog} ${className}`} {...rest} aria-label={ariaLabel}>
      <span>{message}</span>
    </div>
  );
};

export default AuditLog;

import React, { FC, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const AuditLog: FC<Props> = ({ className, message, ...rest }) => {
  if (typeof message !== 'string') {
    console.error('AuditLog: message prop must be a string.');
    return null;
  }

  return (
    <div className={`audit-log ${className}`} {...rest}>
      <span>{message}</span>
    </div>
  );
};

export default AuditLog;

import React, { FC, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const AuditLog: FC<Props> = ({ className, message, ...rest }) => {
  if (typeof message !== 'string') {
    console.error('AuditLog: message prop must be a string.');
    return null;
  }

  if (typeof className !== 'string') {
    console.error('AuditLog: className prop must be a string.');
    className = '';
  }

  return (
    <div className={`audit-log ${className}`} {...rest}>
      <span>{message}</span>
    </div>
  );
};

export default AuditLog;

import React, { FC, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  ariaLabel?: string;
}

const AuditLog: FC<Props> = ({ className, message, ariaLabel, ...rest }) => {
  if (typeof message !== 'string') {
    console.error('AuditLog: message prop must be a string.');
    return null;
  }

  if (typeof className !== 'string') {
    console.error('AuditLog: className prop must be a string.');
    className = '';
  }

  return (
    <div className={`audit-log ${className}`} {...rest} aria-label={ariaLabel}>
      <span>{message}</span>
    </div>
  );
};

export default AuditLog;

import React, { FC, DetailedHTMLProps, HTMLAttributes } from 'react';
import styles from './audit-log.module.css';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  ariaLabel?: string;
}

const AuditLog: FC<Props> = ({ className, message, ariaLabel, ...rest }) => {
  if (typeof message !== 'string') {
    console.error('AuditLog: message prop must be a string.');
    return null;
  }

  if (typeof className !== 'string') {
    console.error('AuditLog: className prop must be a string.');
    className = '';
  }

  return (
    <div className={`${styles.auditLog} ${className}`} {...rest} aria-label={ariaLabel}>
      <span>{message}</span>
    </div>
  );
};

export default AuditLog;

2. For edge cases, let's handle the scenario where the `className` prop is not a string. In this case, we'll log an error and use an empty string as the className.

3. To improve accessibility, let's add an `aria-label` to the `div` element. This will help screen readers provide a more meaningful description of the component.

4. To improve maintainability, let's create a CSS module for the `audit-log` component. This will help keep the global styles organized and prevent naming conflicts.

Create a `audit-log.module.css` file:

Update the `AuditLog` component to import and use the CSS module: