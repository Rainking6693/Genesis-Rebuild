import React, { PropsWithChildren, DetailedHTMLProps } from 'react';

type FunctionalComponentProps = PropsWithChildren<{
  message?: string;
  className?: string;
  dataTestId?: string;
}> &
  DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

/**
 * FunctionalComponent React functional component
 */
const FunctionalComponent: React.FC<FunctionalComponentProps> = ({
  children,
  message,
  className,
  dataTestId,
  ...rest
}) => {
  const finalMessage = message || children;

  // Add accessibility by providing a role and aria-label
  return (
    <div
      className={className}
      data-testid={dataTestId}
      role="presentation"
      {...rest}
    >
      <div className="FunctionalComponent" aria-label="Functional Component">
        {finalMessage}
      </div>
    </div>
  );
};

// Add default props for better maintainability
FunctionalComponent.defaultProps = {
  message: '',
  className: '',
  dataTestId: '',
};

export default FunctionalComponent;

import React, { PropsWithChildren, DetailedHTMLProps } from 'react';

type FunctionalComponentProps = PropsWithChildren<{
  message?: string;
  className?: string;
  dataTestId?: string;
}> &
  DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

/**
 * FunctionalComponent React functional component
 */
const FunctionalComponent: React.FC<FunctionalComponentProps> = ({
  children,
  message,
  className,
  dataTestId,
  ...rest
}) => {
  const finalMessage = message || children;

  // Add accessibility by providing a role and aria-label
  return (
    <div
      className={className}
      data-testid={dataTestId}
      role="presentation"
      {...rest}
    >
      <div className="FunctionalComponent" aria-label="Functional Component">
        {finalMessage}
      </div>
    </div>
  );
};

// Add default props for better maintainability
FunctionalComponent.defaultProps = {
  message: '',
  className: '',
  dataTestId: '',
};

export default FunctionalComponent;