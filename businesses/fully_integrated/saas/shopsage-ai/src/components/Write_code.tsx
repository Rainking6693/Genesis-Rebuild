import React, { FunctionComponent, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import DOMPurify from 'dompurify';

type Props = DetailedHTMLProps<HTMLDivElement, HTMLDivElement> & {
  message?: string;
};

const MyComponent: FunctionComponent<Props> = ({ message, className, ...rest }) => {
  // Sanitize the input to prevent XSS attacks
  const sanitizedMessage = DOMPurify.sanitize(message || '');

  // Ensure message is provided or default to an empty string
  const finalMessage = sanitizedMessage || '';

  // Use className instead of style for better accessibility and maintainability
  return (
    <div className={className} {...rest}>
      {finalMessage && <div dangerouslySetInnerHTML={{ __html: finalMessage }} />}
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: React.PropTypes.string,
  className: React.PropTypes.string,
};

export default MyComponent;

import React, { FunctionComponent, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import DOMPurify from 'dompurify';

type Props = DetailedHTMLProps<HTMLDivElement, HTMLDivElement> & {
  message?: string;
};

const MyComponent: FunctionComponent<Props> = ({ message, className, ...rest }) => {
  // Sanitize the input to prevent XSS attacks
  const sanitizedMessage = DOMPurify.sanitize(message || '');

  // Ensure message is provided or default to an empty string
  const finalMessage = sanitizedMessage || '';

  // Use className instead of style for better accessibility and maintainability
  return (
    <div className={className} {...rest}>
      {finalMessage && <div dangerouslySetInnerHTML={{ __html: finalMessage }} />}
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: React.PropTypes.string,
  className: React.PropTypes.string,
};

export default MyComponent;