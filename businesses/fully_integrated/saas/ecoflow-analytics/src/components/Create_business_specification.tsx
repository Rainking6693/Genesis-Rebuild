import React, { memo, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  const safeTitle = useMemo(() => title || 'Default Title', [title]);
  const safeContent = useMemo(() => content || 'Default Content', [content]);

  return (
    <div role="region" aria-label={safeTitle}>
      <h1 className="my-component__title">{safeTitle}</h1>
      <p className="my-component__content">{safeContent}</p>
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
    <div role="region" aria-label={safeTitle}>
      <h1 className="my-component__title">{safeTitle}</h1>
      <p className="my-component__content">{safeContent}</p>
    </div>
  );
});

MyComponent.displayName = 'MyComponent';

export default MyComponent;