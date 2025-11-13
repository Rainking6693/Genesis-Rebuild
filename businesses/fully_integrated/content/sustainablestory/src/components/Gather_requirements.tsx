import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import { sanitizeHtml } from './sanitizeHtml'; // Assuming you have a sanitize function for security purposes

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message?: string;
  children?: ReactNode;
  ariaLabel?: string;
}

const MyComponent: FC<Props> = ({ message, children, className, ariaLabel, ...rest }) => {
  const sanitizedMessage = message ? sanitizeHtml(message) : '';

  return (
    <div
      className={className}
      aria-label={ariaLabel}
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      {...rest}
    >
      {children}
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
  children: null,
  className: '',
  ariaLabel: '',
};

MyComponent.propTypes = {
  message: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
};

export default MyComponent;

1. Imported `DetailedHTMLProps` to get access to HTML attributes like `className`.
2. Added `...rest` to pass any additional HTML attributes to the `div` element.
3. Checked if `message` is provided before sanitizing it to avoid errors.
4. Used the `?` operator to make the `message` property optional.
5. Removed the duplicate code for the component definition.