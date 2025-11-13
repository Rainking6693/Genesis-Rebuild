import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  className?: string;
}

const MyComponent: React.FC<Props> = ({ message, className }) => {
  const fallbackMessage = "An error occurred. Please refresh the page.";
  const fallbackClassName = "error-message";

  return (
    <div className={className || fallbackClassName}>
      {message || fallbackMessage}
    </div>
  );
};

MyComponent.defaultProps = {
  className: "",
};

export default MyComponent;

import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  className?: string;
}

const MyComponent: React.FC<Props> = ({ message, className }) => {
  const fallbackMessage = "An error occurred. Please refresh the page.";
  const fallbackClassName = "error-message";

  return (
    <div className={className || fallbackClassName}>
      {message || fallbackMessage}
    </div>
  );
};

MyComponent.defaultProps = {
  className: "",
};

export default MyComponent;