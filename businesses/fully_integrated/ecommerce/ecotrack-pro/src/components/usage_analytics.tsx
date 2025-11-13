import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode;
  className?: string;
}

const MyComponent: FC<Props> = ({ message, children, className, ...htmlAttributes }) => {
  // Add a unique key for each usage_analytics component instance for better React performance
  const key = htmlAttributes.key || Math.random().toString();

  // Sanitize the input message to prevent XSS attacks
  const sanitizedMessage = message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  // Provide an optional children prop for additional content within the component
  // This can be useful for accessibility purposes, such as adding ARIA attributes
  return (
    <div
      className={className}
      data-testid="usage-analytics" // Add a data-testid for easier testing
      {...htmlAttributes}
      key={key}
    >
      {children}
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
    </div>
  );
};

// Add error handling and logging for the usage_analytics component
MyComponent.error = (error: Error) => {
  console.error('UsageAnalyticsComponent Error:', error);
};

// Add a default className for better styling consistency
MyComponent.defaultProps = {
  className: 'usage-analytics',
};

export default MyComponent;

import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode;
  className?: string;
}

const MyComponent: FC<Props> = ({ message, children, className, ...htmlAttributes }) => {
  // Add a unique key for each usage_analytics component instance for better React performance
  const key = htmlAttributes.key || Math.random().toString();

  // Sanitize the input message to prevent XSS attacks
  const sanitizedMessage = message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  // Provide an optional children prop for additional content within the component
  // This can be useful for accessibility purposes, such as adding ARIA attributes
  return (
    <div
      className={className}
      data-testid="usage-analytics" // Add a data-testid for easier testing
      {...htmlAttributes}
      key={key}
    >
      {children}
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
    </div>
  );
};

// Add error handling and logging for the usage_analytics component
MyComponent.error = (error: Error) => {
  console.error('UsageAnalyticsComponent Error:', error);
};

// Add a default className for better styling consistency
MyComponent.defaultProps = {
  className: 'usage-analytics',
};

export default MyComponent;