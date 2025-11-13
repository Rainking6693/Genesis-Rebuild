import React, { memo, ReactNode, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: ReactNode;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({ title, content, 'aria-label': ariaLabel, 'aria-describedby': ariaDescribedBy }) => {
    const componentClassName = useMemo(() => {
      const baseClassName = 'my-component';
      const classNames = [baseClassName];

      if (title) {
        classNames.push(`${baseClassName}__title`);
      }

      if (content) {
        classNames.push(`${baseClassName}__content`);
      }

      return classNames.join(' ');
    }, [title, content]);

    return (
      <div
        data-testid="my-component"
        className={componentClassName}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        {title && (
          <h1 data-testid="title" className={`${componentClassName}__title`}>
            {title}
          </h1>
        )}
        {content && (
          <div data-testid="content" className={`${componentClassName}__content`}>
            {content}
          </div>
        )}
      </div>
    );
  }
);

MyComponent.displayName = 'MyComponent';

export default MyComponent;

import React, { memo, ReactNode, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: ReactNode;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({ title, content, 'aria-label': ariaLabel, 'aria-describedby': ariaDescribedBy }) => {
    const componentClassName = useMemo(() => {
      const baseClassName = 'my-component';
      const classNames = [baseClassName];

      if (title) {
        classNames.push(`${baseClassName}__title`);
      }

      if (content) {
        classNames.push(`${baseClassName}__content`);
      }

      return classNames.join(' ');
    }, [title, content]);

    return (
      <div
        data-testid="my-component"
        className={componentClassName}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        {title && (
          <h1 data-testid="title" className={`${componentClassName}__title`}>
            {title}
          </h1>
        )}
        {content && (
          <div data-testid="content" className={`${componentClassName}__content`}>
            {content}
          </div>
        )}
      </div>
    );
  }
);

MyComponent.displayName = 'MyComponent';

export default MyComponent;