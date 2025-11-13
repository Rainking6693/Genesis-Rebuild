import React, { memo, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  // Ensure that the title and content are always defined
  const safeTitle = useMemo(() => title || 'Default Title', [title]);
  const safeContent = useMemo(() => content || 'Default Content', [content]);

  return (
    <div className="my-component" aria-label="My Component">
      {/* Provide a meaningful title for accessibility */}
      <h1 className="my-component__title" aria-label="My Component Title">
        {safeTitle}
      </h1>
      {/* Provide a meaningful content description for accessibility */}
      <p className="my-component__content" aria-label="My Component Content">
        {safeContent}
      </p>
    </div>
  );
});

// Ensure that the component has a meaningful display name for debugging and maintainability
MyComponent.displayName = 'MyComponent';

export default MyComponent;

import React, { memo, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  // Ensure that the title and content are always defined
  const safeTitle = useMemo(() => title || 'Default Title', [title]);
  const safeContent = useMemo(() => content || 'Default Content', [content]);

  return (
    <div className="my-component" aria-label="My Component">
      {/* Provide a meaningful title for accessibility */}
      <h1 className="my-component__title" aria-label="My Component Title">
        {safeTitle}
      </h1>
      {/* Provide a meaningful content description for accessibility */}
      <p className="my-component__content" aria-label="My Component Content">
        {safeContent}
      </p>
    </div>
  );
});

// Ensure that the component has a meaningful display name for debugging and maintainability
MyComponent.displayName = 'MyComponent';

export default MyComponent;