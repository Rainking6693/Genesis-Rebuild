import React, { FC, PropsWithChildren, DefaultHTMLProps, DetailedHTMLProps } from 'react';
import PropTypes from 'prop-types';
import { sanitizeHtml as sanitize } from 'sanitize-html';
import { sanitizeOptions as sanitizeOptionsDef } from 'sanitize-html';

interface MyComponentProps extends DetailedHTMLProps<DefaultHTMLProps<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const sanitizeOptions: Partial<sanitizeOptionsDef> = {
  allowedTags: ['div'],
  allowedAttributes: {},
};

const MyComponent: FC<MyComponentProps> = ({ children, ...rest }) => {
  // Validate the message prop
  if (!children) {
    throw new Error('Message prop is required');
  }

  // Sanitize user-provided input before rendering
  const sanitizedChildren = sanitize(children, sanitizeOptions);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedChildren }} {...rest} />;
};

MyComponent.defaultProps = {
  // Set a default value for the message prop
  message: '',
};

MyComponent.propTypes = {
  // Use PropTypes for type checking
  message: PropTypes.string.isRequired,
};

export default MyComponent;

import React, { FC, PropsWithChildren, DefaultHTMLProps, DetailedHTMLProps } from 'react';
import PropTypes from 'prop-types';
import { sanitizeHtml as sanitize } from 'sanitize-html';
import { sanitizeOptions as sanitizeOptionsDef } from 'sanitize-html';

interface MyComponentProps extends DetailedHTMLProps<DefaultHTMLProps<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const sanitizeOptions: Partial<sanitizeOptionsDef> = {
  allowedTags: ['div'],
  allowedAttributes: {},
};

const MyComponent: FC<MyComponentProps> = ({ children, ...rest }) => {
  // Validate the message prop
  if (!children) {
    throw new Error('Message prop is required');
  }

  // Sanitize user-provided input before rendering
  const sanitizedChildren = sanitize(children, sanitizeOptions);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedChildren }} {...rest} />;
};

MyComponent.defaultProps = {
  // Set a default value for the message prop
  message: '',
};

MyComponent.propTypes = {
  // Use PropTypes for type checking
  message: PropTypes.string.isRequired,
};

export default MyComponent;