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
    const componentId = useMemo(() => `my-component-${Math.random().toString(36).substring(2, 9)}`, []);

    return (
      <div
        data-testid="my-component"
        className="my-component"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        {title && (
          <h2 data-testid="title" className="my-component__title" id={`${componentId}-title`}>
            {title}
          </h2>
        )}
        {content && (
          <p data-testid="content" className="my-component__content" id={`${componentId}-content`}>
            {content}
          </p>
        )}
        {children && <div className="my-component__children">{children}</div>}
      </div>
    );
  }
);

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
    const componentId = useMemo(() => `my-component-${Math.random().toString(36).substring(2, 9)}`, []);

    return (
      <div
        data-testid="my-component"
        className="my-component"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        {title && (
          <h2 data-testid="title" className="my-component__title" id={`${componentId}-title`}>
            {title}
          </h2>
        )}
        {content && (
          <p data-testid="content" className="my-component__content" id={`${componentId}-content`}>
            {content}
          </p>
        )}
        {children && <div className="my-component__children">{children}</div>}
      </div>
    );
  }
);

export default MyComponent;