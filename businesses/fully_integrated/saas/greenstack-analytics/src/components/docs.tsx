import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  className?: string;
  ariaLabel?: string;
}

const FunctionalComponent: React.FC<Props> = ({ message, className, ariaLabel }) => {
  const defaultAriaLabel = 'Message';

  return (
    <div className={className} aria-label={ariaLabel || defaultAriaLabel}>
      {message}
    </div>
  );
};

export default FunctionalComponent;

import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  className?: string;
  ariaLabel?: string;
}

const FunctionalComponent: React.FC<Props> = ({ message, className, ariaLabel }) => {
  const defaultAriaLabel = 'Message';

  return (
    <div className={className} aria-label={ariaLabel || defaultAriaLabel}>
      {message}
    </div>
  );
};

export default FunctionalComponent;