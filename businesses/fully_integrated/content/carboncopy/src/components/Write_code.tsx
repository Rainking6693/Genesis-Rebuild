import React, { memo, useMemo, ReactNode } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string | ReactNode;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({
  title = '',
  content = '',
  className = 'my-component',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}) => {
  const titleClassName = useMemo(
    () => `${className}__title`,
    [className]
  );
  const contentClassName = useMemo(
    () => `${className}__content`,
    [className]
  );

  return (
    <div
      className={className}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      {title && <h1 className={titleClassName}>{title}</h1>}
      {content && (
        <p className={contentClassName}>
          {typeof content === 'string' ? content : content}
        </p>
      )}
    </div>
  );
};

export default memo(MyComponent);

import React, { memo, useMemo, ReactNode } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string | ReactNode;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({
  title = '',
  content = '',
  className = 'my-component',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}) => {
  const titleClassName = useMemo(
    () => `${className}__title`,
    [className]
  );
  const contentClassName = useMemo(
    () => `${className}__content`,
    [className]
  );

  return (
    <div
      className={className}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      {title && <h1 className={titleClassName}>{title}</h1>}
      {content && (
        <p className={contentClassName}>
          {typeof content === 'string' ? content : content}
        </p>
      )}
    </div>
  );
};

export default memo(MyComponent);