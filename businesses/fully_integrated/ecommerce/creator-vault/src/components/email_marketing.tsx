import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  className?: string;
  ariaLabel?: string;
}

const FunctionalComponent: React.FC<Props> = ({ message, className, ariaLabel }) => {
  const defaultClassName = 'email-marketing-message';
  const defaultAriaLabel = 'Email marketing message';

  return (
    <div className={`${defaultClassName} ${className}`} aria-label={ariaLabel || defaultAriaLabel}>
      {message}
    </div>
  );
};

FunctionalComponent.defaultProps = {
  className: '',
  ariaLabel: defaultAriaLabel,
};

export default FunctionalComponent;

import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  className?: string;
  ariaLabel?: string;
}

const FunctionalComponent: React.FC<Props> = ({ message, className, ariaLabel }) => {
  const defaultClassName = 'email-marketing-message';
  const defaultAriaLabel = 'Email marketing message';

  return (
    <div className={`${defaultClassName} ${className}`} aria-label={ariaLabel || defaultAriaLabel}>
      {message}
    </div>
  );
};

FunctionalComponent.defaultProps = {
  className: '',
  ariaLabel: defaultAriaLabel,
};

export default FunctionalComponent;