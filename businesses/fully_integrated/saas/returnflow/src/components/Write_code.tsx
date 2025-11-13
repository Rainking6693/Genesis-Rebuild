import React, { memo, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
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
  const safeTitle = useMemo(() => title || 'Default Title', [title]);
  const safeContent = useMemo(() => content || 'Default Content', [content]);

  return (
    <div
      className={className}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      <h1 className={titleClassName}>{safeTitle}</h1>
      <p className={contentClassName}>{safeContent}</p>
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
  const safeTitle = useMemo(() => title || 'Default Title', [title]);
  const safeContent = useMemo(() => content || 'Default Content', [content]);

  return (
    <div
      className={className}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      <h1 className={titleClassName}>{safeTitle}</h1>
      <p className={contentClassName}>{safeContent}</p>
    </div>
  );
};

export default memo(MyComponent);