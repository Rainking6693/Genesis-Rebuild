import React, { FC, DetailedHTMLProps, HTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const sanitizeHtml = (html: string) => DOMPurify.sanitize(html);

const MyComponent: FC<Props> = ({ className, style, message, ...rest }) => {
  const sanitizedMessage = sanitizeHtml(message);

  return (
    <div
      className={className}
      style={style}
      {...rest}
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
    />
  );
};

MyComponent.defaultProps = {
  className: '',
  style: {},
  message: '',
};

MyComponent.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  message: PropTypes.string.isRequired,
};

// Use named export for better maintainability
export { MyComponent };

In this updated code, I've added the following improvements:

1. Imported `DOMPurify` library to sanitize the `message` before rendering.
2. Used `DetailedHTMLProps` to type the additional props.
3. Added default props for `className`, `style`, and `message`.
4. Used `PropTypes.object` instead of `PropTypes.shape` for the `style` prop for better maintainability.
5. Used `PropTypes.string` for the `message` prop with the `isRequired` option.
6. Imported the sanitizeHtml function at the top for better organization.