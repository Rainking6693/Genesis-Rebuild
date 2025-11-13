import React, { memo, ReactNode } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
  children?: ReactNode;
  'aria-label'?: string;
  'data-testid'?: string;
  className?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({ title, content, children, 'aria-label': ariaLabel, 'data-testid': dataTestId, className = 'my-component' }) => {
    return (
      <div
        data-testid={dataTestId || 'my-component'}
        className={`${className} ${title ? 'my-component--with-title' : ''} ${content ? 'my-component--with-content' : ''} ${
          children ? 'my-component--with-children' : ''
        }`}
        aria-label={ariaLabel}
      >
        {title && (
          <h1 data-testid="title" className={`${className}__title`}>
            {title}
          </h1>
        )}
        {content && (
          <p data-testid="content" className={`${className}__content`}>
            {content}
          </p>
        )}
        {children && <div className={`${className}__children`}>{children}</div>}
      </div>
    );
  }
);

export default MyComponent;

import React, { memo, ReactNode } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
  children?: ReactNode;
  'aria-label'?: string;
  'data-testid'?: string;
  className?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({ title, content, children, 'aria-label': ariaLabel, 'data-testid': dataTestId, className = 'my-component' }) => {
    return (
      <div
        data-testid={dataTestId || 'my-component'}
        className={`${className} ${title ? 'my-component--with-title' : ''} ${content ? 'my-component--with-content' : ''} ${
          children ? 'my-component--with-children' : ''
        }`}
        aria-label={ariaLabel}
      >
        {title && (
          <h1 data-testid="title" className={`${className}__title`}>
            {title}
          </h1>
        )}
        {content && (
          <p data-testid="content" className={`${className}__content`}>
            {content}
          </p>
        )}
        {children && <div className={`${className}__children`}>{children}</div>}
      </div>
    );
  }
);

export default MyComponent;