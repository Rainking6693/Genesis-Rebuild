import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  className?: string;
}

const FunctionalComponent: React.FC<Props> = ({ message, className }) => {
  const fallbackMessage = "An error occurred. Please refresh the page.";
  const finalClassName = className || "";

  return (
    <div className={finalClassName}>
      {message || fallbackMessage}
    </div>
  );
};

FunctionalComponent.defaultProps = {
  className: "",
};

export default FunctionalComponent;

import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  className?: string;
}

const FunctionalComponent: React.FC<Props> = ({ message, className }) => {
  const fallbackMessage = "An error occurred. Please refresh the page.";
  const finalClassName = className || "";

  return (
    <div className={finalClassName}>
      {message || fallbackMessage}
    </div>
  );
};

FunctionalComponent.defaultProps = {
  className: "",
};

export default FunctionalComponent;