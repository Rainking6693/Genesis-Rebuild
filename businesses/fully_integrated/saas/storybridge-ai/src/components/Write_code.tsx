import React, { FC, DetailedHTMLProps } from 'react';
import PropTypes from 'prop-types';

interface MyComponentProps extends DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const MyComponent: FC<MyComponentProps> = ({ message = '', ...props }) => {
  // Sanitize the input message to prevent any potential XSS attacks
  const sanitizedMessage = message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  return (
    <div
      {...props}
      aria-label="MyComponent"
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
    />
  );
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

export default MyComponent;

import React, { FC, DetailedHTMLProps } from 'react';
import PropTypes from 'prop-types';

interface MyComponentProps extends DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const MyComponent: FC<MyComponentProps> = ({ message = '', ...props }) => {
  // Sanitize the input message to prevent any potential XSS attacks
  const sanitizedMessage = message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  return (
    <div
      {...props}
      aria-label="MyComponent"
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
    />
  );
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

export default MyComponent;