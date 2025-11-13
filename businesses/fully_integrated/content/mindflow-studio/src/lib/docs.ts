import React, { FC, PropsWithChildren, DetailedHTMLProps } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

interface Props extends DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: React.ReactNode;
}

const FunctionalComponent: FC<Props> = ({ message, children, ...rest }) => {
  const sanitizedMessage = DOMPurify.sanitize(message);
  const sanitizedChildren = children ? DOMPurify.sanitize(String(children)) : '';

  return <div dangerouslySetInnerHTML={{ __html: sanitizedMessage + sanitizedChildren }} {...rest} />;
};

FunctionalComponent.defaultProps = {
  message: '',
};

FunctionalComponent.propTypes = {
  message: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export { FunctionalComponent };

// SanitizeUserInput.ts
import DOMPurify from 'dompurify';

export const sanitizeUserInput = (input: string) => {
  return DOMPurify.sanitize(input);
};

import React, { FC, PropsWithChildren, DetailedHTMLProps } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

interface Props extends DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: React.ReactNode;
}

const FunctionalComponent: FC<Props> = ({ message, children, ...rest }) => {
  const sanitizedMessage = DOMPurify.sanitize(message);
  const sanitizedChildren = children ? DOMPurify.sanitize(String(children)) : '';

  return <div dangerouslySetInnerHTML={{ __html: sanitizedMessage + sanitizedChildren }} {...rest} />;
};

FunctionalComponent.defaultProps = {
  message: '',
};

FunctionalComponent.propTypes = {
  message: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export { FunctionalComponent };

// SanitizeUserInput.ts
import DOMPurify from 'dompurify';

export const sanitizeUserInput = (input: string) => {
  return DOMPurify.sanitize(input);
};