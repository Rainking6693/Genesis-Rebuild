import React, { memo, useMemo, ReactNode } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string | ReactNode;
  'aria-label'?: string;
  className?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({ title, content, 'aria-label': ariaLabel = 'My Component', className = 'my-component' }) => {
    const safeTitle = useMemo(() => title || 'Default Title', [title]);
    const safeContent = useMemo(() => content || 'Default Content', [content]);

    return (
      <div className={className} aria-label={ariaLabel}>
        <h1 className={`${className}__title`} aria-label="Title">
          {safeTitle}
        </h1>
        <div className={`${className}__content`} aria-label="Content">
          {typeof safeContent === 'string' ? <p>{safeContent}</p> : safeContent}
        </div>
      </div>
    );
  }
);

MyComponent.displayName = 'MyComponent';

export default MyComponent;

import React, { memo, useMemo, ReactNode } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string | ReactNode;
  'aria-label'?: string;
  className?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({ title, content, 'aria-label': ariaLabel = 'My Component', className = 'my-component' }) => {
    const safeTitle = useMemo(() => title || 'Default Title', [title]);
    const safeContent = useMemo(() => content || 'Default Content', [content]);

    return (
      <div className={className} aria-label={ariaLabel}>
        <h1 className={`${className}__title`} aria-label="Title">
          {safeTitle}
        </h1>
        <div className={`${className}__content`} aria-label="Content">
          {typeof safeContent === 'string' ? <p>{safeContent}</p> : safeContent}
        </div>
      </div>
    );
  }
);

MyComponent.displayName = 'MyComponent';

export default MyComponent;