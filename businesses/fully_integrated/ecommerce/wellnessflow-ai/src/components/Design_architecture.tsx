import React, { memo, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
  className?: string;
  'aria-label'?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({ title, content, className = 'my-component', 'aria-label': ariaLabel }) => {
    const componentClassName = useMemo(
      () => `${className}__title ${className}__content`,
      [className]
    );

    return (
      <div
        className={className}
        aria-label={ariaLabel || title || 'Component'}
        role="region"
      >
        {title && (
          <h1
            className={`${componentClassName}--title`}
            id={`${className}-title`}
            tabIndex={0}
          >
            {title}
          </h1>
        )}
        {content && (
          <p
            className={`${componentClassName}--content`}
            aria-describedby={title ? `${className}-title` : undefined}
          >
            {content}
          </p>
        )}
      </div>
    );
  }
);

MyComponent.displayName = 'MyComponent';

export default MyComponent;

import React, { memo, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
  className?: string;
  'aria-label'?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({ title, content, className = 'my-component', 'aria-label': ariaLabel }) => {
    const componentClassName = useMemo(
      () => `${className}__title ${className}__content`,
      [className]
    );

    return (
      <div
        className={className}
        aria-label={ariaLabel || title || 'Component'}
        role="region"
      >
        {title && (
          <h1
            className={`${componentClassName}--title`}
            id={`${className}-title`}
            tabIndex={0}
          >
            {title}
          </h1>
        )}
        {content && (
          <p
            className={`${componentClassName}--content`}
            aria-describedby={title ? `${className}-title` : undefined}
          >
            {content}
          </p>
        )}
      </div>
    );
  }
);

MyComponent.displayName = 'MyComponent';

export default MyComponent;