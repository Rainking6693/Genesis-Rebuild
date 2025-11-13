import React, { FC, ReactNode } from 'react';

interface Props {
  id?: string; // Adding an optional id for each cart item
  message: string;
  className?: string; // Adding a className prop for styling
  children?: ReactNode; // Allowing for additional child elements
}

const MyComponent: FC<Props> = ({ id, message, className, children }) => {
  return (
    <div className={className} data-testid={id}>
      {children}
      <p>{message}</p>
    </div>
  );
};

MyComponent.defaultProps = {
  id: undefined,
  className: '',
};

export default MyComponent;

import React, { FC, ReactNode } from 'react';

interface Props {
  id?: string; // Adding an optional id for each cart item
  message: string;
  className?: string; // Adding a className prop for styling
  children?: ReactNode; // Allowing for additional child elements
}

const MyComponent: FC<Props> = ({ id, message, className, children }) => {
  return (
    <div className={className} data-testid={id}>
      {children}
      <p>{message}</p>
    </div>
  );
};

MyComponent.defaultProps = {
  id: undefined,
  className: '',
};

export default MyComponent;