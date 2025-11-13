import React, { FC, ReactNode, DetailedHTMLProps, TextareaHTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

interface Props extends DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
  children?: ReactNode;
}

const MyComponent: FC<Props> = ({ children, value: message, ...rest }) => {
  // Check if message is safe to render
  const sanitizedMessage = createSanitizedHTML(message);

  // Render children if provided, or the sanitized message
  return (
    <div {...rest}>
      {children || sanitizedMessage}
    </div>
  );
};

MyComponent.defaultProps = {
  value: '',
};

MyComponent.propTypes = {
  value: PropTypes.string,
  children: PropTypes.node,
};

// Add a function to sanitize the HTML
const createSanitizedHTML = (html: string) => {
  return DOMPurify.sanitize(html);
};

export default MyComponent;

import React, { FC, ReactNode, DetailedHTMLProps, TextareaHTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

interface Props extends DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
  children?: ReactNode;
}

const MyComponent: FC<Props> = ({ children, value: message, ...rest }) => {
  // Check if message is safe to render
  const sanitizedMessage = createSanitizedHTML(message);

  // Render children if provided, or the sanitized message
  return (
    <div {...rest}>
      {children || sanitizedMessage}
    </div>
  );
};

MyComponent.defaultProps = {
  value: '',
};

MyComponent.propTypes = {
  value: PropTypes.string,
  children: PropTypes.node,
};

// Add a function to sanitize the HTML
const createSanitizedHTML = (html: string) => {
  return DOMPurify.sanitize(html);
};

export default MyComponent;