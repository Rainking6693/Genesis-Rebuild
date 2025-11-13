import React, { FunctionComponent, ReactNode, DetailedHTMLProps, TextareaHTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

interface Props extends DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
  message: string;
}

const MyComponent: FunctionComponent<Props> = ({ message, ...textareaProps }) => {
  const sanitizedMessage = DOMPurify.sanitize(message);

  return (
    <textarea
      className="my-component" // Add a class for styling and accessibility purposes
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      {...textareaProps} // Pass through any additional props
    />
  );
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

export default MyComponent;

import React, { FunctionComponent, ReactNode, DetailedHTMLProps, TextareaHTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

interface Props extends DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
  message: string;
}

const MyComponent: FunctionComponent<Props> = ({ message, ...textareaProps }) => {
  const sanitizedMessage = DOMPurify.sanitize(message);

  return (
    <textarea
      className="my-component" // Add a class for styling and accessibility purposes
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      {...textareaProps} // Pass through any additional props
    />
  );
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

export default MyComponent;