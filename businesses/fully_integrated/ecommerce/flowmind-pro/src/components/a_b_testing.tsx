import React, { memo, useMemo, useCallback } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  const safeTitle = useMemo(() => title || 'Default Title', [title]);
  const safeContent = useMemo(() => content || 'Default Content', [content]);

  const handleTitleChange = useCallback((event: React.ChangeEvent<HTMLHeadingElement>) => {
    // Handle title change event here
  }, []);

  const handleContentChange = useCallback((event: React.ChangeEvent<HTMLParagraphElement>) => {
    // Handle content change event here
  }, []);

  return (
    <div className="my-component" aria-label={safeTitle}>
      <h1
        className="my-component__title"
        id="my-component-title"
        onBlur={handleTitleChange}
        tabIndex={0}
        aria-describedby="my-component-title-description"
      >
        {safeTitle}
      </h1>
      <p
        className="my-component__content"
        aria-describedby="my-component-title my-component-content-description"
        onBlur={handleContentChange}
        tabIndex={0}
      >
        {safeContent}
      </p>
      <div id="my-component-title-description" className="visually-hidden">
        The title of the component.
      </div>
      <div id="my-component-content-description" className="visually-hidden">
        The content of the component.
      </div>
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
    // Handle title change event here
  }, []);

  const handleContentChange = useCallback((event: React.ChangeEvent<HTMLParagraphElement>) => {
    // Handle content change event here
  }, []);

  return (
    <div className="my-component" aria-label={safeTitle}>
      <h1
        className="my-component__title"
        id="my-component-title"
        onBlur={handleTitleChange}
        tabIndex={0}
        aria-describedby="my-component-title-description"
      >
        {safeTitle}
      </h1>
      <p
        className="my-component__content"
        aria-describedby="my-component-title my-component-content-description"
        onBlur={handleContentChange}
        tabIndex={0}
      >
        {safeContent}
      </p>
      <div id="my-component-title-description" className="visually-hidden">
        The title of the component.
      </div>
      <div id="my-component-content-description" className="visually-hidden">
        The content of the component.
      </div>
    </div>
  );
});

export default MyComponent;