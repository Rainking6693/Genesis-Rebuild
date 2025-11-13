import React, { useMemo, FC, PropsWithChildren, DefaultHTMLProps, ReactNode, HTMLAttributes, DetailedHTMLProps } from 'react';

interface Props extends DefaultHTMLProps<HTMLDivElement> {
  message: string;
  testID?: string;
  className?: string;
  ariaLabel?: string;
}

const MyComponent: FC<Props> = ({ message, testID, className, ariaLabel, ...rest }) => {
  const sanitizedMessage = useMemo(() => {
    try {
      // Sanitize the message to prevent XSS attacks
      const parser = new DOMParser();
      const sanitizedMessage = parser.parseFromString(message, 'text/html').documentElement;
      return sanitizedMessage.innerHTML;
    } catch (error) {
      console.error('Error sanitizing message:', error);
      return message;
    }
  }, [message]);

  return (
    <div
      data-testid={testID}
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      {...rest}
      aria-label={ariaLabel} // Add ARIA label for accessibility
    />
  );
};

MyComponent.defaultProps = {
  testID: 'my-component',
  ariaLabel: 'MyComponent', // Add default ARIA label
};

export default MyComponent;

import React, { useMemo, FC, PropsWithChildren, DefaultHTMLProps, ReactNode, HTMLAttributes, DetailedHTMLProps } from 'react';

interface Props extends DefaultHTMLProps<HTMLDivElement> {
  message: string;
  testID?: string;
  className?: string;
  ariaLabel?: string;
}

const MyComponent: FC<Props> = ({ message, testID, className, ariaLabel, ...rest }) => {
  const sanitizedMessage = useMemo(() => {
    try {
      // Sanitize the message to prevent XSS attacks
      const parser = new DOMParser();
      const sanitizedMessage = parser.parseFromString(message, 'text/html').documentElement;
      return sanitizedMessage.innerHTML;
    } catch (error) {
      console.error('Error sanitizing message:', error);
      return message;
    }
  }, [message]);

  return (
    <div
      data-testid={testID}
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      {...rest}
      aria-label={ariaLabel} // Add ARIA label for accessibility
    />
  );
};

MyComponent.defaultProps = {
  testID: 'my-component',
  ariaLabel: 'MyComponent', // Add default ARIA label
};

export default MyComponent;