import React, { memo, ReactNode, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
  children?: ReactNode;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({ title, content, children, 'aria-label': ariaLabel, 'aria-describedby': ariaDescribedBy }) => {
    const hasContent = useMemo(() => title || content || children, [title, content, children]);

    if (!hasContent) {
      return null;
    }

    return (
      <div
        data-testid="my-component"
        className="my-component"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        {title && (
          <h1 data-testid="title" className="my-component__title">
            {title}
          </h1>
        )}
        {content && (
          <p data-testid="content" className="my-component__content">
            {content}
          </p>
        )}
        {children && <div className="my-component__children">{children}</div>}
      </div>
    );
  }
);

MyComponent.displayName = 'MyComponent';

export default MyComponent;

import React, { memo, ReactNode, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
  children?: ReactNode;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({ title, content, children, 'aria-label': ariaLabel, 'aria-describedby': ariaDescribedBy }) => {
    const hasContent = useMemo(() => title || content || children, [title, content, children]);

    if (!hasContent) {
      return null;
    }

    return (
      <div
        data-testid="my-component"
        className="my-component"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        {title && (
          <h1 data-testid="title" className="my-component__title">
            {title}
          </h1>
        )}
        {content && (
          <p data-testid="content" className="my-component__content">
            {content}
          </p>
        )}
        {children && <div className="my-component__children">{children}</div>}
      </div>
    );
  }
);

MyComponent.displayName = 'MyComponent';

export default MyComponent;