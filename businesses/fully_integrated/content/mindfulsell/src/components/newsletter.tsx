import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  className?: string;
}

const MyComponent: React.FC<Props> = ({ message, className }) => {
  const fallbackMessage = 'An error occurred. Please refresh the page.';

  return (
    <div className={className}>
      {message || fallbackMessage}
    </div>
  );
};

MyComponent.defaultProps = {
  className: 'text-gray-800',
};

export default MyComponent;

import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  className?: string;
}

const MyComponent: React.FC<Props> = ({ message, className }) => {
  const fallbackMessage = 'An error occurred. Please refresh the page.';

  return (
    <div className={className}>
      {message || fallbackMessage}
    </div>
  );
};

MyComponent.defaultProps = {
  className: 'text-gray-800',
};

export default MyComponent;