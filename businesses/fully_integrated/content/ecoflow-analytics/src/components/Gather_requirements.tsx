import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title?: string;
  titleDefault?: string; // Default value for title
  subtitle?: string;
  subtitleDefault?: string; // Default value for subtitle
  message: string;
  children?: ReactNode;
  className?: string;
  'data-testid'?: string;
}

const MyComponent: FC<Props> = ({
  title = 'My Component',
  titleDefault = 'My Component',
  subtitle = '',
  subtitleDefault = '',
  message,
  children,
  className,
  'data-testid': dataTestId = 'my-component',
  ...rest
}) => {
  return (
    <div data-testid={dataTestId} className={className} {...rest}>
      <h2 role="heading" aria-level={2}>
        {title || titleDefault}
      </h2>
      <p role="text">{subtitle || subtitleDefault}</p>
      <div>{message}</div>
      {children}
    </div>
  );
};

export default MyComponent;

import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title?: string;
  titleDefault?: string; // Default value for title
  subtitle?: string;
  subtitleDefault?: string; // Default value for subtitle
  message: string;
  children?: ReactNode;
  className?: string;
  'data-testid'?: string;
}

const MyComponent: FC<Props> = ({
  title = 'My Component',
  titleDefault = 'My Component',
  subtitle = '',
  subtitleDefault = '',
  message,
  children,
  className,
  'data-testid': dataTestId = 'my-component',
  ...rest
}) => {
  return (
    <div data-testid={dataTestId} className={className} {...rest}>
      <h2 role="heading" aria-level={2}>
        {title || titleDefault}
      </h2>
      <p role="text">{subtitle || subtitleDefault}</p>
      <div>{message}</div>
      {children}
    </div>
  );
};

export default MyComponent;