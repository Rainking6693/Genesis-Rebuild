import React, { memo, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  const safeTitle = useMemo(() => title || 'Untitled', [title]);
  const safeContent = useMemo(() => content || 'No content available', [content]);

  return (
    <div
      data-testid="my-component"
      aria-label={safeTitle}
      role="region"
      aria-live="polite"
    >
      <h1 data-testid="title" id="my-component-title">
        {safeTitle}
      </h1>
      <p data-testid="content" aria-describedby="my-component-title">
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
  const safeTitle = useMemo(() => title || 'Untitled', [title]);
  const safeContent = useMemo(() => content || 'No content available', [content]);

  return (
    <div
      data-testid="my-component"
      aria-label={safeTitle}
      role="region"
      aria-live="polite"
    >
      <h1 data-testid="title" id="my-component-title">
        {safeTitle}
      </h1>
      <p data-testid="content" aria-describedby="my-component-title">
        {safeContent}
      </p>
    </div>
  );
});

MyComponent.displayName = 'MyComponent';

export default MyComponent;