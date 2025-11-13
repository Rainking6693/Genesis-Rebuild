import React, { memo, useMemo } from 'react';

interface MyComponentProps {
  title: string;
  content: string;
}

const sanitizeText = (text: string): string => {
  // Sanitize the input to prevent XSS attacks
  return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  const sanitizedTitle = useMemo(() => sanitizeText(title), [title]);
  const sanitizedContent = useMemo(() => sanitizeText(content), [content]);

  return (
    <div className="my-component" aria-label={sanitizedTitle}>
      <h1 className="my-component__title" title={sanitizedTitle}>
        {sanitizedTitle}
      </h1>
      <p className="my-component__content" title={sanitizedContent}>
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

const sanitizeText = (text: string): string => {
  // Sanitize the input to prevent XSS attacks
  return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  const sanitizedTitle = useMemo(() => sanitizeText(title), [title]);
  const sanitizedContent = useMemo(() => sanitizeText(content), [content]);

  return (
    <div className="my-component" aria-label={sanitizedTitle}>
      <h1 className="my-component__title" title={sanitizedTitle}>
        {sanitizedTitle}
      </h1>
      <p className="my-component__content" title={sanitizedContent}>
        {sanitizedContent}
      </p>
    </div>
  );
});

export default MyComponent;