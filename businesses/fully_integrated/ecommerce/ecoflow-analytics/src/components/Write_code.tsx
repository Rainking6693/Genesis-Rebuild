import React, { FC, ReactNode, PropsWithChildren } from 'react';
import DOMPurify from 'dompurify';

declare const DOMPurifySanitize: (input: string, config?: DOMPurify.SanitizeOptions) => string;

interface Props extends PropsWithChildren<{}> {
  message?: string;
}

const MyComponent: FC<Props> = ({ children, message }) => {
  const sanitizedMessage = message ? DOMPurifySanitize(message) : '';
  const sanitizedChildren = React.Children.map(children, (child) => {
    if (typeof child === 'string') {
      return DOMPurifySanitize(child);
    }
    return child;
  });

  return <div aria-label="MyComponent">{sanitizedChildren}</div>;
};

export default MyComponent;

import React, { FC, ReactNode, PropsWithChildren } from 'react';
import DOMPurify from 'dompurify';

declare const DOMPurifySanitize: (input: string, config?: DOMPurify.SanitizeOptions) => string;

interface Props extends PropsWithChildren<{}> {
  message?: string;
}

const MyComponent: FC<Props> = ({ children, message }) => {
  const sanitizedMessage = message ? DOMPurifySanitize(message) : '';
  const sanitizedChildren = React.Children.map(children, (child) => {
    if (typeof child === 'string') {
      return DOMPurifySanitize(child);
    }
    return child;
  });

  return <div aria-label="MyComponent">{sanitizedChildren}</div>;
};

export default MyComponent;