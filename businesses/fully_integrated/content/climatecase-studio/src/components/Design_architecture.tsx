import React, { memo, useMemo, ReactNode } from 'react';

interface MyComponentProps {
  title?: string | ReactNode;
  content?: string | ReactNode;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({
  title,
  content,
  className = 'my-component',
  titleClassName = 'my-component__title',
  contentClassName = 'my-component__content',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}) => {
  const memoizedTitle = useMemo(() => {
    if (typeof title === 'string') {
      return title || 'Default Title';
    }
    return title || <span>Default Title</span>;
  }, [title]);

  const memoizedContent = useMemo(() => {
    if (typeof content === 'string') {
      return content || 'Default Content';
    }
    return content || <span>Default Content</span>;
  }, [content]);

  return (
    <div
      className={className}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      <h1 className={titleClassName}>{memoizedTitle}</h1>
      <p className={contentClassName}>{memoizedContent}</p>
    </div>
  );
};

export default memo(MyComponent);

import React, { memo, useMemo, ReactNode } from 'react';

interface MyComponentProps {
  title?: string | ReactNode;
  content?: string | ReactNode;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({
  title,
  content,
  className = 'my-component',
  titleClassName = 'my-component__title',
  contentClassName = 'my-component__content',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}) => {
  const memoizedTitle = useMemo(() => {
    if (typeof title === 'string') {
      return title || 'Default Title';
    }
    return title || <span>Default Title</span>;
  }, [title]);

  const memoizedContent = useMemo(() => {
    if (typeof content === 'string') {
      return content || 'Default Content';
    }
    return content || <span>Default Content</span>;
  }, [content]);

  return (
    <div
      className={className}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      <h1 className={titleClassName}>{memoizedTitle}</h1>
      <p className={contentClassName}>{memoizedContent}</p>
    </div>
  );
};

export default memo(MyComponent);