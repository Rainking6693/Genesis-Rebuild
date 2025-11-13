import React, { FC, PropsWithChildren, Ref, forwardRef, MouseEvent, KeyboardEvent } from 'react';
import DOMPurify from 'dompurify';

interface Props extends DefaultHTMLProps<HTMLDivElement> {
  message?: string;
  children?: React.ReactNode;
  className?: string;
  testID?: string;
  role?: string;
  tabIndex?: number;
  ref?: Ref<HTMLDivElement>;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
  onMouseOver?: (event: MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (event: MouseEvent<HTMLDivElement>) => void;
}

const MyComponent = forwardRef<HTMLDivElement, Props>(({ message, children, className, testID, role, tabIndex, ref, onClick, onKeyDown, onMouseOver, onMouseLeave, ...rest }, refProp) => {
  // Validate the message before setting it
  const validatedMessage = validateMessage(message);

  // Use a safe method to set innerHTML to avoid XSS attacks
  const sanitizedMessage = createInnerHTML(validatedMessage);

  return (
    <div
      data-testid={testID}
      ref={refProp}
      tabIndex={tabIndex}
      role={role}
      className={className}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      {...rest}
    >
      {children}
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
    </div>
  );
});

// Implement validation logic here
const validateMessage = (message: string) => {
  // Perform basic validation checks (e.g., length, empty string)
  if (!message) {
    throw new Error('Message cannot be empty');
  }

  // Use a library like DOMPurify to sanitize the message
  // https://github.com/cure53/DOMPurify
  return message;
};

// Create a safe innerHTML string using DOMPurify
const createInnerHTML = (html: string) => {
  const sanitized = new DOMPurify().sanitize(html);
  return sanitized.toString();
};

MyComponent.defaultProps = {
  message: '',
  children: React.ReactNode,
};

export default MyComponent;

This updated component now supports more accessibility features, has better type safety, and is more maintainable due to the added props and improved structure.