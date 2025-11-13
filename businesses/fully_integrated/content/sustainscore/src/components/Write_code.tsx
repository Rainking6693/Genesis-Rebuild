import React, { memo, useMemo, ReactNode } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string | ReactNode;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({
    title,
    content,
    className = 'my-component',
    titleClassName = 'my-component__title',
    contentClassName = 'my-component__content',
  }) => {
    // Memoize the rendered content to avoid unnecessary re-renders
    const renderedContent = useMemo(() => {
      return (
        <>
          {title && <h1 className={titleClassName}>{title}</h1>}
          {content && (
            <div className={contentClassName}>
              {typeof content === 'string' ? <p>{content}</p> : content}
            </div>
          )}
        </>
      );
    }, [title, content, titleClassName, contentClassName]);

    return (
      <div
        className={className}
        aria-label={title || 'Content Component'}
        role="region"
      >
        {renderedContent}
      </div>
    );
  }
);

export default MyComponent;

import React, { memo, useMemo, ReactNode } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string | ReactNode;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({
    title,
    content,
    className = 'my-component',
    titleClassName = 'my-component__title',
    contentClassName = 'my-component__content',
  }) => {
    // Memoize the rendered content to avoid unnecessary re-renders
    const renderedContent = useMemo(() => {
      return (
        <>
          {title && <h1 className={titleClassName}>{title}</h1>}
          {content && (
            <div className={contentClassName}>
              {typeof content === 'string' ? <p>{content}</p> : content}
            </div>
          )}
        </>
      );
    }, [title, content, titleClassName, contentClassName]);

    return (
      <div
        className={className}
        aria-label={title || 'Content Component'}
        role="region"
      >
        {renderedContent}
      </div>
    );
  }
);

export default MyComponent;