import React, { memo, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  // Ensure that the title and content are always defined, even if they are empty strings
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

MyComponent.displayName = 'MyComponent';

export default MyComponent;

import React, { memo, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  // Ensure that the title and content are always defined, even if they are empty strings
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

MyComponent.displayName = 'MyComponent';

export default MyComponent;