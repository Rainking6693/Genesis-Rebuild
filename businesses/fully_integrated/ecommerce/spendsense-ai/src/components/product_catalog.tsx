import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  className?: string;
}

const FunctionalComponent: React.FC<Props> = ({ message, className }) => {
  const fallbackMessage = "An error occurred. Please refresh the page.";
  const fallbackClassName = "error-message";

  return (
    <div className={className || fallbackClassName}>
      {message || fallbackMessage}
    </div>
  );
};

FunctionalComponent.defaultProps = {
  className: undefined,
};

export default FunctionalComponent;

import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  className?: string;
}

const FunctionalComponent: React.FC<Props> = ({ message, className }) => {
  const fallbackMessage = "An error occurred. Please refresh the page.";
  const fallbackClassName = "error-message";

  return (
    <div className={className || fallbackClassName}>
      {message || fallbackMessage}
    </div>
  );
};

FunctionalComponent.defaultProps = {
  className: undefined,
};

export default FunctionalComponent;