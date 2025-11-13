import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  className?: string;
  ariaLabel?: string;
}

const MyComponent: React.FC<Props> = ({ message, className, ariaLabel }) => {
  const customClass = className ? ` ${className}` : '';

  return (
    <div className={`seo-optimized-content${customClass}`}>
      <h1 id={`seo-optimized-content-${message.toLowerCase().replace(/\s+/g, '-')}`} aria-label={ariaLabel}>
        {message}
      </h1>
    </div>
  );
};

MyComponent.defaultProps = {
  className: '',
  ariaLabel: '',
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
    <div className={`seo-optimized-content${customClass}`}>
      <h1 id={`seo-optimized-content-${message.toLowerCase().replace(/\s+/g, '-')}`} aria-label={ariaLabel}>
        {message}
      </h1>
    </div>
  );
};

MyComponent.defaultProps = {
  className: '',
  ariaLabel: '',
};

export default MyComponent;