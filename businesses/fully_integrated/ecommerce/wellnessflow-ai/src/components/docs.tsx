import React, { memo, ReactNode, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
  children?: ReactNode;
  'data-testid'?: string;
  className?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({ title, content, children, 'data-testid': dataTestId = 'my-component', className = 'my-component' }) => {
    const titleElement = useMemo(
      () =>
        title ? (
          <h1 data-testid="title" className={`${className}__title`}>
            {title}
          </h1>
        ) : null,
      [title, className]
    );

    const contentElement = useMemo(
      () =>
        content ? (
          <p data-testid="content" className={`${className}__content`}>
            {content}
          </p>
        ) : null,
      [content, className]
    );

    const childrenElement = useMemo(
      () => (children ? <div className={`${className}__children`}>{children}</div> : null),
      [children, className]
    );

    return (
      <div data-testid={dataTestId} className={className}>
        {titleElement}
        {contentElement}
        {childrenElement}
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
  'data-testid'?: string;
  className?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({ title, content, children, 'data-testid': dataTestId = 'my-component', className = 'my-component' }) => {
    const titleElement = useMemo(
      () =>
        title ? (
          <h1 data-testid="title" className={`${className}__title`}>
            {title}
          </h1>
        ) : null,
      [title, className]
    );

    const contentElement = useMemo(
      () =>
        content ? (
          <p data-testid="content" className={`${className}__content`}>
            {content}
          </p>
        ) : null,
      [content, className]
    );

    const childrenElement = useMemo(
      () => (children ? <div className={`${className}__children`}>{children}</div> : null),
      [children, className]
    );

    return (
      <div data-testid={dataTestId} className={className}>
        {titleElement}
        {contentElement}
        {childrenElement}
      </div>
    );
  }
);

export default MyComponent;