import React, { FC, ReactNode, DetailedHTMLProps, TextareaHTMLAttributes } from 'react';
import DOMPurify from 'dompurify';
import PropTypes from 'prop-types';

interface Props extends DetailedHTMLProps<TextareaHTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const MyComponent: FC<Props> = ({ className, style, message, ...rest }: Props) => {
  const sanitizedMessage = DOMPurify.sanitize(message);

  // Add aria-label for accessibility
  const ariaLabel = 'Message content';
  const ariaAttributes = { 'aria-label': ariaLabel };

  // Merge className and ariaAttributes to avoid potential conflicts
  const combinedClasses = `${className} ${Object.keys(ariaAttributes).join(' ')}`;

  return (
    <div {...rest} className={combinedClasses} style={style} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
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

export default MyComponent;

import React, { FC, ReactNode, DetailedHTMLProps, TextareaHTMLAttributes } from 'react';
import DOMPurify from 'dompurify';
import PropTypes from 'prop-types';

interface Props extends DetailedHTMLProps<TextareaHTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const MyComponent: FC<Props> = ({ className, style, message, ...rest }: Props) => {
  const sanitizedMessage = DOMPurify.sanitize(message);

  // Add aria-label for accessibility
  const ariaLabel = 'Message content';
  const ariaAttributes = { 'aria-label': ariaLabel };

  // Merge className and ariaAttributes to avoid potential conflicts
  const combinedClasses = `${className} ${Object.keys(ariaAttributes).join(' ')}`;

  return (
    <div {...rest} className={combinedClasses} style={style} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
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

export default MyComponent;