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
      className="my-component"
      aria-label={safeTitle}
      data-testid="my-component"
    >
      <h2
        className="my-component__title"
        title={safeTitle}
        data-testid="my-component-title"
      >
        {safeTitle}
      </h2>
      <p
        className="my-component__content"
        title={safeContent}
        data-testid="my-component-content"
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
  const safeTitle = useMemo(() => title || 'Untitled', [title]);
  const safeContent = useMemo(() => content || 'No content available', [content]);

  return (
    <div
      className="my-component"
      aria-label={safeTitle}
      data-testid="my-component"
    >
      <h2
        className="my-component__title"
        title={safeTitle}
        data-testid="my-component-title"
      >
        {safeTitle}
      </h2>
      <p
        className="my-component__content"
        title={safeContent}
        data-testid="my-component-content"
      >
        {safeContent}
      </p>
    </div>
  );
});

export default MyComponent;