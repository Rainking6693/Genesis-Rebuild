import React, { memo, useMemo, ReactNode } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string | ReactNode;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  const safeTitle = useMemo(() => title || 'Untitled', [title]);
  const safeContent = useMemo(() => content || 'No content available', [content]);

  return (
    <div className="my-component">
      <h1 className="my-component__title" aria-label={safeTitle}>
        {safeTitle}
      </h1>
      <div className="my-component__content" aria-label={typeof safeContent === 'string' ? safeContent : ''}>
        {safeContent}
      </div>
    </div>
  );
});

MyComponent.displayName = 'MyComponent';

export default MyComponent;

import React, { memo, useMemo, ReactNode } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string | ReactNode;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  const safeTitle = useMemo(() => title || 'Untitled', [title]);
  const safeContent = useMemo(() => content || 'No content available', [content]);

  return (
    <div className="my-component">
      <h1 className="my-component__title" aria-label={safeTitle}>
        {safeTitle}
      </h1>
      <div className="my-component__content" aria-label={typeof safeContent === 'string' ? safeContent : ''}>
        {safeContent}
      </div>
    </div>
  );
});

MyComponent.displayName = 'MyComponent';

export default MyComponent;