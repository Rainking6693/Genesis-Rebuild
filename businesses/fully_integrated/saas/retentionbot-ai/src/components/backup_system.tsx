import React, { memo, useMemo, useCallback } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  const safeTitle = useMemo(() => title || 'Untitled', [title]);
  const safeContent = useMemo(() => content || 'No content available', [content]);

  const handleTitleClick = useCallback(() => {
    // Add any desired functionality for title click, e.g., open a modal
    console.log('Title clicked:', safeTitle);
  }, [safeTitle]);

  const handleContentClick = useCallback(() => {
    // Add any desired functionality for content click, e.g., copy to clipboard
    console.log('Content clicked:', safeContent);
  }, [safeContent]);

  return (
    <div
      className="my-component"
      aria-label={safeTitle}
      role="region"
      tabIndex={0}
      onKeyDown={(e) => {
        // Handle keyboard accessibility, e.g., trigger title/content click on Enter/Space
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleTitleClick();
        }
      }}
    >
      <h2
        className="my-component__title"
        title={safeTitle}
        onClick={handleTitleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleTitleClick();
          }
        }}
      >
        {safeTitle}
      </h2>
      <p
        className="my-component__content"
        title={safeContent}
        onClick={handleContentClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleContentClick();
          }
        }}
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
    // Add any desired functionality for title click, e.g., open a modal
    console.log('Title clicked:', safeTitle);
  }, [safeTitle]);

  const handleContentClick = useCallback(() => {
    // Add any desired functionality for content click, e.g., copy to clipboard
    console.log('Content clicked:', safeContent);
  }, [safeContent]);

  return (
    <div
      className="my-component"
      aria-label={safeTitle}
      role="region"
      tabIndex={0}
      onKeyDown={(e) => {
        // Handle keyboard accessibility, e.g., trigger title/content click on Enter/Space
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleTitleClick();
        }
      }}
    >
      <h2
        className="my-component__title"
        title={safeTitle}
        onClick={handleTitleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleTitleClick();
          }
        }}
      >
        {safeTitle}
      </h2>
      <p
        className="my-component__content"
        title={safeContent}
        onClick={handleContentClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleContentClick();
          }
        }}
      >
        {safeContent}
      </p>
    </div>
  );
});

export default MyComponent;