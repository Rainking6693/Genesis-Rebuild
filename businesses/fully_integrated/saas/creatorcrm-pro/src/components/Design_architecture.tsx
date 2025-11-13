import React, { FunctionComponent, DetailedHTMLProps, HTMLAttributes } from 'react';
import classnames from 'classnames';
import { forwardRef } from 'react';

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  message: string;
  isError?: boolean;
  ariaLabel?: string;
};

const CreatorCRMProMessage = forwardRef<HTMLDivElement, Props>(({ className, message, isError = false, ariaLabel, ...rest }, ref) => {
  const classes = classnames('creator-crm-pro-message', { 'error': isError });

  return (
    <div className={classes} ref={ref} {...rest}>
      {ariaLabel && <span className="sr-only">{ariaLabel}</span>}
      {message}
    </div>
  );
});

CreatorCRMProMessage.displayName = 'CreatorCRMProMessage';

export default CreatorCRMProMessage;

1. Added the `forwardRef` higher-order component to enable passing the ref to parent components.
2. Added an `ariaLabel` prop to improve accessibility.
3. Added a `displayName` to make it easier to identify the component in the React DevTools.
4. Used the ternary operator to simplify the `isError` check.
5. Added an `sr-only` class to the accessibility-related text, which hides it from screen readers but makes it visible to assistive technologies.
6. Used the `{...rest}` spread operator to pass any additional props to the base `div` element.