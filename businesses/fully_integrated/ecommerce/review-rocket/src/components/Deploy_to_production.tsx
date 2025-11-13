import React, { memo, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  // Ensure that the title and content are always defined
  const safeTitle = useMemo(() => title || 'Untitled', [title]);
  const safeContent = useMemo(() => content || 'No content available', [content]);

  return (
    <div
      data-testid="my-component"
      aria-label={safeTitle}
      role="region"
      aria-live="polite"
    >
      <h2 data-testid="title" aria-label={safeTitle}>
        {safeTitle}
      </h2>
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
  // Ensure that the title and content are always defined
  const safeTitle = useMemo(() => title || 'Untitled', [title]);
  const safeContent = useMemo(() => content || 'No content available', [content]);

  return (
    <div
      data-testid="my-component"
      aria-label={safeTitle}
      role="region"
      aria-live="polite"
    >
      <h2 data-testid="title" aria-label={safeTitle}>
        {safeTitle}
      </h2>
      <p data-testid="content" aria-label={safeContent}>
        {safeContent}
      </p>
    </div>
  );
});

export default MyComponent;