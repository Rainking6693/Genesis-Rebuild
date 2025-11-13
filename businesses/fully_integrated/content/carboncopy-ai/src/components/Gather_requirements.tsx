import React, { FC, ReactNode, DetailedHTMLProps, TextareaHTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import { sanitize } from 'isomorphic-dompurify';

interface Props extends DetailedHTMLProps<TextareaHTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const MyComponent: FC<Props> = ({ message, ...rest }) => {
  // Sanitize the input to prevent XSS attacks
  const sanitizedMessage = sanitize(message);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} {...rest} />;
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
import { sanitize } from 'isomorphic-dompurify';

interface Props extends DetailedHTMLProps<TextareaHTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const MyComponent: FC<Props> = ({ message, ...rest }) => {
  // Sanitize the input to prevent XSS attacks
  const sanitizedMessage = sanitize(message);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} {...rest} />;
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

export default MyComponent;