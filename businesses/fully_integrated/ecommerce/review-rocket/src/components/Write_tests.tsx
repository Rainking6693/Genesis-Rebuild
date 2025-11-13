import React, { memo, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  // Ensure that the title and content are always strings, even if they are undefined or null
  const safeTitle = useMemo(() => typeof title === 'string' ? title : 'Default Title', [title]);
  const safeContent = useMemo(() => typeof content === 'string' ? content : 'Default Content', [content]);

  return (
    <div
      data-testid="my-component"
      aria-label="My Component"
      role="region"
      aria-live="polite"
      aria-atomic="true"
    >
      <h2
        data-testid="title"
        aria-label="Title"
        tabIndex={0}
        role="heading"
        aria-level={2}
      >
        {safeTitle}
      </h2>
      <p
        data-testid="content"
        aria-label="Content"
        tabIndex={0}
        role="region"
      >
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
  // Ensure that the title and content are always strings, even if they are undefined or null
  const safeTitle = useMemo(() => typeof title === 'string' ? title : 'Default Title', [title]);
  const safeContent = useMemo(() => typeof content === 'string' ? content : 'Default Content', [content]);

  return (
    <div
      data-testid="my-component"
      aria-label="My Component"
      role="region"
      aria-live="polite"
      aria-atomic="true"
    >
      <h2
        data-testid="title"
        aria-label="Title"
        tabIndex={0}
        role="heading"
        aria-level={2}
      >
        {safeTitle}
      </h2>
      <p
        data-testid="content"
        aria-label="Content"
        tabIndex={0}
        role="region"
      >
        {safeContent}
      </p>
    </div>
  );
});

export default MyComponent;