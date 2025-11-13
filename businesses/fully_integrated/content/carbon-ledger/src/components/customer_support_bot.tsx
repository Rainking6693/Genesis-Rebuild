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
    <div className="my-component" aria-label={safeTitle}>
      <h1 className="my-component__title" aria-label={safeTitle}>
        {safeTitle}
      </h1>
      <p className="my-component__content" aria-label={safeContent}>
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
    <div className="my-component" aria-label={safeTitle}>
      <h1 className="my-component__title" aria-label={safeTitle}>
        {safeTitle}
      </h1>
      <p className="my-component__content" aria-label={safeContent}>
        {safeContent}
      </p>
    </div>
  );
});

export default MyComponent;