import React, { memo, useMemo, useCallback } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  const safeTitle = useMemo(() => title || 'Default Title', [title]);
  const safeContent = useMemo(() => content || 'Default Content', [content]);

  const handleTitleChange = useCallback((event: React.ChangeEvent<HTMLHeadingElement>) => {
    // Handle title change event, e.g., update state or call a callback function
    console.log('Title changed:', event.target.value);
  }, []);

  const handleContentChange = useCallback((event: React.ChangeEvent<HTMLParagraphElement>) => {
    // Handle content change event, e.g., update state or call a callback function
    console.log('Content changed:', event.target.value);
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
  const safeTitle = useMemo(() => title || 'Default Title', [title]);
  const safeContent = useMemo(() => content || 'Default Content', [content]);

  const handleTitleChange = useCallback((event: React.ChangeEvent<HTMLHeadingElement>) => {
    // Handle title change event, e.g., update state or call a callback function
    console.log('Title changed:', event.target.value);
  }, []);

  const handleContentChange = useCallback((event: React.ChangeEvent<HTMLParagraphElement>) => {
    // Handle content change event, e.g., update state or call a callback function
    console.log('Content changed:', event.target.value);
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