import React, { PropsWithChildren, DetailedHTMLProps, HTMLAttributes } from 'react';

interface MyComponentProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  /**
   * The message to be displayed in the component.
   */
  content: string;

  /**
   * Additional classes to be applied to the component for styling.
   */
  className?: string;

  /**
   * A boolean flag to indicate if the content should be hidden visually.
   */
  hidden?: boolean;

  /**
   * A custom id for accessibility purposes.
   */
  id?: string;
}

/**
 * MyComponent is a simple React functional component that displays a message.
 * It is intended to be used in the EcoSkill Hub learning platform.
 */
const MyComponent: React.FC<MyComponentProps> = ({
  content,
  className,
  hidden = false,
  id,
  style,
  children,
  ...rest
}) => {
  const componentClasses = `my-component ${className || ''}`;

  // Handle edge case when `hidden` is not a boolean
  if (typeof hidden !== 'boolean') {
    throw new Error('The `hidden` prop must be a boolean.');
  }

  return (
    <div id={id} className={componentClasses} style={{ ...style, display: hidden ? 'none' : 'block' }} {...rest}>
      {children || content}
    </div>
  );
};

export default MyComponent;

import React, { PropsWithChildren, DetailedHTMLProps, HTMLAttributes } from 'react';

interface MyComponentProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  /**
   * The message to be displayed in the component.
   */
  content: string;

  /**
   * Additional classes to be applied to the component for styling.
   */
  className?: string;

  /**
   * A boolean flag to indicate if the content should be hidden visually.
   */
  hidden?: boolean;

  /**
   * A custom id for accessibility purposes.
   */
  id?: string;
}

/**
 * MyComponent is a simple React functional component that displays a message.
 * It is intended to be used in the EcoSkill Hub learning platform.
 */
const MyComponent: React.FC<MyComponentProps> = ({
  content,
  className,
  hidden = false,
  id,
  style,
  children,
  ...rest
}) => {
  const componentClasses = `my-component ${className || ''}`;

  // Handle edge case when `hidden` is not a boolean
  if (typeof hidden !== 'boolean') {
    throw new Error('The `hidden` prop must be a boolean.');
  }

  return (
    <div id={id} className={componentClasses} style={{ ...style, display: hidden ? 'none' : 'block' }} {...rest}>
      {children || content}
    </div>
  );
};

export default MyComponent;