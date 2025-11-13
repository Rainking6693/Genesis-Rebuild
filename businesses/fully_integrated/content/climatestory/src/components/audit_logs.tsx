import React, { memo, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  // Ensure that the title and content are safe to use
  const safeTitle = useMemo(() => title?.trim() || 'Untitled', [title]);
  const safeContent = useMemo(() => content?.trim() || 'No content available', [content]);

  return (
    <div
      data-testid="my-component"
      aria-label={safeTitle}
      role="region"
      aria-live="polite"
      aria-atomic="true"
    >
      <h1 data-testid="title" aria-label={safeTitle}>
        {safeTitle}
      </h1>
      <p data-testid="content" aria-label={safeContent}>
        {safeContent}
      </p>
    </div>
  );
});

export default MyComponent;

import React, { memo, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  // Ensure that the title and content are safe to use
  const safeTitle = useMemo(() => title?.trim() || 'Untitled', [title]);
  const safeContent = useMemo(() => content?.trim() || 'No content available', [content]);

  return (
    <div
      data-testid="my-component"
      aria-label={safeTitle}
      role="region"
      aria-live="polite"
      aria-atomic="true"
    >
      <h1 data-testid="title" aria-label={safeTitle}>
        {safeTitle}
      </h1>
      <p data-testid="content" aria-label={safeContent}>
        {safeContent}
      </p>
    </div>
  );
});

export default MyComponent;