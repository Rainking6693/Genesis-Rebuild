import React, { memo, useMemo, useCallback } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  const safeTitle = useMemo(() => title || 'Untitled', [title]);
  const safeContent = useMemo(() => content || 'No content available', [content]);

  const handleTitleClick = useCallback(() => {
    console.log(`Clicked on the title: ${safeTitle}`);
  }, [safeTitle]);

  return (
    <div className="my-component" aria-label={safeTitle}>
      <h1
        className="my-component__title"
        id="my-component-title"
        onClick={handleTitleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleTitleClick();
          }
        }}
        role="button"
        tabIndex={0}
      >
        {safeTitle}
      </h1>
      <p
        className="my-component__content"
        aria-describedby="my-component-title"
        data-testid="my-component-content"
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

  const handleTitleClick = useCallback(() => {
    console.log(`Clicked on the title: ${safeTitle}`);
  }, [safeTitle]);

  return (
    <div className="my-component" aria-label={safeTitle}>
      <h1
        className="my-component__title"
        id="my-component-title"
        onClick={handleTitleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleTitleClick();
          }
        }}
        role="button"
        tabIndex={0}
      >
        {safeTitle}
      </h1>
      <p
        className="my-component__content"
        aria-describedby="my-component-title"
        data-testid="my-component-content"
      >
        {safeContent}
      </p>
    </div>
  );
});

export default MyComponent;