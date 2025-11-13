import React, { FC, ReactNode, DetailedHTMLProps, TextareaHTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

interface Props extends DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
  message: string;
}

const MyComponent: FC<Props> = ({ message, ...rest }: Props) => {
  const sanitizedMessage = DOMPurify.sanitize(message); // Sanitize user-generated message

  return (
    <textarea
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      {...rest} // Forward any additional props
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

import React, { FC, ReactNode, DetailedHTMLProps, TextareaHTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

interface Props extends DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
  message: string;
}

const MyComponent: FC<Props> = ({ message, ...rest }: Props) => {
  const sanitizedMessage = DOMPurify.sanitize(message); // Sanitize user-generated message

  return (
    <textarea
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      {...rest} // Forward any additional props
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