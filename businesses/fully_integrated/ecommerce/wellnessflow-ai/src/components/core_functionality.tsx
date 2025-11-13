import React, { memo, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({
    title = '',
    content = '',
    className = 'my-component',
    titleClassName = 'my-component__title',
    contentClassName = 'my-component__content',
  }) => {
    const memoizedTitle = useMemo(() => {
      if (!title.trim()) return null;
      return <h1 className={titleClassName}>{title}</h1>;
    }, [title, titleClassName]);

    const memoizedContent = useMemo(() => {
      if (!content.trim()) return null;
      return <p className={contentClassName}>{content}</p>;
    }, [content, contentClassName]);

    return (
      <div
        className={className}
        aria-label={`${title ? title : 'Component'} content`}
        role="region"
      >
        {memoizedTitle}
        {memoizedContent}
      </div>
    );
  }
);

export default MyComponent;

import React, { memo, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({
    title = '',
    content = '',
    className = 'my-component',
    titleClassName = 'my-component__title',
    contentClassName = 'my-component__content',
  }) => {
    const memoizedTitle = useMemo(() => {
      if (!title.trim()) return null;
      return <h1 className={titleClassName}>{title}</h1>;
    }, [title, titleClassName]);

    const memoizedContent = useMemo(() => {
      if (!content.trim()) return null;
      return <p className={contentClassName}>{content}</p>;
    }, [content, contentClassName]);

    return (
      <div
        className={className}
        aria-label={`${title ? title : 'Component'} content`}
        role="region"
      >
        {memoizedTitle}
        {memoizedContent}
      </div>
    );
  }
);

export default MyComponent;