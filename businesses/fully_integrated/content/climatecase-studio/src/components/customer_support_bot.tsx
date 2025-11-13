import React, { memo, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  const safeTitle = useMemo(() => title || 'Untitled', [title]);
  const safeContent = useMemo(() => content || 'No content available', [content]);

  return (
    <div className="my-component" aria-label={safeTitle}>
      <h1 className="my-component__title" id="my-component-title">
        {safeTitle}
      </h1>
      <p
        className="my-component__content"
        aria-describedby="my-component-title"
        tabIndex={0}
        role="region"
        aria-live="polite"
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
    <div className="my-component" aria-label={safeTitle}>
      <h1 className="my-component__title" id="my-component-title">
        {safeTitle}
      </h1>
      <p
        className="my-component__content"
        aria-describedby="my-component-title"
        tabIndex={0}
        role="region"
        aria-live="polite"
      >
        {safeContent}
      </p>
    </div>
  );
});

export default MyComponent;