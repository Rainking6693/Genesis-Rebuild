import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  className?: string;
  ariaLabel?: string;
}

const MyComponent: React.FC<Props> = ({ message, className, ariaLabel }) => {
  const defaultClassName = 'my-component';
  const mergedClassName = className ? `${className} ${defaultClassName}` : defaultClassName;

  return (
    <div className={mergedClassName} aria-label={ariaLabel}>
      {message}
    </div>
  );
};

MyComponent.defaultProps = {
  className: undefined,
  ariaLabel: undefined,
};

export default MyComponent;

import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  className?: string;
  ariaLabel?: string;
}

const MyComponent: React.FC<Props> = ({ message, className, ariaLabel }) => {
  const defaultClassName = 'my-component';
  const mergedClassName = className ? `${className} ${defaultClassName}` : defaultClassName;

  return (
    <div className={mergedClassName} aria-label={ariaLabel}>
      {message}
    </div>
  );
};

MyComponent.defaultProps = {
  className: undefined,
  ariaLabel: undefined,
};

export default MyComponent;