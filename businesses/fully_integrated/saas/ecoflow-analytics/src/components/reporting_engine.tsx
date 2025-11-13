import React, { memo, useMemo, useCallback } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  const safeTitle = useMemo(() => title || 'Default Title', [title]);
  const safeContent = useMemo(() => content || 'Default Content', [content]);

  const handleTitleClick = useCallback(() => {
    console.log('Title clicked:', safeTitle);
  }, [safeTitle]);

  const handleContentClick = useCallback(() => {
    console.log('Content clicked:', safeContent);
  }, [safeContent]);

  return (
    <div
      className="my-component"
      aria-label="My Component"
      data-testid="my-component"
    >
      <h1
        className="my-component__title"
        aria-label="Title"
        onClick={handleTitleClick}
        data-testid="my-component-title"
      >
        {safeTitle}
      </h1>
      <p
        className="my-component__content"
        aria-label="Content"
        onClick={handleContentClick}
        data-testid="my-component-content"
      >
        {safeContent}
      </p>
    </div>
  );
});

MyComponent.displayName = 'MyComponent';

export default MyComponent;

import React, { memo, useMemo, useCallback } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  const safeTitle = useMemo(() => title || 'Default Title', [title]);
  const safeContent = useMemo(() => content || 'Default Content', [content]);

  const handleTitleClick = useCallback(() => {
    console.log('Title clicked:', safeTitle);
  }, [safeTitle]);

  const handleContentClick = useCallback(() => {
    console.log('Content clicked:', safeContent);
  }, [safeContent]);

  return (
    <div
      className="my-component"
      aria-label="My Component"
      data-testid="my-component"
    >
      <h1
        className="my-component__title"
        aria-label="Title"
        onClick={handleTitleClick}
        data-testid="my-component-title"
      >
        {safeTitle}
      </h1>
      <p
        className="my-component__content"
        aria-label="Content"
        onClick={handleContentClick}
        data-testid="my-component-content"
      >
        {safeContent}
      </p>
    </div>
  );
});

MyComponent.displayName = 'MyComponent';

export default MyComponent;