import React, { memo, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({
  title = '',
  content = '',
  className = 'my-component',
  titleClassName = 'my-component__title',
  contentClassName = 'my-component__content',
}) => {
  const memoizedTitle = useMemo(() => title.trim(), [title]);
  const memoizedContent = useMemo(() => content.trim(), [content]);

  return (
    <div className={className}>
      {memoizedTitle && (
        <h1 className={titleClassName} aria-label={memoizedTitle}>
          {memoizedTitle}
        </h1>
      )}
      {memoizedContent && (
        <p className={contentClassName} aria-label={memoizedContent}>
          {memoizedContent}
        </p>
      )}
    </div>
  );
};

export default memo(MyComponent);

import React, { memo, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({
  title = '',
  content = '',
  className = 'my-component',
  titleClassName = 'my-component__title',
  contentClassName = 'my-component__content',
}) => {
  const memoizedTitle = useMemo(() => title.trim(), [title]);
  const memoizedContent = useMemo(() => content.trim(), [content]);

  return (
    <div className={className}>
      {memoizedTitle && (
        <h1 className={titleClassName} aria-label={memoizedTitle}>
          {memoizedTitle}
        </h1>
      )}
      {memoizedContent && (
        <p className={contentClassName} aria-label={memoizedContent}>
          {memoizedContent}
        </p>
      )}
    </div>
  );
};

export default memo(MyComponent);