import React, { memo, useMemo } from 'react';

interface MyComponentProps {
  title: string;
  content: string;
}

const sanitizeString = (str: string): string => {
  return str.replace(/[<>&'"]/g, (char) => {
    switch (char) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&#39;';
      case '"':
        return '&quot;';
      default:
        return char;
    }
  });
};

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  const sanitizedTitle = useMemo(() => {
    // Sanitize the title to prevent XSS attacks
    return sanitizeString(title);
  }, [title]);

  const sanitizedContent = useMemo(() => {
    // Sanitize the content to prevent XSS attacks
    return sanitizeString(content);
  }, [content]);

  return (
    <div className="my-component">
      <h1 className="my-component__title" aria-label={sanitizedTitle}>
        {sanitizedTitle}
      </h1>
      <p className="my-component__content" aria-label={sanitizedContent}>
        {sanitizedContent}
      </p>
    </div>
  );
});

export default MyComponent;

import React, { memo, useMemo } from 'react';

interface MyComponentProps {
  title: string;
  content: string;
}

const sanitizeString = (str: string): string => {
  return str.replace(/[<>&'"]/g, (char) => {
    switch (char) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&#39;';
      case '"':
        return '&quot;';
      default:
        return char;
    }
  });
};

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  const sanitizedTitle = useMemo(() => {
    // Sanitize the title to prevent XSS attacks
    return sanitizeString(title);
  }, [title]);

  const sanitizedContent = useMemo(() => {
    // Sanitize the content to prevent XSS attacks
    return sanitizeString(content);
  }, [content]);

  return (
    <div className="my-component">
      <h1 className="my-component__title" aria-label={sanitizedTitle}>
        {sanitizedTitle}
      </h1>
      <p className="my-component__content" aria-label={sanitizedContent}>
        {sanitizedContent}
      </p>
    </div>
  );
});

export default MyComponent;