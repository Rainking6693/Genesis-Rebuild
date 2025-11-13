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
        return '&#039;';
      case '"':
        return '&quot;';
      default:
        return char;
    }
  });
};

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  const sanitizedTitle = useMemo(() => sanitizeString(title), [title]);
  const sanitizedContent = useMemo(() => sanitizeString(content), [content]);

  return (
    <div className="my-component" aria-label={sanitizedTitle}>
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
        return '&#039;';
      case '"':
        return '&quot;';
      default:
        return char;
    }
  });
};

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  const sanitizedTitle = useMemo(() => sanitizeString(title), [title]);
  const sanitizedContent = useMemo(() => sanitizeString(content), [content]);

  return (
    <div className="my-component" aria-label={sanitizedTitle}>
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