import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

type ComponentType = FC<Props>;

const MyComponent: ComponentType = ({ id, className, role, ariaLabel, message, ...rest }: Props) => {
  const sanitizedMessage = new DOMParser().parseFromString(message, 'text/html').documentElement.outerHTML;

  const fallbackDescription = `A div containing potentially unsafe HTML content: ${message}`;

  return (
    <div
      id={id || 'customer-support-bot'}
      role={role || 'presentation'}
      className={className || 'customer-support-bot'}
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      aria-label={ariaLabel || fallbackDescription}
      {...rest}
    />
  );
};

export default MyComponent;

import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

type ComponentType = FC<Props>;

const MyComponent: ComponentType = ({ id, className, role, ariaLabel, message, ...rest }: Props) => {
  const sanitizedMessage = new DOMParser().parseFromString(message, 'text/html').documentElement.outerHTML;

  const fallbackDescription = `A div containing potentially unsafe HTML content: ${message}`;

  return (
    <div
      id={id || 'customer-support-bot'}
      role={role || 'presentation'}
      className={className || 'customer-support-bot'}
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      aria-label={ariaLabel || fallbackDescription}
      {...rest}
    />
  );
};

export default MyComponent;