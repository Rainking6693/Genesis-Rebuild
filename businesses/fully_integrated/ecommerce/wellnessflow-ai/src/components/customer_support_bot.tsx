import React, { memo, useMemo, ReactNode } from 'react';

interface MyComponentProps {
  title?: string | ReactNode;
  content?: string | ReactNode;
  'aria-label'?: string;
  'aria-describedby'?: string;
  className?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({
    title = 'Default Title',
    content = 'Default Content',
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    className = 'my-component',
  }) => {
    const safeTitle = useMemo(() => {
      if (typeof title === 'string') {
        return title;
      }
      return <>{title}</>;
    }, [title]);

    const safeContent = useMemo(() => {
      if (typeof content === 'string') {
        return content;
      }
      return <>{content}</>;
    }, [content]);

    return (
      <div className={className} aria-label={ariaLabel || safeTitle}>
        <h1 className={`${className}__title`} id={`${className}-title`}>
          {safeTitle}
        </h1>
        <p
          className={`${className}__content`}
          aria-describedby={ariaDescribedBy || `${className}-title`}
        >
          {safeContent}
        </p>
      </div>
    );
  }
);

export default MyComponent;

import React, { memo, useMemo, ReactNode } from 'react';

interface MyComponentProps {
  title?: string | ReactNode;
  content?: string | ReactNode;
  'aria-label'?: string;
  'aria-describedby'?: string;
  className?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({
    title = 'Default Title',
    content = 'Default Content',
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    className = 'my-component',
  }) => {
    const safeTitle = useMemo(() => {
      if (typeof title === 'string') {
        return title;
      }
      return <>{title}</>;
    }, [title]);

    const safeContent = useMemo(() => {
      if (typeof content === 'string') {
        return content;
      }
      return <>{content}</>;
    }, [content]);

    return (
      <div className={className} aria-label={ariaLabel || safeTitle}>
        <h1 className={`${className}__title`} id={`${className}-title`}>
          {safeTitle}
        </h1>
        <p
          className={`${className}__content`}
          aria-describedby={ariaDescribedBy || `${className}-title`}
        >
          {safeContent}
        </p>
      </div>
    );
  }
);

export default MyComponent;