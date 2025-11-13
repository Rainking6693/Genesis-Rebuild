import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  className?: string;
  ariaLabel?: string;
}

const MyComponent: React.FC<Props> = ({ message, className, ariaLabel }) => {
  const defaultAriaLabel = 'Custom message component';

  return (
    <div className={className} aria-label={ariaLabel || defaultAriaLabel}>
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
  const defaultAriaLabel = 'Custom message component';

  return (
    <div className={className} aria-label={ariaLabel || defaultAriaLabel}>
      {message}
    </div>
  );
};

export default MyComponent;