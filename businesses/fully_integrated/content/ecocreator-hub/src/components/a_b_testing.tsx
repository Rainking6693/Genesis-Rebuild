import React, { FunctionComponent, DetailedHTMLProps, HTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const MyComponent: FunctionComponent<Props> = ({ message, className, ...rest }) => {
  // Sanitize the message to prevent XSS attacks
  const sanitizedMessage = DOMPurify.sanitize(message);

  return (
    <div
      className={className}
      // Use key prop for accessibility and to handle dynamic content
      key={message}
      // Use dangerouslySetInnerHTML for rendering untrusted data
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      {...rest}
    />
  );
};

MyComponent.defaultProps = {
  message: '',
  className: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default MyComponent;

import React, { FunctionComponent, DetailedHTMLProps, HTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const MyComponent: FunctionComponent<Props> = ({ message, className, ...rest }) => {
  // Sanitize the message to prevent XSS attacks
  const sanitizedMessage = DOMPurify.sanitize(message);

  return (
    <div
      className={className}
      // Use key prop for accessibility and to handle dynamic content
      key={message}
      // Use dangerouslySetInnerHTML for rendering untrusted data
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      {...rest}
    />
  );
};

MyComponent.defaultProps = {
  message: '',
  className: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default MyComponent;