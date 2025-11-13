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
      aria-label="My Component"
      role="region"
      className="my-component"
    >
      <h1 data-testid="title" aria-label="Title" className="my-component__title">
        {safeTitle}
      </h1>
      <p data-testid="content" aria-label="Content" className="my-component__content">
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
  const safeTitle = useMemo(() => title?.trim() || 'Untitled', [title]);
  const safeContent = useMemo(() => content?.trim() || 'No content available', [content]);

  return (
    <div
      data-testid="my-component"
      aria-label="My Component"
      role="region"
      className="my-component"
    >
      <h1 data-testid="title" aria-label="Title" className="my-component__title">
        {safeTitle}
      </h1>
      <p data-testid="content" aria-label="Content" className="my-component__content">
        {safeContent}
      </p>
    </div>
  );
});

export default MyComponent;