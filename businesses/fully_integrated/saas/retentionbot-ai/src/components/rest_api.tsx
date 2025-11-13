import React, { memo, useMemo, useState, useEffect } from 'react';

interface MyComponentProps {
  title: string;
  content: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  const [sanitizedContent, setSanitizedContent] = useState<React.ReactNode>('');

  // Memoize the sanitized content to improve performance
  const renderedContent = useMemo(() => {
    return <p className="my-component__content">{sanitizedContent}</p>;
  }, [sanitizedContent]);

  useEffect(() => {
    // Sanitize the content to prevent XSS attacks
    const sanitizedContent = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    setSanitizedContent(sanitizedContent);
  }, [content]);

  return (
    <div className="my-component" aria-label={title}>
      <h1 className="my-component__title" id="my-component-title">
        {title}
      </h1>
      {renderedContent}
    </div>
  );
});

export default MyComponent;

import React, { memo, useMemo, useState, useEffect } from 'react';

interface MyComponentProps {
  title: string;
  content: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  const [sanitizedContent, setSanitizedContent] = useState<React.ReactNode>('');

  // Memoize the sanitized content to improve performance
  const renderedContent = useMemo(() => {
    return <p className="my-component__content">{sanitizedContent}</p>;
  }, [sanitizedContent]);

  useEffect(() => {
    // Sanitize the content to prevent XSS attacks
    const sanitizedContent = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    setSanitizedContent(sanitizedContent);
  }, [content]);

  return (
    <div className="my-component" aria-label={title}>
      <h1 className="my-component__title" id="my-component-title">
        {title}
      </h1>
      {renderedContent}
    </div>
  );
});

export default MyComponent;