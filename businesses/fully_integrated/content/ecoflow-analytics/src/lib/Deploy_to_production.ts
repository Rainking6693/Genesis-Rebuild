import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

// Use named export for better readability and maintainability
export const MyComponent: FC<MyProps> = ({
  children,
  dangerouslySetInnerHTML,
  as,
  className,
  style,
  ...rest
}) => {
  // Check if both children and dangerouslySetInnerHTML are provided, and throw an error if so
  if (children && dangerouslySetInnerHTML) {
    throw new Error('Either provide children or dangerouslySetInnerHTML, but not both.');
  }

  // Use children when provided, and dangerouslySetInnerHTML when not
  const content = children ? children : (dangerouslySetInnerHTML && <div dangerouslySetInnerHTML={dangerouslySetInnerHTML} />);

  // Add support for custom HTML tag and class name
  const Tag = as || 'div';
  const classes = className || '';

  return (
    <Tag {...rest} className={classes} style={style}>
      {content}
    </Tag>
  );
};

// Interface for props, including HTMLAttributes for better accessibility support
interface MyProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message?: string;
  as?: React.ElementType;
}

// Use the Props interface for MyComponent
export const MyComponentWithMessage: FC<MyProps> = ({ message, as, className, style, ...rest }) => {
  // If message is provided, use it as children, otherwise use an empty string
  const children = message ? <>{message}</> : '';

  return (
    <MyComponent as={as} className={className} style={style} {...rest}>
      {children}
    </MyComponent>
  );
};

import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

// Use named export for better readability and maintainability
export const MyComponent: FC<MyProps> = ({
  children,
  dangerouslySetInnerHTML,
  as,
  className,
  style,
  ...rest
}) => {
  // Check if both children and dangerouslySetInnerHTML are provided, and throw an error if so
  if (children && dangerouslySetInnerHTML) {
    throw new Error('Either provide children or dangerouslySetInnerHTML, but not both.');
  }

  // Use children when provided, and dangerouslySetInnerHTML when not
  const content = children ? children : (dangerouslySetInnerHTML && <div dangerouslySetInnerHTML={dangerouslySetInnerHTML} />);

  // Add support for custom HTML tag and class name
  const Tag = as || 'div';
  const classes = className || '';

  return (
    <Tag {...rest} className={classes} style={style}>
      {content}
    </Tag>
  );
};

// Interface for props, including HTMLAttributes for better accessibility support
interface MyProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message?: string;
  as?: React.ElementType;
}

// Use the Props interface for MyComponent
export const MyComponentWithMessage: FC<MyProps> = ({ message, as, className, style, ...rest }) => {
  // If message is provided, use it as children, otherwise use an empty string
  const children = message ? <>{message}</> : '';

  return (
    <MyComponent as={as} className={className} style={style} {...rest}>
      {children}
    </MyComponent>
  );
};