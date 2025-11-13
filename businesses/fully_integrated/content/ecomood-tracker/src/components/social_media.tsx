import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  className?: string;
  ariaLabel?: string;
}

const MyComponent: React.FC<Props> = ({ message, className, ariaLabel }) => {
  const customClass = className ? ` ${className}` : '';

  return (
    <div className={`social-media-message${customClass}`} aria-label={ariaLabel}>
      {message}
    </div>
  );
};

export default MyComponent;

import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  className?: string;
  ariaLabel?: string;
}

const MyComponent: React.FC<Props> = ({ message, className, ariaLabel }) => {
  const customClass = className ? ` ${className}` : '';

  return (
    <div className={`social-media-message${customClass}`} aria-label={ariaLabel}>
      {message}
    </div>
  );
};

export default MyComponent;