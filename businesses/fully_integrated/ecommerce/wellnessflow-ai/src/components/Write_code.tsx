import React, { memo, useMemo, ReactNode } from 'react';

interface MyComponentProps {
  title?: string | ReactNode;
  content?: string | ReactNode;
  className?: string;
  'aria-label'?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content, className = 'my-component', 'aria-label': ariaLabel = 'My Component' }) => {
  const safeTitle = useMemo(() => {
    if (typeof title === 'string') {
      return title || 'Default Title';
    } else if (React.isValidElement(title)) {
      return title;
    } else {
      return 'Default Title';
    }
  }, [title]);

  const safeContent = useMemo(() => {
    if (typeof content === 'string') {
      return content || 'Default Content';
    } else if (React.isValidElement(content)) {
      return content;
    } else {
      return 'Default Content';
    }
  }, [content]);

  return (
    <div className={className} aria-label={ariaLabel}>
      <h1 className={`${className}__title`} aria-label="Title">{safeTitle}</h1>
      <p className={`${className}__content`} aria-label="Content">{safeContent}</p>
    </div>
  );
});

export default MyComponent;

import React, { memo, useMemo, ReactNode } from 'react';

interface MyComponentProps {
  title?: string | ReactNode;
  content?: string | ReactNode;
  className?: string;
  'aria-label'?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content, className = 'my-component', 'aria-label': ariaLabel = 'My Component' }) => {
  const safeTitle = useMemo(() => {
    if (typeof title === 'string') {
      return title || 'Default Title';
    } else if (React.isValidElement(title)) {
      return title;
    } else {
      return 'Default Title';
    }
  }, [title]);

  const safeContent = useMemo(() => {
    if (typeof content === 'string') {
      return content || 'Default Content';
    } else if (React.isValidElement(content)) {
      return content;
    } else {
      return 'Default Content';
    }
  }, [content]);

  return (
    <div className={className} aria-label={ariaLabel}>
      <h1 className={`${className}__title`} aria-label="Title">{safeTitle}</h1>
      <p className={`${className}__content`} aria-label="Content">{safeContent}</p>
    </div>
  );
});

export default MyComponent;