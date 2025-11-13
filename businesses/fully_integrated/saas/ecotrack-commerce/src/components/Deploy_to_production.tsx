import React, { memo, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  // Ensure that the title and content are always defined
  const safeTitle = useMemo(() => title || 'Default Title', [title]);
  const safeContent = useMemo(() => content || 'Default Content', [content]);

  return (
    <div
      data-testid="my-component"
      aria-label="My Component"
      role="region"
      aria-live="polite"
    >
      <h1
        data-testid="title"
        aria-label="Title"
        tabIndex={0}
        aria-describedby="title-description"
      >
        {safeTitle}
      </h1>
      <p id="title-description" className="sr-only">
      </p>
      <p
        data-testid="content"
        aria-label="Content"
        tabIndex={0}
        aria-describedby="content-description"
      >
        {safeContent}
      </p>
      <p id="content-description" className="sr-only">
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
  // Ensure that the title and content are always defined
  const safeTitle = useMemo(() => title || 'Default Title', [title]);
  const safeContent = useMemo(() => content || 'Default Content', [content]);

  return (
    <div
      data-testid="my-component"
      aria-label="My Component"
      role="region"
      aria-live="polite"
    >
      <h1
        data-testid="title"
        aria-label="Title"
        tabIndex={0}
        aria-describedby="title-description"
      >
        {safeTitle}
      </h1>
      <p id="title-description" className="sr-only">
      </p>
      <p
        data-testid="content"
        aria-label="Content"
        tabIndex={0}
        aria-describedby="content-description"
      >
        {safeContent}
      </p>
      <p id="content-description" className="sr-only">
      </p>
    </div>
  );
});

MyComponent.displayName = 'MyComponent';

export default MyComponent;