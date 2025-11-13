import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import DOMPurify from 'dompurify';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message?: string;
  children?: ReactNode;
}

const sanitizeAndEscapeHTML = (html: string) => {
  const sanitized = DOMPurify.sanitize(html);
  return DOMPurify.escape(sanitized);
};

const MyComponent: FC<Props> = ({ message = sanitizeAndEscapeHTML('Welcome to ReviewSync Pro blog!'), children, ...rest }) => {
  return (
    <div
      data-testid="my-component" // Add a data-testid for testing purposes
      dangerouslySetInnerHTML={{ __html: message }}
      {...rest}
    >
      {children}
    </div>
  );
};

// Add a displayName for easier identification in React DevTools and error messages
MyComponent.displayName = 'MyComponent';

// Export default and named export for better reusability
export default MyComponent;
export { MyComponent as MyComponentWithDefaults };

import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import DOMPurify from 'dompurify';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message?: string;
  children?: ReactNode;
}

const sanitizeAndEscapeHTML = (html: string) => {
  const sanitized = DOMPurify.sanitize(html);
  return DOMPurify.escape(sanitized);
};

const MyComponent: FC<Props> = ({ message = sanitizeAndEscapeHTML('Welcome to ReviewSync Pro blog!'), children, ...rest }) => {
  return (
    <div
      data-testid="my-component" // Add a data-testid for testing purposes
      dangerouslySetInnerHTML={{ __html: message }}
      {...rest}
    >
      {children}
    </div>
  );
};

// Add a displayName for easier identification in React DevTools and error messages
MyComponent.displayName = 'MyComponent';

// Export default and named export for better reusability
export default MyComponent;
export { MyComponent as MyComponentWithDefaults };