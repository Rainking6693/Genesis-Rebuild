import React, { memo, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  const safeTitle = useMemo(() => title ?? 'Default Title', [title]);
  const safeContent = useMemo(() => content ?? 'Default Content', [content]);

  return (
    <div className="my-component" aria-label="My Component">
      <h1 className="my-component__title" aria-label="Title">
        {safeTitle}
      </h1>
      <p className="my-component__content" aria-label="Content">
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
  const safeTitle = useMemo(() => title ?? 'Default Title', [title]);
  const safeContent = useMemo(() => content ?? 'Default Content', [content]);

  return (
    <div className="my-component" aria-label="My Component">
      <h1 className="my-component__title" aria-label="Title">
        {safeTitle}
      </h1>
      <p className="my-component__content" aria-label="Content">
        {safeContent}
      </p>
    </div>
  );
});

export default MyComponent;