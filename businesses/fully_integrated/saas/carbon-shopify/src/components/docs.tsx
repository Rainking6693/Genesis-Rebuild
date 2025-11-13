import React from 'react';

type ClassName = string;
type Role = 'alert' | 'status' | 'banner' | 'none';
type AriaLabel = string;
type DataTestId = string;

interface Props {
  message?: string;
  className?: ClassName;
  role?: Role;
  'data-testid'?: DataTestId;
  ariaLabel?: AriaLabel;
}

const MyComponent: React.FC<Props> = ({
  message = 'Default message',
  className,
  role = 'alert',
  'data-testid' = 'my-component',
  ariaLabel,
  ...rest
}) => {
  const classes = ['my-component', className].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      role={role}
      data-testid={`${data-testid}`}
      aria-label={ariaLabel || message}
      {...rest}
    >
      {message}
    </div>
  );
};

export default MyComponent;

import React from 'react';

type ClassName = string;
type Role = 'alert' | 'status' | 'banner' | 'none';
type AriaLabel = string;
type DataTestId = string;

interface Props {
  message?: string;
  className?: ClassName;
  role?: Role;
  'data-testid'?: DataTestId;
  ariaLabel?: AriaLabel;
}

const MyComponent: React.FC<Props> = ({
  message = 'Default message',
  className,
  role = 'alert',
  'data-testid' = 'my-component',
  ariaLabel,
  ...rest
}) => {
  const classes = ['my-component', className].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      role={role}
      data-testid={`${data-testid}`}
      aria-label={ariaLabel || message}
      {...rest}
    >
      {message}
    </div>
  );
};

export default MyComponent;