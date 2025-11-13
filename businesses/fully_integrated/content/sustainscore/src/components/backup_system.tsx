import React, { memo, useMemo, useCallback } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  const safeTitle = useMemo(() => title || 'Untitled', [title]);
  const safeContent = useMemo(() => content || 'No content available', [content]);

  const handleTitleChange = useCallback((event: React.ChangeEvent<HTMLHeadingElement>) => {
    // Handle title change event, e.g., update the component's state or trigger a callback
  }, []);

  const handleContentChange = useCallback((event: React.ChangeEvent<HTMLParagraphElement>) => {
    // Handle content change event, e.g., update the component's state or trigger a callback
  }, []);

  return (
    <div className="my-component" aria-label={safeTitle}>
      <h1
        className="my-component__title"
        id="my-component-title"
        contentEditable
        onBlur={handleTitleChange}
        suppressContentEditableWarning
      >
        {safeTitle}
      </h1>
      <p
        className="my-component__content"
        aria-describedby="my-component-title"
        contentEditable
        onBlur={handleContentChange}
        suppressContentEditableWarning
      >
        {safeContent}
      </p>
    </div>
  );
});

export default MyComponent;

import React, { memo, useMemo, useCallback } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  const safeTitle = useMemo(() => title || 'Untitled', [title]);
  const safeContent = useMemo(() => content || 'No content available', [content]);

  const handleTitleChange = useCallback((event: React.ChangeEvent<HTMLHeadingElement>) => {
    // Handle title change event, e.g., update the component's state or trigger a callback
  }, []);

  const handleContentChange = useCallback((event: React.ChangeEvent<HTMLParagraphElement>) => {
    // Handle content change event, e.g., update the component's state or trigger a callback
  }, []);

  return (
    <div className="my-component" aria-label={safeTitle}>
      <h1
        className="my-component__title"
        id="my-component-title"
        contentEditable
        onBlur={handleTitleChange}
        suppressContentEditableWarning
      >
        {safeTitle}
      </h1>
      <p
        className="my-component__content"
        aria-describedby="my-component-title"
        contentEditable
        onBlur={handleContentChange}
        suppressContentEditableWarning
      >
        {safeContent}
      </p>
    </div>
  );
});

export default MyComponent;