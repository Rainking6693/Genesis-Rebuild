import React, { memo, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  const safeTitle = useMemo(() => title || 'Default Title', [title]);
  const safeContent = useMemo(() => content || 'Default Content', [content]);

  return (
    <div
      data-testid="my-component"
      aria-label="My Component"
      role="region"
      tabIndex={0}
    >
      <h1
        data-testid="title"
        aria-label="Title"
        role="heading"
        aria-level={1}
        tabIndex={0}
      >
        {safeTitle}
      </h1>
      <p
        data-testid="content"
        aria-label="Content"
        role="region"
        tabIndex={0}
      >
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
  const safeTitle = useMemo(() => title || 'Default Title', [title]);
  const safeContent = useMemo(() => content || 'Default Content', [content]);

  return (
    <div
      data-testid="my-component"
      aria-label="My Component"
      role="region"
      tabIndex={0}
    >
      <h1
        data-testid="title"
        aria-label="Title"
        role="heading"
        aria-level={1}
        tabIndex={0}
      >
        {safeTitle}
      </h1>
      <p
        data-testid="content"
        aria-label="Content"
        role="region"
        tabIndex={0}
      >
        {safeContent}
      </p>
    </div>
  );
});

MyComponent.displayName = 'MyComponent';

export default MyComponent;