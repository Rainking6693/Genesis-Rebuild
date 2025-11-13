import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message?: string;
  title?: string;
  className?: string;
  key?: string;
}

const MyComponent: FC<Props> = ({ message = '', title, className, key, ...rest }) => {
  const sanitizedMessage = message
    .replace(/<[^>]+>/g, '') // Remove all HTML tags
    .replace(/&([a-zA-Z]{1,5});/g, (match, entity) => {
      switch (entity) {
        case 'amp':
          return '&';
        case 'lt':
          return '<';
        case 'gt':
          return '>';
        default:
          return match;
      }
    });

  return (
    <div
      key={key}
      className={className}
      aria-label={title}
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      {...rest} // Include any additional attributes passed to the component
    />
  );
};

export default MyComponent;

import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message?: string;
  title?: string;
  className?: string;
  key?: string;
}

const MyComponent: FC<Props> = ({ message = '', title, className, key, ...rest }) => {
  const sanitizedMessage = message
    .replace(/<[^>]+>/g, '') // Remove all HTML tags
    .replace(/&([a-zA-Z]{1,5});/g, (match, entity) => {
      switch (entity) {
        case 'amp':
          return '&';
        case 'lt':
          return '<';
        case 'gt':
          return '>';
        default:
          return match;
      }
    });

  return (
    <div
      key={key}
      className={className}
      aria-label={title}
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      {...rest} // Include any additional attributes passed to the component
    />
  );
};

export default MyComponent;