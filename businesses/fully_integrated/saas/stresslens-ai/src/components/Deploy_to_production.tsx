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
      {/* Provide meaningful aria-labels for accessibility */}
      <h1 className="my-component__title" aria-label={`Title: ${safeTitle}`}>
        {safeTitle}
      </h1>
      <p className="my-component__content" aria-label={`Content: ${safeContent}`}>
        {safeContent}
      </p>
    </div>
  );
});

// Ensure that the component has a meaningful display name for debugging
MyComponent.displayName = 'MyComponent';

// Add type annotations for better maintainability
type MyComponentType = React.FC<MyComponentProps>;

// Export the component with the type annotation
export default MyComponent as MyComponentType;

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
      {/* Provide meaningful aria-labels for accessibility */}
      <h1 className="my-component__title" aria-label={`Title: ${safeTitle}`}>
        {safeTitle}
      </h1>
      <p className="my-component__content" aria-label={`Content: ${safeContent}`}>
        {safeContent}
      </p>
    </div>
  );
});

// Ensure that the component has a meaningful display name for debugging
MyComponent.displayName = 'MyComponent';

// Add type annotations for better maintainability
type MyComponentType = React.FC<MyComponentProps>;

// Export the component with the type annotation
export default MyComponent as MyComponentType;