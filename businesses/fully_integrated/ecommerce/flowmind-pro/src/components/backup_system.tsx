import React, { memo, useMemo, useCallback } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  const safeTitle = useMemo(() => title || 'Untitled', [title]);
  const safeContent = useMemo(() => content || 'No content available', [content]);

  const handleTitleClick = useCallback(() => {
    // Add accessibility-friendly behavior, e.g., focus on the title or show a tooltip
    console.log(`Clicked on the title: ${safeTitle}`);
  }, [safeTitle]);

  const handleContentClick = useCallback(() => {
    // Add accessibility-friendly behavior, e.g., focus on the content or show a tooltip
    console.log(`Clicked on the content: ${safeContent}`);
  }, [safeContent]);

  return (
    <div
      className="my-component"
      aria-label={safeTitle}
      role="region"
      tabIndex={0}
      onKeyDown={(e) => {
        // Handle keyboard accessibility, e.g., focus management, enter/space key handling
        if (e.key === 'Enter' || e.key === ' ') {
          e.currentTarget.click();
        }
      }}
    >
      <h2
        className="my-component__title"
        title={safeTitle}
        onClick={handleTitleClick}
        onKeyDown={handleTitleClick}
      >
        {safeTitle}
      </h2>
      <p
        className="my-component__content"
        title={safeContent}
        onClick={handleContentClick}
        onKeyDown={handleContentClick}
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
    // Add accessibility-friendly behavior, e.g., focus on the title or show a tooltip
    console.log(`Clicked on the title: ${safeTitle}`);
  }, [safeTitle]);

  const handleContentClick = useCallback(() => {
    // Add accessibility-friendly behavior, e.g., focus on the content or show a tooltip
    console.log(`Clicked on the content: ${safeContent}`);
  }, [safeContent]);

  return (
    <div
      className="my-component"
      aria-label={safeTitle}
      role="region"
      tabIndex={0}
      onKeyDown={(e) => {
        // Handle keyboard accessibility, e.g., focus management, enter/space key handling
        if (e.key === 'Enter' || e.key === ' ') {
          e.currentTarget.click();
        }
      }}
    >
      <h2
        className="my-component__title"
        title={safeTitle}
        onClick={handleTitleClick}
        onKeyDown={handleTitleClick}
      >
        {safeTitle}
      </h2>
      <p
        className="my-component__content"
        title={safeContent}
        onClick={handleContentClick}
        onKeyDown={handleContentClick}
      >
        {safeContent}
      </p>
    </div>
  );
});

export default MyComponent;