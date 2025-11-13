import React, { FC, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  className?: string;
  id?: string;
  role?: string;
  ariaLabel?: string;
}

const MyComponent: FC<Props> = ({
  message,
  className,
  id,
  role,
  ariaLabel,
  ...rest
}) => {
  return (
    <div id={id} className={className} role={role} aria-label={ariaLabel} {...rest}>
      {message}
    </div>
  );
};

export default MyComponent;

import React, { FC, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  className?: string;
  id?: string;
  role?: string;
  ariaLabel?: string;
}

const MyComponent: FC<Props> = ({
  message,
  className,
  id,
  role,
  ariaLabel,
  ...rest
}) => {
  return (
    <div id={id} className={className} role={role} aria-label={ariaLabel} {...rest}>
      {message}
    </div>
  );
};

export default MyComponent;