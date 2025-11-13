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
      className="my-component"
      aria-label="My Component"
      role="region"
      data-testid="my-component"
    >
      <h1
        className="my-component__title"
        aria-label="Component Title"
        data-testid="my-component-title"
      >
        {safeTitle}
      </h1>
      <p
        className="my-component__content"
        aria-label="Component Content"
        data-testid="my-component-content"
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
  // Ensure that the title and content are always defined
  const safeTitle = useMemo(() => title || 'Default Title', [title]);
  const safeContent = useMemo(() => content || 'Default Content', [content]);

  return (
    <div
      className="my-component"
      aria-label="My Component"
      role="region"
      data-testid="my-component"
    >
      <h1
        className="my-component__title"
        aria-label="Component Title"
        data-testid="my-component-title"
      >
        {safeTitle}
      </h1>
      <p
        className="my-component__content"
        aria-label="Component Content"
        data-testid="my-component-content"
      >
        {safeContent}
      </p>
    </div>
  );
});

MyComponent.displayName = 'MyComponent';

export default MyComponent;