import React, { FC, ReactNode } from 'react';

interface Props {
  id?: string; // Adding an optional id for each cart item
  message: string;
  className?: string; // Adding an optional className for styling
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
  children: null,
};

export default MyComponent;

import React, { FC, ReactNode } from 'react';

interface Props {
  id?: string; // Adding an optional id for each cart item
  message: string;
  className?: string; // Adding an optional className for styling
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
  children: null,
};

export default MyComponent;