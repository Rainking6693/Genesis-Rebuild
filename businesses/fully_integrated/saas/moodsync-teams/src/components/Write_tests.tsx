import React, { forwardRef, Ref, HTMLAttributes, DetailedHTMLProps } from 'react';
import { ReactNode } from 'react';

type CustomProps = {
  message?: string;
  children?: ReactNode;
};

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & CustomProps;

const MyComponent = forwardRef((props: Props, ref: Ref<HTMLDivElement>) => {
  const { children, message, ...rest } = props;

  // Add a default message for edge cases where children are not provided
  const displayMessage = children || (message || 'No message provided');

  // Add a role attribute for accessibility
  const role = 'alert';

  // Add aria-label for better accessibility
  const ariaLabel = `Message: ${displayMessage}`;

  // Add a className for styling and maintainability
  const className = props.className || '';

  return (
    <div {...rest} ref={ref} role={role} aria-label={ariaLabel} className={className}>
      {displayMessage}
    </div>
  );
});

MyComponent.displayName = 'MyComponent';

export default MyComponent;

import React, { forwardRef, Ref, HTMLAttributes, DetailedHTMLProps } from 'react';
import { ReactNode } from 'react';

type CustomProps = {
  message?: string;
  children?: ReactNode;
};

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & CustomProps;

const MyComponent = forwardRef((props: Props, ref: Ref<HTMLDivElement>) => {
  const { children, message, ...rest } = props;

  // Add a default message for edge cases where children are not provided
  const displayMessage = children || (message || 'No message provided');

  // Add a role attribute for accessibility
  const role = 'alert';

  // Add aria-label for better accessibility
  const ariaLabel = `Message: ${displayMessage}`;

  // Add a className for styling and maintainability
  const className = props.className || '';

  return (
    <div {...rest} ref={ref} role={role} aria-label={ariaLabel} className={className}>
      {displayMessage}
    </div>
  );
});

MyComponent.displayName = 'MyComponent';

export default MyComponent;