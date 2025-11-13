import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import DOMPurify from 'dompurify';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  messageSource: 'user' | 'system' | 'api';
  message: string;
}

const MyComponent: FC<Props> = ({ messageSource, message, className = '', ...rest }) => {
  // Add a conditional check to sanitize user-generated messages for potential XSS attacks
  const sanitizedMessage = messageSource === 'user' ? sanitize(message) : message;

  const sanitize = (text: string) => {
    // Use DOMPurify for XSS sanitization
    const sanitized = DOMPurify.sanitize(text);
    return { __html: sanitized };
  };

  return <div {...rest} className={className} dangerouslySetInnerHTML={sanitizedMessage} />;
};

export default MyComponent;

In this updated code, I've used the `DetailedHTMLProps` utility type from React to add type annotations for the `className` prop and any other HTML attributes that might be passed to the component. I've also added a default value for the `className` prop to avoid potential issues when the prop is not provided. This ensures that the component is more maintainable and handles edge cases better.