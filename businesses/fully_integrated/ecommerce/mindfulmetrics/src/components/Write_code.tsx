import React, { memo, ReactNode, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string | ReactNode;
  'data-testid'?: string;
  className?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({ title, content, 'data-testid': dataTestId = 'my-component', className = 'my-component' }) => {
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
          <div data-testid="content" className={`${className}__content`}>
            {content}
          </div>
        ) : null,
      [content, className]
    );

    return (
      <div data-testid={dataTestId} className={className}>
        {titleElement}
        {contentElement}
      </div>
    );
  }
);

export default MyComponent;

import React, { memo, ReactNode, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string | ReactNode;
  'data-testid'?: string;
  className?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({ title, content, 'data-testid': dataTestId = 'my-component', className = 'my-component' }) => {
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
          <div data-testid="content" className={`${className}__content`}>
            {content}
          </div>
        ) : null,
      [content, className]
    );

    return (
      <div data-testid={dataTestId} className={className}>
        {titleElement}
        {contentElement}
      </div>
    );
  }
);

export default MyComponent;