import React, { memo, useMemo, ReactNode } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string | ReactNode;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  const safeTitle = useMemo(() => title || 'Untitled', [title]);
  const safeContent = useMemo(() => content || 'No content available', [content]);

  return (
    <div className="my-component" aria-label={safeTitle}>
      <h1 className="my-component__title" id="my-component-title">
        {safeTitle}
      </h1>
      <div className="my-component__content" aria-describedby="my-component-title">
        {typeof safeContent === 'string' ? (
          <p>{safeContent}</p>
        ) : (
          safeContent
        )}
      </div>
    </div>
  );
});

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
    <div className="my-component" aria-label={safeTitle}>
      <h1 className="my-component__title" id="my-component-title">
        {safeTitle}
      </h1>
      <div className="my-component__content" aria-describedby="my-component-title">
        {typeof safeContent === 'string' ? (
          <p>{safeContent}</p>
        ) : (
          safeContent
        )}
      </div>
    </div>
  );
});

export default MyComponent;