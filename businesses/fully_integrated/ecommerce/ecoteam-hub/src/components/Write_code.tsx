import React, { FC, ReactNode, DetailedHTMLProps } from 'react';
import DOMPurify from 'dompurify';

interface Props extends DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message?: string;
}

const sanitize = (html: string) => {
  const sanitized = DOMPurify.sanitize(html);
  return { __html: sanitized };
};

const MyComponent: FC<Props> = ({ message = '', children, ...rest }) => {
  const safeMessage = message ? sanitize(message) : {};
  const safeChildren = React.Children.map(children, child => {
    if (typeof child === 'string') {
      return sanitize(child);
    }
    return child;
  });

  return (
    <div {...rest} aria-label={message}>
      {safeChildren}
    </div>
  );
};

export default MyComponent;

import React, { FC, ReactNode, DetailedHTMLProps } from 'react';
import DOMPurify from 'dompurify';

interface Props extends DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message?: string;
}

const sanitize = (html: string) => {
  const sanitized = DOMPurify.sanitize(html);
  return { __html: sanitized };
};

const MyComponent: FC<Props> = ({ message = '', children, ...rest }) => {
  const safeMessage = message ? sanitize(message) : {};
  const safeChildren = React.Children.map(children, child => {
    if (typeof child === 'string') {
      return sanitize(child);
    }
    return child;
  });

  return (
    <div {...rest} aria-label={message}>
      {safeChildren}
    </div>
  );
};

export default MyComponent;