import React, { memo, ReactNode, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: ReactNode;
  'aria-label'?: string;
  'aria-describedby'?: string;
  className?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({ title, content, 'aria-label': ariaLabel, 'aria-describedby': ariaDescribedBy, className = 'my-component' }) => {
    const componentClassName = useMemo(() => `${className}__container`, [className]);

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

export default MyComponent;

import React, { memo, ReactNode, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: ReactNode;
  'aria-label'?: string;
  'aria-describedby'?: string;
  className?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({ title, content, 'aria-label': ariaLabel, 'aria-describedby': ariaDescribedBy, className = 'my-component' }) => {
    const componentClassName = useMemo(() => `${className}__container`, [className]);

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

export default MyComponent;