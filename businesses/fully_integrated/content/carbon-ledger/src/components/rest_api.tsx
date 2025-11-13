import React, { memo, useMemo, useState, useEffect } from 'react';

interface MyComponentProps {
  title: string;
  content: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  const [sanitizedContent, setSanitizedContent] = useState<React.ReactNode>(null);

  useEffect(() => {
    // Sanitize the content to prevent XSS attacks
    const sanitizedContent = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    setSanitizedContent(<p className="my-component__content">{sanitizedContent}</p>);
  }, [content]);

  // Memoize the rendered content to improve performance
  const renderedContent = useMemo(() => sanitizedContent, [sanitizedContent]);

  return (
    <div className="my-component" aria-label={title}>
      <h1 className="my-component__title" aria-level={1}>
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
  const [sanitizedContent, setSanitizedContent] = useState<React.ReactNode>(null);

  useEffect(() => {
    // Sanitize the content to prevent XSS attacks
    const sanitizedContent = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    setSanitizedContent(<p className="my-component__content">{sanitizedContent}</p>);
  }, [content]);

  // Memoize the rendered content to improve performance
  const renderedContent = useMemo(() => sanitizedContent, [sanitizedContent]);

  return (
    <div className="my-component" aria-label={title}>
      <h1 className="my-component__title" aria-level={1}>
        {title}
      </h1>
      {renderedContent}
    </div>
  );
});

export default MyComponent;