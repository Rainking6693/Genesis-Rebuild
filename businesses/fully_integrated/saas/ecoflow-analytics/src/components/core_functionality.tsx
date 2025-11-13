import React, { memo, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  const safeTitle = useMemo(() => title ?? 'Default Title', [title]);
  const safeContent = useMemo(() => content ?? 'Default Content', [content]);

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
  const safeTitle = useMemo(() => title ?? 'Default Title', [title]);
  const safeContent = useMemo(() => content ?? 'Default Content', [content]);

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