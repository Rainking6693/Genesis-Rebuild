import React, { memo, useMemo, ReactNode } from 'react';

interface MyComponentProps {
  title?: string | ReactNode;
  content?: string | ReactNode;
  'aria-label'?: string;
  className?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({ title, content, 'aria-label': ariaLabel, className = 'my-component' }) => {
    const safeTitle = useMemo(() => title || 'Default Title', [title]);
    const safeContent = useMemo(() => content || 'Default Content', [content]);
    const safeAriaLabel = useMemo(() => ariaLabel || (typeof safeTitle === 'string' ? safeTitle : ''), [
      ariaLabel,
      safeTitle,
    ]);

    return (
      <div className={className} aria-label={safeAriaLabel}>
        <h1 className={`${className}__title`} aria-label={safeAriaLabel}>
          {safeTitle}
        </h1>
        <p className={`${className}__content`} aria-label={safeAriaLabel}>
          {safeContent}
        </p>
      </div>
    );
  }
);

MyComponent.displayName = 'MyComponent';

export default MyComponent;

import React, { memo, useMemo, ReactNode } from 'react';

interface MyComponentProps {
  title?: string | ReactNode;
  content?: string | ReactNode;
  'aria-label'?: string;
  className?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({ title, content, 'aria-label': ariaLabel, className = 'my-component' }) => {
    const safeTitle = useMemo(() => title || 'Default Title', [title]);
    const safeContent = useMemo(() => content || 'Default Content', [content]);
    const safeAriaLabel = useMemo(() => ariaLabel || (typeof safeTitle === 'string' ? safeTitle : ''), [
      ariaLabel,
      safeTitle,
    ]);

    return (
      <div className={className} aria-label={safeAriaLabel}>
        <h1 className={`${className}__title`} aria-label={safeAriaLabel}>
          {safeTitle}
        </h1>
        <p className={`${className}__content`} aria-label={safeAriaLabel}>
          {safeContent}
        </p>
      </div>
    );
  }
);

MyComponent.displayName = 'MyComponent';

export default MyComponent;