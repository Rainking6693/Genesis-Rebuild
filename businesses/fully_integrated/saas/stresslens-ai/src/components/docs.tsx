import React, { memo, ReactNode, useMemo } from 'react';
import PropTypes from 'prop-types'; // Optional: For runtime type checking

interface MyComponentProps {
  /**
   * The title of the component.  Displayed as an H1.
   */
  title?: string;
  /**
   * The main content of the component. Displayed as a paragraph.
   */
  content?: string;
  /**
   *  Optional children to render within the component.
   */
  children?: ReactNode;
  /**
   *  Custom CSS class name to apply to the root element.
   */
  className?: string;
  /**
   *  Aria label for the component.  Important for accessibility.
   */
  ariaLabel?: string;
  /**
   *  Heading level for the title. Defaults to 1 (h1).  Must be between 1 and 6.
   */
  titleHeadingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({ title, content, children, className, ariaLabel, titleHeadingLevel = 1 }) => {
    const HeadingTag = useMemo(() => {
      if (titleHeadingLevel < 1 || titleHeadingLevel > 6) {
        console.warn(
          'MyComponent: titleHeadingLevel must be between 1 and 6. Defaulting to 1 (h1).'
        );
        return 'h1';
      }
      return `h${titleHeadingLevel}` as keyof JSX.IntrinsicElements;
    }, [titleHeadingLevel]);

    const rootClassName = useMemo(() => {
      let classNames = 'my-component';
      if (className) {
        classNames += ` ${className}`;
      }
      return classNames;
    }, [className]);

    return (
      <div
        data-testid="my-component"
        className={rootClassName}
        aria-label={ariaLabel}
        role={ariaLabel ? 'region' : undefined} // Add role if ariaLabel is provided
      >
        {title && (
          // Use the dynamic HeadingTag
          <HeadingTag data-testid="title" className="my-component__title">
            {title}
          </HeadingTag>
        )}
        {content && (
          <p data-testid="content" className="my-component__content">
            {content}
          </p>
        )}
        {children && (
          <div data-testid="children" className="my-component__children">
            {children}
          </div>
        )}
      </div>
    );
  }
);

MyComponent.displayName = 'MyComponent'; // Helps with debugging

// Optional: Add propTypes for runtime type checking (if not using TypeScript exclusively)
MyComponent.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
  titleHeadingLevel: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
};

export default MyComponent;

import React, { memo, ReactNode, useMemo } from 'react';
import PropTypes from 'prop-types'; // Optional: For runtime type checking

interface MyComponentProps {
  /**
   * The title of the component.  Displayed as an H1.
   */
  title?: string;
  /**
   * The main content of the component. Displayed as a paragraph.
   */
  content?: string;
  /**
   *  Optional children to render within the component.
   */
  children?: ReactNode;
  /**
   *  Custom CSS class name to apply to the root element.
   */
  className?: string;
  /**
   *  Aria label for the component.  Important for accessibility.
   */
  ariaLabel?: string;
  /**
   *  Heading level for the title. Defaults to 1 (h1).  Must be between 1 and 6.
   */
  titleHeadingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({ title, content, children, className, ariaLabel, titleHeadingLevel = 1 }) => {
    const HeadingTag = useMemo(() => {
      if (titleHeadingLevel < 1 || titleHeadingLevel > 6) {
        console.warn(
          'MyComponent: titleHeadingLevel must be between 1 and 6. Defaulting to 1 (h1).'
        );
        return 'h1';
      }
      return `h${titleHeadingLevel}` as keyof JSX.IntrinsicElements;
    }, [titleHeadingLevel]);

    const rootClassName = useMemo(() => {
      let classNames = 'my-component';
      if (className) {
        classNames += ` ${className}`;
      }
      return classNames;
    }, [className]);

    return (
      <div
        data-testid="my-component"
        className={rootClassName}
        aria-label={ariaLabel}
        role={ariaLabel ? 'region' : undefined} // Add role if ariaLabel is provided
      >
        {title && (
          // Use the dynamic HeadingTag
          <HeadingTag data-testid="title" className="my-component__title">
            {title}
          </HeadingTag>
        )}
        {content && (
          <p data-testid="content" className="my-component__content">
            {content}
          </p>
        )}
        {children && (
          <div data-testid="children" className="my-component__children">
            {children}
          </div>
        )}
      </div>
    );
  }
);

MyComponent.displayName = 'MyComponent'; // Helps with debugging

// Optional: Add propTypes for runtime type checking (if not using TypeScript exclusively)
MyComponent.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
  titleHeadingLevel: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
};

export default MyComponent;