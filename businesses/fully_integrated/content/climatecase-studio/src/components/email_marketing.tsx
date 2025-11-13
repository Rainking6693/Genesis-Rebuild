import React, { memo, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  const safeTitle = useMemo(() => title?.trim() || 'Untitled', [title]);
  const safeContent = useMemo(() => content?.trim() || 'No content available', [content]);

  return (
    <div
      data-testid="my-component"
      aria-label="Email Marketing Component"
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

MyComponent.displayName = 'MyComponent';

export default MyComponent;

import React, { memo, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  const safeTitle = useMemo(() => title?.trim() || 'Untitled', [title]);
  const safeContent = useMemo(() => content?.trim() || 'No content available', [content]);

  return (
    <div
      data-testid="my-component"
      aria-label="Email Marketing Component"
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

MyComponent.displayName = 'MyComponent';

export default MyComponent;