import React, { memo, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  // Ensure that the title and content are always defined
  const safeTitle = useMemo(() => title || 'Default Title', [title]);
  const safeContent = useMemo(() => content || 'Default Content', [content]);

  // Ensure that the component is accessible
  return (
    <div className="my-component" aria-label="My Component">
      <h1 className="my-component__title" aria-label="Component Title">
        {safeTitle}
      </h1>
      <p className="my-component__content" aria-label="Component Content">
        {safeContent}
      </p>
    </div>
  );
});

// Memoize the component to improve performance
export default React.memo(MyComponent);

import React, { memo, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  // Ensure that the title and content are always defined
  const safeTitle = useMemo(() => title || 'Default Title', [title]);
  const safeContent = useMemo(() => content || 'Default Content', [content]);

  // Ensure that the component is accessible
  return (
    <div className="my-component" aria-label="My Component">
      <h1 className="my-component__title" aria-label="Component Title">
        {safeTitle}
      </h1>
      <p className="my-component__content" aria-label="Component Content">
        {safeContent}
      </p>
    </div>
  );
});

// Memoize the component to improve performance
export default React.memo(MyComponent);