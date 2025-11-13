import React, { memo, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  // Ensure that the title and content are safe to render
  const safeTitle = useMemo(() => title || 'Default Title', [title]);
  const safeContent = useMemo(() => content || 'Default Content', [content]);

  return (
    <div
      data-testid="my-component"
      aria-label="My Component"
      className="my-component"
    >
      <h1
        data-testid="title"
        aria-label="Title"
        className="my-component__title"
      >
        {safeTitle}
      </h1>
      <p
        data-testid="content"
        aria-label="Content"
        className="my-component__content"
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
  // Ensure that the title and content are safe to render
  const safeTitle = useMemo(() => title || 'Default Title', [title]);
  const safeContent = useMemo(() => content || 'Default Content', [content]);

  return (
    <div
      data-testid="my-component"
      aria-label="My Component"
      className="my-component"
    >
      <h1
        data-testid="title"
        aria-label="Title"
        className="my-component__title"
      >
        {safeTitle}
      </h1>
      <p
        data-testid="content"
        aria-label="Content"
        className="my-component__content"
      >
        {safeContent}
      </p>
    </div>
  );
});

MyComponent.displayName = 'MyComponent';

export default MyComponent;