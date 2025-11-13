import React, { memo, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  const safeTitle = useMemo(() => title?.trim() || 'Default Title', [title]);
  const safeContent = useMemo(() => content?.trim() || 'Default Content', [content]);

  return (
    <div data-testid="my-component" aria-label="My Component" role="region">
      <h1 data-testid="title" aria-label="Title" aria-live="polite">
        {safeTitle}
      </h1>
      <p data-testid="content" aria-label="Content" aria-live="polite">
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
  const safeTitle = useMemo(() => title?.trim() || 'Default Title', [title]);
  const safeContent = useMemo(() => content?.trim() || 'Default Content', [content]);

  return (
    <div data-testid="my-component" aria-label="My Component" role="region">
      <h1 data-testid="title" aria-label="Title" aria-live="polite">
        {safeTitle}
      </h1>
      <p data-testid="content" aria-label="Content" aria-live="polite">
        {safeContent}
      </p>
    </div>
  );
});

export default MyComponent;