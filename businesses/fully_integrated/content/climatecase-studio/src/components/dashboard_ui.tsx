import React, { memo, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  const safeTitle = useMemo(() => title?.trim() || 'Untitled', [title]);
  const safeContent = useMemo(() => content?.trim() || 'No content available', [content]);

  return (
    <div className="my-component" aria-label={safeTitle}>
      <h2 className="my-component__title" title={safeTitle}>
        {safeTitle}
      </h2>
      <p className="my-component__content" title={safeContent}>
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
    <div className="my-component" aria-label={safeTitle}>
      <h2 className="my-component__title" title={safeTitle}>
        {safeTitle}
      </h2>
      <p className="my-component__content" title={safeContent}>
        {safeContent}
      </p>
    </div>
  );
});

export default MyComponent;