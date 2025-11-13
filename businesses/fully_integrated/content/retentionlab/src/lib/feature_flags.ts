import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface MessageComponentProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  variant?: 'error' | 'success' | 'info' | 'warning';
  isError?: boolean;
  children?: ReactNode;
  testId?: string;
}

const MessageComponent: FC<MessageComponentProps> = ({
  message,
  variant = 'info',
  isError,
  children,
  className,
  testId,
  ...props
}) => {
  const messageClasses = `message ${variant} ${isError ? 'error' : ''} ${className}`;

  return (
    <div data-testid={testId} {...props} className={messageClasses}>
      <span className="message-content" role="alert">{message}</span>
      {children && <div className="message-content-extra">{children}</div>}
    </div>
  );
};

export { MessageComponent };

// Usage example
import React from 'react';
import MessageComponent from './MessageComponent';

const ErrorMessage = () => {
  return (
    <MessageComponent message="An error occurred" variant="error" isError>
      An error has occurred. Please try again.
    </MessageComponent>
  );
};

const SuccessMessage = () => {
  return (
    <MessageComponent message="Operation successful." variant="success">
      Operation successful.
    </MessageComponent>
  );
};

export { ErrorMessage, SuccessMessage };

In this updated version, I've added a `variant` prop to support different message styles, a `testId` prop for easier testing and automation, ARIA attributes for better accessibility, and a `className` prop to allow for custom CSS classes. The `isError` prop is now optional, and the default variant is 'info'. The `children` prop now has a type, and I've added a `<div>` for additional content within the message component. This approach makes the code more flexible, maintainable, and accessible.