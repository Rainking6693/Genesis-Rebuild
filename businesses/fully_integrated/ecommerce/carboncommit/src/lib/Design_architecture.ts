import React, { FC, DefaultHTMLProps, PropsWithChildren } from 'react';
import { sanitizeHtml as defaultSanitizeHtml } from 'dompurify';

interface Props extends DefaultHTMLProps<HTMLDivElement> {
  message: string;
}

// Added a custom sanitizeHtml function to handle edge cases and provide more control
const sanitizeHtml = (message: string, allowedAttributes?: string[]): string => {
  const config = {
    USE_PROFILES: { html: true },
    ALLOWED_ATTRS: allowedAttributes || ['class'],
  };

  // Use DOMPurify's sanitizeHtml function with custom configuration
  return defaultSanitizeHtml(message, config);
};

const MyComponent: FC<Props & PropsWithChildren> = ({ message, children, ...rest }) => {
  // Sanitize the input message and children to prevent XSS attacks
  const sanitizedMessage = sanitizeHtml(message);
  const sanitizedChildren = sanitizeHtml(children as string, ['class']);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      {...rest}
      aria-label="Ecommerce message" // Moved default props to component level for better organization
    >
      {sanitizedChildren}
    </div>
  );
};

// Use named export for better modularity and easier testing
export { MyComponent, sanitizeHtml };

In this updated code, I've added a custom `sanitizeHtml` function that allows you to specify allowed attributes. This can help handle edge cases where you might want to allow certain attributes that are not included in the default allowed list.

I've also updated the `MyComponent` to accept children and sanitize them as well. This allows for more flexibility in the component's usage.

Lastly, I've moved the default props to the component level for better organization and readability.