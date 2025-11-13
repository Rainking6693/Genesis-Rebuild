import React, { memo, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  // Ensure that the title and content are always defined, even if they are empty strings
  const safeTitle = useMemo(() => title ?? 'Untitled', [title]);
  const safeContent = useMemo(() => content ?? 'No content available', [content]);

  return (
    <div
      data-testid="my-component"
      aria-label="My Component"
      role="region"
      aria-live="polite"
    >
      <h1 data-testid="title" aria-label="Title">
        {safeTitle}
      </h1>
      <p data-testid="content" aria-label="Content">
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
  // Ensure that the title and content are always defined, even if they are empty strings
  const safeTitle = useMemo(() => title ?? 'Untitled', [title]);
  const safeContent = useMemo(() => content ?? 'No content available', [content]);

  return (
    <div
      data-testid="my-component"
      aria-label="My Component"
      role="region"
      aria-live="polite"
    >
      <h1 data-testid="title" aria-label="Title">
        {safeTitle}
      </h1>
      <p data-testid="content" aria-label="Content">
        {safeContent}
      </p>
    </div>
  );
});

export default MyComponent;