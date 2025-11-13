import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message?: string;
  children?: ReactNode;
  dataTestId?: string;
}

const MyComponent: FC<Props> = ({ children, message, className, dataTestId, ...rest }) => {
  return (
    <div data-testid={dataTestId} className={className} {...rest}>
      {children || message}
    </div>
  );
};

MyComponent.defaultProps = {
  children: null,
  className: '',
  dataTestId: 'my-component',
};

export default MyComponent;

import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message?: string;
  children?: ReactNode;
  dataTestId?: string;
}

const MyComponent: FC<Props> = ({ children, message, className, dataTestId, ...rest }) => {
  return (
    <div data-testid={dataTestId} className={className} {...rest}>
      {children || message}
    </div>
  );
};

MyComponent.defaultProps = {
  children: null,
  className: '',
  dataTestId: 'my-component',
};

export default MyComponent;